
import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Info } from 'lucide-react';
import { ObservationRule, Language } from '../types';

interface ObservationRulesModalProps {
  rules: ObservationRule[];
  onClose: () => void;
  onSave: (rules: ObservationRule[]) => void;
  lang: Language;
}

const ObservationRulesModal: React.FC<ObservationRulesModalProps> = ({ rules: initialRules, onClose, onSave, lang }) => {
  const [rules, setRules] = useState<ObservationRule[]>(initialRules);
  const isAr = lang === 'ar';

  const handleAddRule = () => {
    const newRule: ObservationRule = {
      id: Math.random().toString(36).substr(2, 9),
      min: 0,
      max: 10,
      template: "Bon effort [nom], continue!"
    };
    setRules([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleUpdateRule = (id: string, field: keyof ObservationRule, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isAr ? 'rtl' : 'ltr'}`}>
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-2xl font-black text-slate-800">Règles d'Observations</h3>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">Automatisez vos appréciations Massar</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-4 items-start">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Info size={20} />
            </div>
            <div className="text-sm">
              <p className="text-blue-800 font-bold">Astuce de personnalisation</p>
              <p className="text-blue-600/80 font-medium">Utilisez <span className="bg-blue-200 px-1.5 py-0.5 rounded font-black text-blue-900">[nom]</span> dans votre texte pour insérer automatiquement le nom de l'élève.</p>
            </div>
          </div>

          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <div key={rule.id} className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-4 group hover:border-blue-200 hover:bg-white transition-all">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 flex gap-3 items-center">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Min</label>
                      <input 
                        type="number" 
                        value={rule.min} 
                        onChange={(e) => handleUpdateRule(rule.id, 'min', parseFloat(e.target.value))}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Max</label>
                      <input 
                        type="number" 
                        value={rule.max} 
                        onChange={(e) => handleUpdateRule(rule.id, 'max', parseFloat(e.target.value))}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveRule(rule.id)}
                    className="p-3 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all self-end sm:self-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 px-1">Modèle d'observation</label>
                  <textarea 
                    value={rule.template} 
                    onChange={(e) => handleUpdateRule(rule.id, 'template', e.target.value)}
                    placeholder="Ex: Excellent semestre pour [nom], continue ainsi !"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 font-medium text-slate-700 focus:border-blue-500 outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddRule}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-sm hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            Ajouter une règle de notation
          </button>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4 bg-white sticky bottom-0">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
            Annuler
          </button>
          <button 
            onClick={() => onSave(rules)}
            className="flex-2 px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Appliquer les règles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObservationRulesModal;
