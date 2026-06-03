
import React, { useState } from 'react';
import { Award, Users, Target, FileSpreadsheet } from 'lucide-react';
import { Translations, ClassInfo, Student } from '../types';

interface StatsProps {
  t: Translations;
  classInfo?: ClassInfo;
  isNewClass?: boolean;
  students?: Student[];
}

const StatsSection: React.FC<StatsProps> = ({ t, classInfo, isNewClass = false, students = [] }) => {
  const [activeTest, setActiveTest] = useState(0);

  const displayAverage = isNewClass ? '-' : (classInfo?.average ?? 14.5);
  const displaySuccessRate = isNewClass ? '-' : (classInfo?.successRate ?? 85);
  const displayCount = isNewClass ? '-' : (classInfo?.count ?? 32);

  // Calculate Fill Rate for activeTest
  const filledCount = students.filter(s => (s.grades[activeTest] || 0) > 0).length;
  const totalCount = students.length;
  const fillRate = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
  const displayFillRate = isNewClass ? '-' : `${fillRate}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${isNewClass ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            <Target size={24} />
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{t.classAverage}</p>
        <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{displayAverage}</h4>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${isNewClass ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
            <Award size={24} />
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{t.successRate}</p>
        <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{displaySuccessRate}{!isNewClass && '%'}</h4>
        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
            style={{ width: isNewClass ? '0%' : `${classInfo?.successRate ?? 85}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${isNewClass ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
            <Users size={24} />
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Effectif Total</p>
        <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{displayCount}</h4>
      </div>

      {/* Taux de saisie card with Filter */}
      <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${isNewClass ? 'border-slate-100 dark:border-slate-800' : 'border-blue-600 dark:border-blue-500'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${isNewClass ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600' : 'bg-blue-600 text-white'}`}>
            <FileSpreadsheet size={24} />
          </div>
          {!isNewClass && (
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTest(idx)}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                    activeTest === idx
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className={`${isNewClass ? 'text-slate-400' : 'text-blue-100'} text-sm mb-1`}>
          Taux de saisie <span className="opacity-70 text-xs">(Test {activeTest + 1})</span>
        </p>
        <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{displayFillRate}</h4>
        
        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className={`${isNewClass ? 'bg-slate-300' : 'bg-blue-400'} h-2 rounded-full transition-all duration-500`} 
            style={{ width: isNewClass ? '0%' : `${fillRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
