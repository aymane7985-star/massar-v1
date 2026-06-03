
import React, { useState } from 'react';
import { X, User, Hash, Save } from 'lucide-react';
import { Student, Translations, Language } from '../types';

interface AddNoteModalProps {
  students: Student[];
  t: Translations;
  lang: Language;
  onClose: () => void;
  onSave: (studentId: string, grade: number) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ students, t, lang, onClose, onSave }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [grade, setGrade] = useState<string>('');
  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradeNum = parseFloat(grade);
    if (!isNaN(gradeNum) && gradeNum >= 0 && gradeNum <= 20 && selectedStudentId) {
      onSave(selectedStudentId, gradeNum);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 ${isAr ? 'rtl' : 'ltr'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">{t.addNote}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.selectStudent}
            </label>
            <div className="relative">
              <User className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-semibold text-slate-700 focus:border-blue-500 focus:ring-0 outline-none transition-all appearance-none`}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.gradeValue}
            </label>
            <div className="relative">
              <Hash className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input
                type="number"
                step="0.25"
                min="0"
                max="20"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="10.00"
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-semibold text-slate-700 focus:border-blue-500 focus:ring-0 outline-none transition-all`}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
