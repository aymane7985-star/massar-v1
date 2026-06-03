
import React, { useRef, useState } from 'react';
import { MoreHorizontal, Star, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { Student, Translations, Language, ObservationRule } from '../types';

interface StudentTableProps {
  students: Student[];
  t: Translations;
  lang: Language;
  onUpdateGrade: (id: string, testIndex: number, grade: number) => void;
  observationRules: ObservationRule[];
  onOpenRules: () => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, t, lang, onUpdateGrade, observationRules, onOpenRules }) => {
  const isAr = lang === 'ar';
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  
  // 2D Ref array for [student_row][test_col]
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Initialize refs array if needed
  if (inputRefs.current.length !== students.length) {
    inputRefs.current = Array(students.length).fill(null).map(() => Array(4).fill(null));
  }

  const handleGradeChange = (studentId: string, testIndex: number, value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 20) {
      onUpdateGrade(studentId, testIndex, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      inputRefs.current[row + 1]?.[col]?.focus();
      inputRefs.current[row + 1]?.[col]?.select();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      inputRefs.current[row - 1]?.[col]?.focus();
      inputRefs.current[row - 1]?.[col]?.select();
    } else if (e.key === 'ArrowRight') {
      if (!isAr && inputRefs.current[row][col+1]) {
        inputRefs.current[row][col+1]?.focus();
        inputRefs.current[row][col+1]?.select();
      } else if (isAr && inputRefs.current[row][col-1]) {
        inputRefs.current[row][col-1]?.focus();
        inputRefs.current[row][col-1]?.select();
      }
    } else if (e.key === 'ArrowLeft') {
       if (!isAr && inputRefs.current[row][col-1]) {
        inputRefs.current[row][col-1]?.focus();
        inputRefs.current[row][col-1]?.select();
      } else if (isAr && inputRefs.current[row][col+1]) {
        inputRefs.current[row][col+1]?.focus();
        inputRefs.current[row][col+1]?.select();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const getObservation = (student: Student, average: number) => {
    const matchingRule = observationRules.find(r => average >= r.min && average <= r.max);
    if (!matchingRule) return "Pas d'observation";
    const studentName = typeof student.name === 'string' ? student.name : String(student.name || '');
    return matchingRule.template.replace(/\[nom\]/gi, studentName.split(' ')[0] || '');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 sticky left-0 z-20 gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Évaluations par Classe</h3>
          <p className="text-xs text-slate-400 font-medium md:hidden">Choisissez un test pour éditer les notes</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {/* Mobile Test Selector */}
          <div className="flex md:hidden items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestIndex(idx)}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
                  activeTestIndex === idx 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm scale-105' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {isAr ? 'ف' : 'T'}{idx + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={onOpenRules}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-sm shrink-0"
          >
            <Settings2 size={16} />
            <span className="hidden sm:inline">{t.observationRules}</span>
            <span className="sm:hidden">{isAr ? 'تخصيص' : 'Règles'}</span>
          </button>
        </div>

        <button className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline hidden lg:block">Voir tout</button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-full md:min-w-[900px]">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-wider">
            <tr>
              <th className={`px-4 md:px-6 py-4 font-bold sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-[150px] md:w-[200px] ${isAr ? 'text-right' : ''}`}>{t.studentName}</th>
              
              {/* Desktop Headers */}
              {[0, 1, 2, 3].map(idx => (
                <th 
                  key={idx} 
                  className={`px-2 md:px-4 py-4 font-bold text-center border-x border-slate-100/50 dark:border-slate-800/50 w-[70px] md:w-[80px] ${
                    activeTestIndex !== idx ? 'hidden md:table-cell' : 'table-cell'
                  }`}
                >
                  {t.test} {idx + 1}
                </th>
              ))}
              
              <th className={`px-4 md:px-6 py-4 font-bold text-center w-[90px] md:w-[120px] ${isAr ? 'text-right' : ''}`}>{t.averageAbbrev}</th>
              <th className={`px-4 md:px-6 py-4 font-bold hidden md:table-cell ${isAr ? 'text-right' : ''}`}>{t.observation}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {students.map((student, rowIndex) => {
              const studentAverage = (student.grades.reduce((a, b) => a + b, 0) / 4).toFixed(2);
              const obs = getObservation(student, parseFloat(studentAverage));
              return (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 md:px-6 py-4 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-900 z-10 border-r border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs md:text-sm leading-none mb-1 md:mb-1.5 truncate max-w-[100px] md:max-w-none">{student.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {student.id.toUpperCase()}</p>
                    </div>
                  </td>
                  
                  {student.grades.map((grade, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`p-0 border-x border-slate-50 dark:border-slate-800 relative focus-within:bg-blue-50/30 dark:focus-within:bg-blue-900/20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 transition-all ${
                        activeTestIndex !== colIndex ? 'hidden md:table-cell' : 'table-cell'
                      }`}
                    >
                      <div className="flex items-center justify-center h-full w-full py-4 px-1 md:px-2">
                        <input
                          ref={(el) => { 
                            if (inputRefs.current[rowIndex]) {
                              inputRefs.current[rowIndex][colIndex] = el;
                            }
                          }}
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={grade || ''}
                          onFocus={handleFocus}
                          onChange={(e) => handleGradeChange(student.id, colIndex, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          className={`w-full bg-transparent text-sm md:text-lg font-black outline-none transition-all text-center appearance-none cursor-cell ${
                            grade >= 10 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-500 dark:text-rose-400'
                          }`}
                        />
                      </div>
                    </td>
                  ))}
                  
                  <td className="px-4 md:px-6 py-4 text-center">
                    <span className={`text-xs md:text-sm font-black ${Number(studentAverage) >= 10 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {studentAverage}
                    </span>
                  </td>
                  
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 group/obs">
                       <span className={`text-[11px] md:text-[13px] font-bold italic transition-all ${
                         parseFloat(studentAverage) >= 15 ? 'text-blue-600 dark:text-blue-400' : 
                         parseFloat(studentAverage) >= 10 ? 'text-slate-600 dark:text-slate-400' : 'text-rose-400'
                       }`}>
                        "{obs}"
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-center md:hidden">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilisez les flèches pour naviguer entre les élèves</p>
      </div>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StudentTable;
