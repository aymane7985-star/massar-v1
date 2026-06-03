
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from 'lucide-react';
import { Translations, Language } from '../types';

interface FileUploadProps {
  t: Translations;
  lang: Language;
  onUpload: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ t, lang, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsDone(true);
      onUpload();
      setTimeout(() => setIsDone(false), 3000);
    }, 1500);
  };

  return (
    <div 
      className={`relative group bg-white border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleSimulateUpload(); }}
      onClick={handleSimulateUpload}
    >
      <input type="file" className="hidden" />
      <div className="flex flex-col items-center text-center cursor-pointer">
        <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${
          isDone ? 'bg-green-100' : 'bg-blue-50'
        }`}>
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          ) : isDone ? (
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          ) : (
            <FileSpreadsheet className="w-10 h-10 text-blue-600" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {isUploading ? "Traitement du fichier..." : isDone ? "Fichier importé !" : t.upload}
        </h3>
        <p className="text-slate-400 text-sm max-w-sm">
          {t.dragDrop}
        </p>
        
        <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
          <Upload size={14} />
          <span>Supporte: .xlsx, .xls (Format Massar Officiel)</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
