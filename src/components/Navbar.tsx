import React from 'react';
import {
  Smartphone,
  Globe,
  Lock,
  UserCheck,
  LogOut,
  Sparkles,
  HelpCircle,
  BookOpen,
  Wifi,
  ChevronDown
} from 'lucide-react';
import { MainTab, User } from '../types';

interface NavbarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  user: User | null;
  esimsCount: number;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenCompatibilityModal: () => void;
  onOpenGuideModal: () => void;
  onOpenAdvisorModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  esimsCount,
  onOpenAuthModal,
  onLogout,
  onOpenCompatibilityModal,
  onOpenGuideModal,
  onOpenAdvisorModal
}) => {
  const handleMyEsimsClick = () => {
    if (!user) {
      // Trigger authentication immediately as requested: "que al entrar el usuario no este identificado. que lo haga al momento de presentar myesims"
      onOpenAuthModal();
    } else {
      setActiveTab('myesims');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('store')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Wifi className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">eSIM</span>
                  <span className="font-bold text-sm text-emerald-600 tracking-tight">Global</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">Travel Data Hub</span>
              </div>
            </button>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'store'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Destinos &amp; Tienda
              </button>

              <button
                onClick={handleMyEsimsClick}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'myesims'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mis eSIMs</span>
                {user ? (
                  <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                    {esimsCount}
                  </span>
                ) : (
                  <span className="ml-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Acceso
                  </span>
                )}
              </button>

              <button
                onClick={onOpenCompatibilityModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Compatibilidad
              </button>

              <button
                onClick={onOpenGuideModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Instalación
              </button>

              <button
                onClick={onOpenAdvisorModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Asistente IA</span>
              </button>
            </nav>
          </div>

          {/* Right: User State / Authentication */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMyEsimsClick}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver Mis eSIMs</span>
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-102"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Identificarse</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                
                {/* User details badge */}
                <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Saldo: <strong className="text-emerald-700">€{(user.walletBalanceEUR || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
                  title="Cerrar sesión (Modo Invitado)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('store')}
            className={`font-semibold py-1 px-2.5 rounded-lg ${
              activeTab === 'store' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Tienda
          </button>
          <button
            onClick={handleMyEsimsClick}
            className={`font-semibold py-1 px-2.5 rounded-lg flex items-center gap-1 ${
              activeTab === 'myesims' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            <span>Mis eSIMs</span>
            {user ? <span className="font-bold text-emerald-400">({esimsCount})</span> : <Lock className="w-2.5 h-2.5" />}
          </button>
          <button
            onClick={onOpenCompatibilityModal}
            className="text-slate-600 hover:text-slate-900"
          >
            Compatibilidad
          </button>
          <button
            onClick={onOpenGuideModal}
            className="text-slate-600 hover:text-slate-900"
          >
            Guía
          </button>
        </div>

      </div>
    </header>
  );
};
