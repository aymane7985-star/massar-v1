
import { Translations, Student, ClassInfo } from './types';

export const TRANSLATIONS: Record<'fr' | 'ar', Translations> = {
  fr: {
    dashboard: "Tableau de Bord",
    classes: "Mes Classes",
    upload: "Importer Excel Massar",
    importAction: "Importer",
    studentName: "Nom de l'élève",
    grade: "Note",
    status: "Statut",
    classAverage: "Moyenne de Classe",
    successRate: "Taux de Réussite",
    aiInsights: "Analyses IA Gemini",
    dragDrop: "Glissez-déposez votre fichier Excel Massar ici ou cliquez pour parcourir",
    selectClass: "Sélectionnez une classe",
    settings: "Paramètres",
    logout: "Déconnexion",
    addNote: "Ajouter une Note",
    addSubject: "Ajouter une Matière",
    subject: "Matière",
    selectStudent: "Choisir un élève",
    save: "Enregistrer",
    cancel: "Annuler",
    gradeValue: "Valeur de la note (0-20)",
    observationRules: "Règles d'Observations",
    observation: "OBSERVATION",
    averageAbbrev: "MOY.",
    test: "Test",
    voiceEntry: "Saisie Vocale",
    startRecording: "Commencer l'enregistrement",
    stopRecording: "Arrêter et Analyser",
    processing: "Analyse audio avec Gemini...",
    voiceInstructions: "Dites le nom de l'élève suivi de sa note (ex: 'Amine 18').",
    confirmGrades: "Confirmer les notes détectées",
    noMatchFound: "Aucune correspondance trouvée",
    apply: "Appliquer",
    retry: "Réessayer",
    hello: "Bonjour",
    globalEntryRate: "Taux de saisie global",
    readyClasses: "Classes prêtes",
    totalStudents: "L'effectif",
    testsEntered: "Tests saisis",
    percentageGrades: "Pourcentage des notes saisies par examen",
    recentActivity: "Dernières modifications",
    testsEnteredRatio: "tests saisis",
    studentsCount: "étudiants",
    exam: "Exam",
    newClass: "Nouvelle Classe",
    math: "Mathématiques",
    physics: "Physique",
    svt: "SVT"
  },
  ar: {
    dashboard: "لوحة التحكم",
    classes: "أقسامي",
    upload: "استيراد ملف مسار",
    importAction: "استيراد",
    studentName: "اسم التلميذ",
    grade: "النقطة",
    status: "الحالة",
    classAverage: "معدل القسم",
    successRate: "نسبة النجاح",
    aiInsights: "تحليلات الذكاء الاصطناعي",
    dragDrop: "اسحب وأفلت ملف إكسيل مسار هنا أو انقر للتصفح",
    selectClass: "اختر القسم",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    addNote: "إضافة نقطة",
    addSubject: "إضافة مادة",
    subject: "المادة",
    selectStudent: "اختر التلميذ",
    save: "حفظ",
    cancel: "إلغاء",
    gradeValue: "قيمة النقطة (0-20)",
    observationRules: "تخصيص الملاحظات",
    observation: "ملاحظات",
    averageAbbrev: "المعدل",
    test: "فرض",
    voiceEntry: "إدخال صوتي",
    startRecording: "بدء التسجيل",
    stopRecording: "إنهاء وتحليل",
    processing: "تحليل الصوت عبر Gemini...",
    voiceInstructions: "اذكر اسم التلميذ متبوعاً بالنقطة (مثال: 'أمين 18').",
    confirmGrades: "تأكيد النقاط المستخرجة",
    noMatchFound: "لم يتم العثور على تطابق",
    apply: "تطبيق",
    retry: "إعادة المحاولة",
    hello: "مرحباً",
    globalEntryRate: "معدل الإدخال العام",
    readyClasses: "الأقسام الجاهزة",
    totalStudents: "إجمالي الطلاب",
    testsEntered: "الامتحانات المسجلة",
    percentageGrades: "نسبة النقاط المدخلة لكل امتحان",
    recentActivity: "آخر التعديلات",
    testsEnteredRatio: "فروض مدخلة",
    studentsCount: "تلميذ",
    exam: "امتحان",
    newClass: "قسم جديد",
    math: "الرياضيات",
    physics: "الفيزياء",
    svt: "علوم الحياة والأرض"
  }
};

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Amine El Alami', grades: [18.5, 17, 19, 18], participation: 90, status: 'Pass', avatar: 'https://picsum.photos/seed/1/100' },
  { id: 's2', name: 'Sara Bennani', grades: [16.0, 15, 16.5, 17], participation: 85, status: 'Pass', avatar: 'https://picsum.photos/seed/2/100' },
  { id: 's3', name: 'Youssef Mansouri', grades: [9.5, 10, 8.5, 9.75], participation: 60, status: 'Warning', avatar: 'https://picsum.photos/seed/3/100' },
  { id: 's4', name: 'Fatima Zahra', grades: [14.2, 13.5, 14.8, 15], participation: 75, status: 'Pass', avatar: 'https://picsum.photos/seed/4/100' },
  { id: 's5', name: 'Mehdi Chraibi', grades: [7.0, 6.5, 8, 7.5], participation: 40, status: 'Fail', avatar: 'https://picsum.photos/seed/5/100' },
  { id: 's6', name: 'Laila Idrissi', grades: [15.5, 14, 16, 15.75], participation: 80, status: 'Pass', avatar: 'https://picsum.photos/seed/6/100' },
];

export const MOCK_CLASSES: ClassInfo[] = [
  { 
    id: '1', 
    name: '1ASCG-1', 
    count: 32, 
    average: 14.5, 
    successRate: 85, 
    subjects: ['Mathématiques'],
    subjectData: {
      'Mathématiques': { students: [...MOCK_STUDENTS] }
    }
  },
  { 
    id: '2', 
    name: '1ASCG-2', 
    count: 30, 
    average: 13.2, 
    successRate: 78, 
    subjects: ['Mathématiques'],
    subjectData: {
      'Mathématiques': { students: [...MOCK_STUDENTS] }
    }
  },
  { 
    id: '3', 
    name: '2ASCG-1', 
    count: 35, 
    average: 15.1, 
    successRate: 92, 
    subjects: ['Mathématiques'],
    subjectData: {
      'Mathématiques': { students: [...MOCK_STUDENTS] }
    }
  },
  { 
    id: '4', 
    name: '2ASCG-3', 
    count: 28, 
    average: 12.8, 
    successRate: 70, 
    subjects: ['Mathématiques'],
    subjectData: {
      'Mathématiques': { students: [...MOCK_STUDENTS] }
    }
  },
];
