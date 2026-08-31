import React, { useState } from 'react';
import { X, Mail, ShieldCheck, UserCheck, Sparkles, ArrowRight, Smartphone, KeyRound } from 'lucide-react';
import { User } from '../types';
import { DEMO_USERS } from '../data/esimData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  redirectReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  redirectReason = 'Para acceder a "Mis eSIMs" y ver tus códigos QR de instalación'
}) => {
  const [authMode, setAuthMode] = useState<'options' | 'email_otp' | 'register'>('options');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  if (!isOpen) return null;

  const handleSelectDemoUser = (user: User) => {
    onLogin(user);
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Match existing user or create temporary user
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
    const finalUser: User = matched || {
      id: `user-custom-${Date.now()}`,
      name: emailInput.split('@')[0],
      email: emailInput,
      country: 'España',
      createdAt: new Date().toISOString().split('T')[0],
      walletBalanceEUR: 10.00
    };
    onLogin(finalUser);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail) return;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: registerName,
      email: registerEmail,
      country: 'España',
      createdAt: new Date().toISOString().split('T')[0],
      walletBalanceEUR: 5.00
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative overflow-hidden text-slate-900">
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Identificación de Usuario
          </h2>
          <p className="text-xs text-slate-500 mt-1 px-2">
            {redirectReason}
          </p>
        </div>

        {authMode === 'options' && (
          <div className="space-y-4">
            
            {/* Quick Demo Travelers */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Acceso rápido (Perfiles de Viajero con eSIMs)
              </label>
              <div className="space-y-2">
                {DEMO_USERS.map((demoUser) => (
                  <button
                    key={demoUser.id}
                    onClick={() => handleSelectDemoUser(demoUser)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={demoUser.avatar}
                        alt={demoUser.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{demoUser.name}</span>
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {demoUser.id === 'user-sofia-101' ? '2 eSIMs Activas' : '1 eSIM Lista'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{demoUser.email}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">o con tu email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email OTP Option */}
            <button
              onClick={() => setAuthMode('email_otp')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Continuar con Correo Electrónico</span>
            </button>

            {/* Create Account Option */}
            <div className="text-center pt-1">
              <button
                onClick={() => setAuthMode('register')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
              >
                ¿Nuevo usuario? Crear cuenta de viajero
              </button>
            </div>
          </div>
        )}

        {authMode === 'email_otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Te enviaremos un código temporal de acceso sin contraseñas.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Enviar Código de Acceso</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  Código enviado a <strong>{emailInput}</strong>. Ingresa cualquier código de 6 dígitos para acceder.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código de verificación (6 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono text-center tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verificar e Ingresar a Mis eSIMs</span>
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setAuthMode('options');
                setOtpSent(false);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2"
            >
              ← Volver a opciones de acceso
            </button>
          </div>
        )}

        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Nombre del titular"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Registrarse y Entrar a Mis eSIMs</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('options')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors pt-1"
            >
              ← Volver a opciones de acceso
            </button>
          </form>
        )}

        {/* Security footnote */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Acceso seguro cifrado con perfil eSIM GSMA estándar</span>
        </div>

      </div>
    </div>
  );
};
