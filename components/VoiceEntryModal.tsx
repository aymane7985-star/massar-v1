
import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Loader2, Check, AlertCircle, RefreshCw, Send, ListChecks } from 'lucide-react';
import { Translations, Language, Student } from '../types';
import { extractGradesFromAudio } from '../services/geminiService';
import { findBestMatch } from '../utils/fuzzyMatch';

interface VoiceEntryModalProps {
  students: Student[];
  t: Translations;
  lang: Language;
  onClose: () => void;
  onSave: (updates: { studentId: string; grade: number }[], testIndex: number) => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'review';

interface MatchedGrade {
  spokenName: string;
  grade: number;
  studentId?: string;
  matchedName?: string;
  error?: boolean;
}

const VoiceEntryModal: React.FC<VoiceEntryModalProps> = ({ students, t, lang, onClose, onSave }) => {
  const [state, setState] = useState<RecordingState>('idle');
  const [selectedTest, setSelectedTest] = useState<number>(0);
  const [results, setResults] = useState<MatchedGrade[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isAr = lang === 'ar';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleProcessing;
      mediaRecorder.start();
      setState('recording');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g. "data:audio/webm;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleProcessing = async () => {
    setState('processing');
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    try {
      const base64Audio = await blobToBase64(audioBlob);
      const extractedData = await extractGradesFromAudio(base64Audio);
      
      const matchedData: MatchedGrade[] = extractedData.map((item: any) => {
        const match = findBestMatch(item.name, students);
        if (match) {
          return {
            spokenName: item.name,
            grade: item.grade,
            studentId: match.studentId,
            matchedName: match.name
          };
        } else {
          return {
            spokenName: item.name,
            grade: item.grade,
            error: true
          };
        }
      });

      setResults(matchedData);
      setState('review');
    } catch (error) {
      console.error("Processing failed", error);
      setState('idle');
    }
  };

  const handleApply = () => {
    const validUpdates = results
      .filter(r => r.studentId && !r.error)
      .map(r => ({ studentId: r.studentId!, grade: r.grade }));
    
    onSave(validUpdates, selectedTest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${isAr ? 'rtl' : 'ltr'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mic className="text-blue-600" size={20} />
            {t.voiceEntry}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center flex-1 overflow-y-auto custom-scrollbar">
          
          {state === 'idle' && (
            <div className="text-center w-full space-y-6 py-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
                  <ListChecks size={14} />
                  {isAr ? 'اختر الفرض المستهدف' : 'Sélectionnez le test cible'}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTest(idx)}
                      className={`py-3 rounded-xl font-black text-sm transition-all shadow-sm ${
                        selectedTest === idx
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isAr ? 'فرض' : 'Test'} {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-full inline-flex mb-2">
                <Mic size={48} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 mb-2">{t.voiceInstructions}</p>
              </div>
              <button 
                onClick={startRecording}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
              >
                <Mic size={24} />
                {t.startRecording}
              </button>
            </div>
          )}

          {state === 'recording' && (
            <div className="text-center space-y-8 py-6 w-full">
              <div className="relative inline-flex">
                <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>
                <div className="p-8 bg-rose-50 rounded-full relative z-10 border-4 border-rose-100">
                  <Mic size={48} className="text-rose-600 animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-slate-800 mb-1">Enregistrement...</p>
                <p className="text-slate-400 font-medium">
                  {isAr ? 'جاري تسجيل النقاط لـ' : 'Enregistrement pour'} <span className="text-rose-500 font-bold">{isAr ? 'فرض' : 'Test'} {selectedTest + 1}</span>
                </p>
              </div>
              <button 
                onClick={stopRecording}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-3"
              >
                <Square size={24} fill="currentColor" />
                {t.stopRecording}
              </button>
            </div>
          )}

          {state === 'processing' && (
            <div className="text-center space-y-6 py-12">
              <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
              <p className="text-lg font-bold text-slate-600 animate-pulse">{t.processing}</p>
            </div>
          )}

          {state === 'review' && (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-700">{t.confirmGrades} <span className="text-blue-600 text-sm">({isAr ? 'فرض' : 'T'}{selectedTest + 1})</span></h4>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                  {results.filter(r => !r.error).length} détectés
                </span>
              </div>
              
              <div className="space-y-2">
                {results.length === 0 ? (
                  <p className="text-center text-slate-400 py-4 italic">{t.noMatchFound}</p>
                ) : (
                  results.map((res, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        res.error 
                          ? 'bg-red-50 border-red-100' 
                          : 'bg-green-50 border-green-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {res.error ? (
                          <AlertCircle size={18} className="text-red-400" />
                        ) : (
                          <Check size={18} className="text-green-600" />
                        )}
                        <div>
                          <p className={`text-sm font-bold ${res.error ? 'text-red-700' : 'text-slate-800'}`}>
                            {res.matchedName || `"${res.spokenName}"`}
                          </p>
                          {res.error && (
                            <p className="text-[10px] text-red-400 uppercase font-bold">Inconnu</p>
                          )}
                        </div>
                      </div>
                      <div className="font-black text-lg text-slate-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                        {res.grade}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => { setResults([]); setState('idle'); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  {t.retry}
                </button>
                <button 
                  onClick={handleApply}
                  disabled={results.filter(r => !r.error).length === 0}
                  className="flex-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {t.apply}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VoiceEntryModal;
