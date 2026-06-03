
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  Settings, 
  LogOut, 
  GraduationCap, 
  FileUp, 
  Pin, 
  Star, 
  Pencil,
  Check,
  X
} from 'lucide-react';
import { Language, Translations, ClassInfo } from '../types';

interface SidebarProps {
  lang: Language;
  t: Translations;
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  onDashboardClick: () => void;
  onImportClick: () => void;
  onRenameClass: (id: string, newName: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  currentView?: 'dashboard' | 'class';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  lang, t, classes, selectedClassId, onSelectClass, onDashboardClick, onImportClick,
  onRenameClass, onTogglePin, onToggleFavorite, isOpen, onClose, currentView = 'dashboard'
}) => {
  const isAr = lang === 'ar';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartRename = (e: React.MouseEvent, cls: ClassInfo) => {
    e.stopPropagation();
    setEditingId(cls.id);
    setEditValue(cls.name);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onRenameClass(id, editValue.trim());
    }
    setEditingId(null);
  };

  const sidebarClasses = `
    w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen transition-all duration-300 ease-in-out z-50
    fixed inset-y-0
    ${isAr ? 'right-0 border-l border-r-0' : 'left-0'}
    ${isOpen ? 'translate-x-0' : isAr ? 'translate-x-full' : '-translate-x-full'}
    lg:translate-x-0 lg:sticky lg:top-0 lg:z-20
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 dark:shadow-none">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Massar Intel</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Main</p>
            <button 
              onClick={() => {
                onDashboardClick();
                if (window.innerWidth < 1024) onClose?.();
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all shadow-sm mb-2 ${
                currentView === 'dashboard'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <LayoutDashboard size={20} strokeWidth={2.5} />
              <span>{t.dashboard}</span>
            </button>
            
            <button 
              onClick={onImportClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-all group"
            >
              <div className="p-1 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <FileUp size={16} />
              </div>
              <span>{t.newClass}</span>
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center px-3 mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{t.classes}</p>
            </div>
            <div className="space-y-1">
              {classes.map((cls) => (
                <div 
                  key={cls.id}
                  onClick={() => {
                    onSelectClass(cls.id);
                    if (window.innerWidth < 1024) onClose?.();
                  }}
                  className={`group flex flex-col w-full p-2 rounded-xl transition-all cursor-pointer ${
                    currentView === 'class' && selectedClassId === cls.id 
                      ? 'bg-slate-100/80 dark:bg-slate-800' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Users size={18} className={currentView === 'class' && selectedClassId === cls.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                      {editingId === cls.id ? (
                        <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                          <input 
                            autoFocus
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveRename(e as any, cls.id)}
                            className="w-full text-sm font-bold bg-white dark:bg-slate-700 dark:text-white border border-blue-200 rounded px-1 outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          <button onClick={(e) => handleSaveRename(e, cls.id)} className="p-1 bg-blue-600 text-white rounded shadow-sm">
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className={`truncate text-sm ${currentView === 'class' && selectedClassId === cls.id ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
                          {cls.name}
                        </span>
                      )}
                    </div>
                    
                    {editingId !== cls.id && (
                      <div className="flex items-center gap-1 ml-2">
                        <div className="flex items-center opacity-0 lg:group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={(e) => handleStartRename(e, cls)}
                            className="p-1 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-700 rounded transition-all"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePin(cls.id); }}
                            className={`p-1 transition-all rounded ${cls.isPinned ? 'text-blue-500 bg-white dark:bg-slate-700' : 'text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-700'}`}
                          >
                            <Pin size={12} className={cls.isPinned ? 'fill-blue-500' : ''} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(cls.id); }}
                            className={`p-1 transition-all rounded ${cls.isFavorite ? 'text-amber-500 bg-white dark:bg-slate-700' : 'text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-700'}`}
                          >
                            <Star size={12} className={cls.isFavorite ? 'fill-amber-500' : ''} />
                          </button>
                        </div>
                        
                        {!cls.isPinned && !cls.isFavorite && (
                           <span className={`text-[10px] px-1.5 py-0.5 rounded-md lg:group-hover:hidden ${
                            currentView === 'class' && selectedClassId === cls.id ? 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {cls.count}
                          </span>
                        )}
                        
                        <div className="flex gap-0.5 lg:group-hover:hidden">
                          {cls.isPinned && <Pin size={10} className="text-blue-500 fill-blue-500" />}
                          {cls.isFavorite && <Star size={10} className="text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1 mt-auto flex-shrink-0">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
            <Settings size={20} />
            <span>{t.settings}</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium">
            <LogOut size={20} />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
