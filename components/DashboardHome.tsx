
import React from 'react';
import { Moon, Sun, Users, CheckCircle, FileSpreadsheet, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import { Translations, ClassInfo, Student } from '../types';

interface DashboardHomeProps {
  t: Translations;
  lang: 'fr' | 'ar';
  classes: ClassInfo[];
  students: Student[]; // Used for mock data aggregation
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ t, lang, classes, students }) => {
  const isAr = lang === 'ar';
  
  // Mock calculations for KPIs based on available data
  const totalStudents = classes.reduce((acc, curr) => acc + curr.count, 0);
  const totalGradesCount = students.reduce((acc, s) => acc + s.grades.filter(g => g > 0).length, 0);
  const totalPossibleGrades = students.length * 4; // 4 exams
  const entryRate = Math.round((totalGradesCount / totalPossibleGrades) * 100) || 5; // Default to 5% if empty
  
  // Chart Data
  const chartData = [
    { name: `${t.exam} 1`, value: 90 },
    { name: `${t.exam} 2`, value: 35 },
    { name: `${t.exam} 3`, value: 100 },
    { name: `${t.exam} 4`, value: 20 },
  ];

  const recentClasses = classes.slice(0, 3).map((cls, idx) => ({
    ...cls,
    progress: [65, 85, 45][idx % 3], // Mock progress
    testsDone: [2, 3, 1][idx % 3] // Mock tests done
  }));

  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <svg className="w-16 h-16 transform -rotate-90 drop-shadow-sm">
          <circle 
            cx="32" 
            cy="32" 
            r={radius} 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="transparent" 
            className="text-slate-100 dark:text-slate-800" 
          />
          <circle 
            cx="32" 
            cy="32" 
            r={radius} 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className="text-cyan-500 transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            {t.hello} <span className="text-blue-600 dark:text-blue-400">Aymane</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
             {isAr ? 'مرحبًا بك في لوحة تحكم مسار' : 'Bienvenue sur votre tableau de bord Massar'}
          </p>
        </div>
      </div>

      {/* Main Grid: Chart + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Bar Chart (60% approx width on desktop) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.percentageGrades}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{isAr ? 'بيانات حية' : 'Données en temps réel'}</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={[0, 115]}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc' 
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={(val: number) => `${val}%`}
                    style={{ fill: '#64748b', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: KPI Grid (40% width) */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">{t.globalEntryRate}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1 group-hover:scale-110 transition-transform">{entryRate}%</h4>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
               <div className="bg-blue-500 h-full rounded-full" style={{ width: `${entryRate}%` }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:border-green-200 dark:hover:border-green-800 transition-colors group">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">{t.readyClasses}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1 group-hover:scale-110 transition-transform">4</h4>
            <div className="p-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mt-1">
              <CheckCircle size={16} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:border-purple-200 dark:hover:border-purple-800 transition-colors group">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">{t.totalStudents}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1 group-hover:scale-110 transition-transform">{totalStudents + 337}</h4>
            <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mt-1">
              <Users size={16} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">{t.testsEntered}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1 group-hover:scale-110 transition-transform">16</h4>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mt-1">
              <FileSpreadsheet size={16} />
            </div>
          </div>

        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
           {t.recentActivity}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentClasses.map((cls, idx) => (
            <div key={cls.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{cls.name}</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {cls.testsDone}/3 {t.testsEnteredRatio}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{cls.count} {t.studentsCount}</span>
                  </div>
                </div>
                
                <CircularProgress percentage={cls.progress} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
