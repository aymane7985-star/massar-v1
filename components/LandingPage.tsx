import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileSpreadsheet, Zap, ShieldCheck, ChevronRight, LayoutDashboard, Search, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">MassarPro</span>
        </div>
        <Link 
          to="/"
          className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center gap-2 shadow-sm"
        >
          Accéder à l'application
          <ChevronRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nouvelle mise à jour disponible
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
            La saisie des notes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">réinventée</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Importez vos fichiers Massar, dictez les notes à voix haute, 
            et générez exports parfaits en quelques minutes. Un gain de temps monumental pour les professeurs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
            >
              <LayoutDashboard size={20} />
              Ouvrir le Tableau de bord
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup / Screenshot Representation */}
        <div className="mt-20 max-w-5xl mx-auto relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-[2rem] blur-2xl opacity-20 dark:opacity-40"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Header Mac-like */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-2 bg-slate-50 dark:bg-slate-950">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            {/* App Content Fake */}
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-black/20 text-left">
              {/* Left sidebar mock */}
              <div className="col-span-1 space-y-4">
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center px-4 gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                      <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Main table mock */}
              <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                    <Mic size={20} />
                  </div>
                </div>
                <div className="space-y-3">
                   <div className="grid grid-cols-4 gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                     <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded col-span-2"></div>
                     <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                     <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                   </div>
                   {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-center">
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded col-span-2 w-3/4"></div>
                      <div className="h-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"></div>
                      <div className="h-4 w-4 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center ml-4"><CheckCircle2 size={12}/></div>
                    </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Conçu pour votre productivité</h2>
            <p className="text-slate-500 dark:text-slate-400">Des outils puissants imaginés spécifiquement pour les enseignants.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Mic className="text-blue-500" size={28} />}
              title="Saisie Vocale"
              description="Dictez simplement le nom et la note. Fini les longues heures de frappe manuelle."
            />
            <FeatureCard 
              icon={<Search className="text-indigo-500" size={28} />}
              title="Fuzzy Matching"
              description="L'algorithme de recherche intelligente trouve le bon élève même avec une prononciation approximative."
            />
            <FeatureCard 
              icon={<FileSpreadsheet className="text-green-500" size={28} />}
              title="Export Parfait"
              description="Sauvegarde vos fichiers Excel en préservant 100% de la structure, des couleurs et des fusions Massar."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-purple-500" size={28} />}
              title="Privé & Hors-ligne"
              description="Tout le traitement est fait dans le navigateur. Vos données ne sont stockées sur aucun serveur."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-20"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 relative z-10">
            Prêt à révolutionner vos corrections ?
          </h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg relative z-10">
            Rejoignez l'application conçue pour faciliter le quotidien administratif. Entièrement gratuit, rapide et sécurisé.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 text-slate-900 bg-white hover:bg-slate-50 font-bold rounded-2xl transition-transform hover:scale-105 active:scale-95 relative z-10"
          >
            Commencer maintenant
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} MassarPro. Crée pour les professeurs.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/50 transition-all">
    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

export default LandingPage;
