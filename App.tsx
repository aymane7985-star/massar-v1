
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatsSection from './components/StatsSection';
import StudentTable from './components/StudentTable';
import AddNoteModal from './components/AddNoteModal';
import ObservationRulesModal from './components/ObservationRulesModal';
import VoiceEntryModal from './components/VoiceEntryModal';
import ProfileModal from './components/ProfileModal';
import DashboardHome from './components/DashboardHome';
import { Language, Student, ClassInfo, ObservationRule, SubjectData, UserProfile } from './types';
import { TRANSLATIONS, MOCK_CLASSES, MOCK_STUDENTS } from './constants';
import { Languages, Bell, Search, Loader2, Menu as MenuIcon, Mic, FileUp, BookOpen, Plus, Sun, Moon } from 'lucide-react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const [currentView, setCurrentView] = useState<'dashboard' | 'class'>('dashboard');
  const [classes, setClasses] = useState<ClassInfo[]>(MOCK_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState(MOCK_CLASSES[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Pr. Amrani',
    email: 'amrani@massar.edu.ma',
    avatar: 'https://picsum.photos/seed/prof/100',
    subject: 'Mathématiques'
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize students with the first class's default subject data
  const [students, setStudents] = useState<Student[]>(MOCK_CLASSES[0].subjectData['Mathématiques']?.students || []);
  
  // New State for Subjects
  const [activeSubject, setActiveSubject] = useState<string>('Mathématiques');
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // State to track if we are in "New Class" mode
  const [isNewClassMode, setIsNewClassMode] = useState(false);
  
  const [observationRules, setObservationRules] = useState<ObservationRule[]>([
    { id: '1', min: 18, max: 20, template: "Excellent travail [nom], continue ainsi!" },
    { id: '2', min: 14, max: 17.99, template: "Très bon semestre [nom], très sérieux." },
    { id: '3', min: 10, max: 13.99, template: "Passable, [nom] doit redoubler d'efforts." },
    { id: '4', min: 0, max: 9.99, template: "Résultats insuffisants, [nom] doit se ressaisir." },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';
  
  // Define a temporary class object for the new class view
  const newClassTemp: ClassInfo = {
    id: 'new-temp',
    name: t.newClass,
    count: 0,
    average: 0,
    successRate: 0,
    isPinned: false,
    isFavorite: false,
    subjects: ['Mathématiques'],
    subjectData: {
      'Mathématiques': { students: [] }
    }
  };

  const currentClass = isNewClassMode 
    ? newClassTemp 
    : classes.find(c => c.id === selectedClassId) || classes[0];

  // Dynamic Class Stats based on current students data
  const calculateClassStats = (currentStudents: Student[]): ClassInfo => {
    if (!currentStudents.length) return currentClass;
    
    const allGrades = currentStudents.flatMap(s => s.grades);
    const avg = allGrades.reduce((a, b) => a + b, 0) / (allGrades.length || 1);
    const passedCount = currentStudents.filter(s => {
      const sAvg = s.grades.reduce((a, b) => a + b, 0) / 4;
      return sAvg >= 10;
    }).length;
    
    return {
      ...currentClass,
      count: currentStudents.length,
      average: parseFloat(avg.toFixed(2)),
      successRate: Math.round((passedCount / currentStudents.length) * 100)
    };
  };
  
  const activeClassStats = isNewClassMode ? currentClass : calculateClassStats(students);

  const toggleLanguage = () => {
    setLang(prev => prev === 'fr' ? 'ar' : 'fr');
  };
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleSubjectChange = (newSubject: string) => {
    // 1. Save current students to the previous subject in the state
    if (!isNewClassMode) {
      setClasses(prevClasses => prevClasses.map(cls => {
        if (cls.id === currentClass.id) {
          return {
            ...cls,
            subjectData: {
              ...cls.subjectData,
              [activeSubject]: {
                ...cls.subjectData[activeSubject],
                students: students // Save current view state
              }
            }
          };
        }
        return cls;
      }));
    }

    // 2. Load students for the new subject
    setActiveSubject(newSubject);
    
    if (isNewClassMode) {
       // In new class mode, we likely don't have stored data yet unless we just added it, but for temp navigation:
       setStudents([]);
    } else {
      const targetClass = classes.find(c => c.id === currentClass.id);
      const subjectData = targetClass?.subjectData[newSubject];
      
      if (subjectData) {
        setStudents(subjectData.students);
      } else {
        // Fallback/Init if empty
        setStudents([]); 
      }
    }
  };

  const META_MAPPING = {
    academie: "C7",
    direction: "H7",
    niveau: "C9",
    classe: "H9",
    session: "C11",
    examen: "H11",
    annee: "C13",
    matiere: "O11",
  };

  const TABLE_MAPPING = {
    sheetName: "NotesCC",
    startRow: 18,
    maxRows: 40, // ajustable
    columns: {
      numero: "B",      // N° élève
      code: "C",        // Code Massar
      nom: "D",         // Nom
      prenom: "E",      // Prénom
      date_naissance: "F",
      note1: "G",       // NOTE principale (déplacé de E à G pour éviter d'écraser le prénom)
      absence: "H",     // absence / remarque
    }
  };

  const parseExcel = async (file: File): Promise<{ students: Student[], workbook: any, rawFileBuffer: ArrayBuffer }> => {
    const data = await file.arrayBuffer();
    const rawFileBuffer = data.slice(0); // Keep a copy for ExcelJS
    const workbook = XLSX.read(data);
    
    // Try to use "NotesCC" sheet, fallback to first sheet if not found
    const sheetName = workbook.SheetNames.includes(TABLE_MAPPING.sheetName) 
      ? TABLE_MAPPING.sheetName 
      : workbook.SheetNames[0];
    const ws = workbook.Sheets[sheetName];

    const newStudents: Student[] = [];

    for (let i = 0; i < TABLE_MAPPING.maxRows; i++) {
      const row = TABLE_MAPPING.startRow + i;
      const nomCell = ws[`${TABLE_MAPPING.columns.nom}${row}`];
      const prenomCell = ws[`${TABLE_MAPPING.columns.prenom}${row}`];

      if ((nomCell && nomCell.v) || (prenomCell && prenomCell.v)) {
        const nom = nomCell ? String(nomCell.v).trim() : '';
        const prenom = prenomCell ? String(prenomCell.v).trim() : '';
        const fullName = `${nom} ${prenom}`.trim();

        let id = `s${Math.random().toString(36).substr(2, 4)}`;
        newStudents.push({
          id,
          name: fullName,
          grades: [0, 0, 0, 0], // Init empty grades
          participation: 50,
          status: 'Pass',
          avatar: `https://picsum.photos/seed/${id}/100`,
          row: row
        });
      }
    }

    return { students: newStudents, workbook, rawFileBuffer };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

    setIsImporting(true);

    try {
      // Parse the real Excel file
      const { students: importedStudents, workbook, rawFileBuffer } = await parseExcel(file);

      setTimeout(() => {
        if (isAddingSubject && !isNewClassMode) {
          // Adding a subject to existing class
          // Use filename as subject name
          const newSubjectName = fileName;
          
          setClasses(prev => prev.map(c => {
            if (c.id === currentClass.id) {
              return { 
                ...c, 
                subjects: [...c.subjects, newSubjectName],
                subjectData: {
                  ...c.subjectData,
                  [newSubjectName]: {
                    students: importedStudents,
                    workbook: workbook,
                    rawFileBuffer: rawFileBuffer,
                    fileName: file.name
                  }
                }
              };
            }
            return c;
          }));
          
          // Switch to new subject logic requires saving current state first, simpler to just force switch via handleSubjectChange logic manually
          // But since state update is async, we do it carefully
          
          // Hack: we need to manually update local students state to reflect the switch immediately
          setActiveSubject(newSubjectName);
          setStudents(importedStudents);
          setIsAddingSubject(false);

        } else if (isNewClassMode) {
          // Importing a completely new class
          // Use filename as Class Name
          const newClassId = Math.random().toString(36).substr(2, 5);
          const newSubjectName = "Principal"; // Default subject for new class
          
          const newClass: ClassInfo = {
            id: newClassId,
            name: fileName, // Use File Name as Class Name
            count: importedStudents.length,
            average: 0,
            successRate: 0,
            subjects: [newSubjectName],
            subjectData: {
              [newSubjectName]: {
                students: importedStudents,
                workbook: workbook,
                rawFileBuffer: rawFileBuffer,
                fileName: file.name
              }
            }
          };
          
          setClasses(prev => [...prev, newClass]);
          setSelectedClassId(newClassId);
          setIsNewClassMode(false);
          setActiveSubject(newSubjectName);
          setStudents(importedStudents);
        } else {
          // Fallback or specific case
          setStudents(importedStudents);
        }
        
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1000); // Keep a small delay for UX feeling
    } catch (error) {
      console.error("Import failed", error);
      setIsImporting(false);
      alert("Erreur lors de la lecture du fichier Excel.");
    }
  };

  const handleExport = async () => {
    // Get current subject data
    let rawFileBuffer: ArrayBuffer | null = null;
    let currentWorkbook = null;
    let fileName = `${currentClass.name}_${activeSubject}.xlsx`;

    if (!isNewClassMode) {
      const cls = classes.find(c => c.id === currentClass.id);
      const subjData = cls?.subjectData[activeSubject];
      if (subjData?.rawFileBuffer) {
        rawFileBuffer = subjData.rawFileBuffer;
        fileName = subjData.fileName || fileName;
      } else if (subjData?.workbook) {
        currentWorkbook = subjData.workbook;
        fileName = subjData.fileName || fileName;
      }
    }

    if (rawFileBuffer) {
      setIsImporting(true); // Re-use loading state for UX
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(rawFileBuffer);
        
        const sheetName = workbook.worksheets.some(ws => ws.name === TABLE_MAPPING.sheetName) 
          ? TABLE_MAPPING.sheetName 
          : workbook.worksheets[0].name;
        const ws = workbook.getWorksheet(sheetName);

        if (ws) {
          students.forEach(student => {
            if (student.row) {
              const noteCell = ws.getCell(`${TABLE_MAPPING.columns.note1}${student.row}`);
              
              noteCell.value = Number(student.grades[0] || 0);
              noteCell.numFmt = '0.00';
              
              // 2. DESSIN DES BORDURES (En gérant les fusions)
              for (let c = 3; c <= 13; c++) {
                const cell = ws.getCell(student.row, c);
                
                // Si la cellule est fusionnée, on cible la cellule maître pour ne pas casser la fusion
                const targetCell = cell.isMerged ? cell.master : cell;
                
                targetCell.border = {
                  top: { style: 'thin', color: { argb: 'FF000000' } },
                  left: { style: 'thin', color: { argb: 'FF000000' } },
                  bottom: { style: 'thin', color: { argb: 'FF000000' } },
                  right: { style: 'thin', color: { argb: 'FF000000' } }
                };
              }
              
              // 3. NETTOYAGE DES BORDURES FANTÔMES
              for (let c = 14; c <= 52; c++) {
                const cell = ws.getCell(student.row, c);
                
                // Si la cellule fait partie d'une fusion qui a commencé AVANT la colonne 14, on la protège !
                if (cell.isMerged && cell.master.col < 14) {
                  continue;
                }
                
                const targetCell = cell.isMerged ? cell.master : cell;
                if (targetCell.type !== ExcelJS.ValueType.Null || targetCell.border) {
                    targetCell.border = undefined;
                }
              }
            }
          });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Export_${fileName}`);
      } catch (error) {
        console.error("Export error:", error);
        alert("Erreur lors de l'exportation du fichier Excel.");
      } finally {
        setIsImporting(false);
      }
    } else {
      // Fallback to basic XLSX export for mock data
      if (!currentWorkbook) {
        currentWorkbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(students.map(s => ({
          ID: s.id,
          Nom: s.name,
          'Note 1': s.grades[0],
          'Note 2': s.grades[1],
          'Note 3': s.grades[2],
          'Note 4': s.grades[3],
          Moyenne: (s.grades.reduce((a,b)=>a+b,0)/4).toFixed(2)
        })));
        XLSX.utils.book_append_sheet(currentWorkbook, ws, "Notes");
      }
      XLSX.writeFile(currentWorkbook, `Export_${fileName}`);
    }
  };

  const handleImportClickInSidebar = () => {
    setIsNewClassMode(true);
    setStudents([]); 
    setCurrentView('class');
    setSelectedClassId('new-temp'); 
    setActiveSubject('Mathématiques');
  };

  const handleTriggerFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerAddSubject = () => {
    setIsAddingSubject(true);
    fileInputRef.current?.click();
  }

  const handleRenameClass = (id: string, newName: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleTogglePin = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  };

  const handleToggleFavorite = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const handleUpdateGrade = (studentId: string, testIndex: number, grade: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedGrades = [...s.grades];
        updatedGrades[testIndex] = grade;
        
        const average = updatedGrades.reduce((a, b) => a + b, 0) / updatedGrades.length;
        let status: 'Pass' | 'Fail' | 'Warning' = 'Pass';
        if (average < 8) status = 'Fail';
        else if (average < 10) status = 'Warning';
        
        return { ...s, grades: updatedGrades, status };
      }
      return s;
    }));
  };

  const handleSaveGradeFromModal = (studentId: string, grade: number) => {
    handleUpdateGrade(studentId, 0, grade);
    setIsAddNoteModalOpen(false);
  };

  const handleBatchUpdateFromVoice = (updates: { studentId: string; grade: number }[], testIndex: number) => {
    setStudents(prev => prev.map(s => {
      const update = updates.find(u => u.studentId === s.id);
      if (update) {
        const updatedGrades = [...s.grades];
        while(updatedGrades.length <= testIndex) updatedGrades.push(0);
        updatedGrades[testIndex] = update.grade;
        
        const average = updatedGrades.reduce((a, b) => a + b, 0) / updatedGrades.length;
        let status: 'Pass' | 'Fail' | 'Warning' = 'Pass';
        if (average < 8) status = 'Fail';
        else if (average < 10) status = 'Warning';
        
        return { ...s, grades: updatedGrades, status };
      }
      return s;
    }));
  };

  const handleSaveRules = (newRules: ObservationRule[]) => {
    setObservationRules(newRules);
    setIsRulesModalOpen(false);
  };

  const sortedClasses = [...classes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return parseInt(a.id) - parseInt(b.id);
  });

  return (
    <div className={`flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 ${isAr ? 'flex-row-reverse' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx,.xls"
      />
      
      {isImporting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {isAddingSubject ? t.addSubject : (isNewClassMode ? t.importAction : "Importation...")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.processing}</p>
            </div>
          </div>
        </div>
      )}

      {isAddNoteModalOpen && (
        <AddNoteModal 
          students={students} 
          t={t} 
          lang={lang} 
          onClose={() => setIsAddNoteModalOpen(false)}
          onSave={handleSaveGradeFromModal}
        />
      )}

      {isVoiceModalOpen && (
        <VoiceEntryModal
          students={students}
          t={t}
          lang={lang}
          onClose={() => setIsVoiceModalOpen(false)}
          onSave={handleBatchUpdateFromVoice}
        />
      )}

      {isRulesModalOpen && (
        <ObservationRulesModal 
          rules={observationRules}
          lang={lang}
          onClose={() => setIsRulesModalOpen(false)}
          onSave={handleSaveRules}
        />
      )}

      <ProfileModal 
        user={userProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleUpdateProfile}
      />

      <Sidebar 
        lang={lang} 
        t={t} 
        classes={sortedClasses} 
        selectedClassId={selectedClassId} 
        currentView={currentView}
        onSelectClass={(id) => { 
          setSelectedClassId(id); 
          setCurrentView('class');
          setIsNewClassMode(false);
          
          // Load default subject for the selected class
          const cls = classes.find(c => c.id === id);
          if (cls && cls.subjects.length > 0) {
            const defSubject = cls.subjects[0];
            setActiveSubject(defSubject);
            setStudents(cls.subjectData[defSubject]?.students || []);
          } else {
            setStudents([]);
          }
        }}
        onDashboardClick={() => setCurrentView('dashboard')}
        onImportClick={handleImportClickInSidebar}
        onRenameClass={handleRenameClass}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <MenuIcon size={24} />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un élève..." 
                className={`w-full bg-slate-100/80 dark:bg-slate-800 border-none rounded-2xl py-2 ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400`} 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Languages size={18} className="text-blue-500 dark:text-blue-400" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'العربية' : 'Français'}</span>
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
            <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform"></span>
            </button>
            <div 
              className="flex items-center gap-3 ml-2 pl-2 cursor-pointer group"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <img 
                src={userProfile.avatar} 
                alt="Prof" 
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-100 transition-all"
              />
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{userProfile.subject}</p>
              </div>
            </div>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <DashboardHome 
            t={t}
            lang={lang}
            classes={classes}
            students={students}
          />
        ) : (
          <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  {currentClass?.name}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                   <BookOpen size={16} />
                   <p className="font-medium text-sm md:text-base">
                    {lang === 'fr' ? 'Gestion des matières :' : 'إدارة المواد :'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={handleExport}
                  className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm"
                >
                  {lang === 'fr' ? 'Exporter (C-G)' : 'تصدير'}
                </button>
                
                <button 
                  onClick={() => setIsVoiceModalOpen(true)}
                  disabled={isNewClassMode && students.length === 0}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                    isNewClassMode && students.length === 0
                     ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700' 
                     : 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  <Mic size={18} />
                  <span className="hidden sm:inline">{t.voiceEntry}</span>
                </button>

                {isNewClassMode && students.length === 0 ? (
                  <button 
                    onClick={handleTriggerFileImport}
                    className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    <FileUp size={18} />
                    {t.importAction}
                  </button>
                ) : (
                  <button 
                    onClick={handleTriggerAddSubject}
                    className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    {t.addSubject}
                  </button>
                )}
              </div>
            </div>

            {!isNewClassMode && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {currentClass.subjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => handleSubjectChange(subj)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      activeSubject === subj
                        ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            )}

            <StatsSection t={t} classInfo={activeClassStats} isNewClass={isNewClassMode} students={students} />

            <div className="space-y-8">
              <div className="w-full">
                <StudentTable 
                  students={students} 
                  t={t} 
                  lang={lang} 
                  onUpdateGrade={handleUpdateGrade}
                  observationRules={observationRules}
                  onOpenRules={() => setIsRulesModalOpen(true)}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col lg:col-span-2 transition-colors duration-300">
                  <h4 className="font-bold text-slate-800 dark:text-white text-2xl mb-6 flex items-center justify-between">
                    <span>{lang === 'fr' ? 'Rappels' : 'تذكيرات'}</span>
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Bell size={20} />
                    </div>
                  </h4>
                  <div className="space-y-6 flex-1">
                    {[
                      { title: 'Saisie CC1', date: 'Avant le 15 Oct', color: 'bg-amber-400', shadow: 'shadow-amber-100', desc: 'Saisie des notes du premier contrôle continu.' },
                      { title: 'Conseil de classe', date: 'Le 20 Oct', color: 'bg-blue-400', shadow: 'shadow-blue-100', desc: 'Réunion de coordination pédagogique.' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5 items-start group cursor-pointer p-4 -m-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className={`mt-2 w-4 h-4 rounded-full ${item.color} ${item.shadow} shadow-lg group-hover:scale-125 transition-transform`}></div>
                        <div>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{item.title}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.date}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-8 w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 font-bold text-sm hover:border-blue-400 hover:text-blue-500 transition-all">
                    + {lang === 'fr' ? 'Ajouter un rappel' : 'إضافة تذكير'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
