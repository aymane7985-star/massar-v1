
export interface Student {
  id: string;
  name: string;
  grades: number[]; // 4 tests: [T1, T2, T3, T4]
  participation: number;
  status: 'Pass' | 'Fail' | 'Warning';
  avatar: string;
  row?: number; // Excel row index
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subject: string;
}

export interface ObservationRule {
  id: string;
  min: number;
  max: number;
  template: string;
}

export interface SubjectData {
  students: Student[];
  workbook?: any; // XLSX WorkBook object
  rawFileBuffer?: ArrayBuffer; // For ExcelJS
  fileName?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  count: number;
  average: number;
  successRate: number;
  subjects: string[]; // List of available subjects
  subjectData: Record<string, SubjectData>; // Data mapping: Subject Name -> Data
  isPinned?: boolean;
  isFavorite?: boolean;
}

export type Language = 'fr' | 'ar';

export interface Translations {
  dashboard: string;
  classes: string;
  upload: string;
  importAction: string;
  studentName: string;
  grade: string;
  status: string;
  classAverage: string;
  successRate: string;
  aiInsights: string;
  dragDrop: string;
  selectClass: string;
  settings: string;
  logout: string;
  addNote: string;
  addSubject: string; 
  subject: string; 
  selectStudent: string;
  save: string;
  cancel: string;
  gradeValue: string;
  observationRules: string;
  observation: string;
  averageAbbrev: string;
  test: string;
  voiceEntry: string;
  startRecording: string;
  stopRecording: string;
  processing: string;
  voiceInstructions: string;
  confirmGrades: string;
  noMatchFound: string;
  apply: string;
  retry: string;
  hello: string;
  globalEntryRate: string;
  readyClasses: string;
  totalStudents: string;
  testsEntered: string;
  percentageGrades: string;
  recentActivity: string;
  testsEnteredRatio: string;
  studentsCount: string;
  exam: string;
  newClass: string;
  math: string; 
  physics: string; 
  svt: string; 
}
