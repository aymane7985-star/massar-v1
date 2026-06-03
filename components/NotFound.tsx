import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={48} />
        </div>
        
        <h1 className="text-8xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Page non trouvée</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Oups ! L'URL que vous avez saisie semble incorrecte ou la page n'existe plus. 
          Vérifiez l'adresse ou retournez au tableau de bord.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;
