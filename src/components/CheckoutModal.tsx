import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Check, Smartphone, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { EsimPlan, User, UserEsim } from '../types';

interface CheckoutModalProps {
  plan: EsimPlan | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessPurchase: (newEsim: UserEsim, identifiedUser: User) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  user,
  isOpen,
  onClose,
  onSuccessPurchase
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine target user
    let finalUser: User;
    if (user) {
      finalUser = user;
    } else {
      if (!guestEmail || !guestName) return;
      finalUser = {
        id: `user-guest-${Date.now()}`,
        name: guestName,
        email: guestEmail,
        country: 'España',
        createdAt: new Date().toISOString().split('T')[0],
        walletBalanceEUR: 0
      };
    }

    setProcessing(true);

    setTimeout(() => {
      const generatedIccid = `89${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const activationCode = `${plan.countryCode}-${randomCode}-GSMA-${Math.floor(1000 + Math.random() * 9000)}`;
      const smdp = 'smdp.globalesim.net';
      const manualCode = `LPA:1$${smdp}$${activationCode}`;

      const newEsim: UserEsim = {
        id: `esim-${Date.now()}`,
        iccid: generatedIccid,
        planId: plan.id,
        planName: plan.name,
        country: plan.country,
        countryCode: plan.countryCode,
        flag: plan.flag,
        operator: plan.operator,
        network5G: plan.network5G,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=LPA:1$${smdp}$${activationCode}`,
        smdpAddress: smdp,
        activationCode,
        manualCode,
        totalDataGB: plan.dataAmountGB,
        usedDataGB: 0,
        isUnlimited: plan.isUnlimited,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: `Válido ${plan.validityDays} días tras primer uso`,
        status: 'ready_to_install',
        autoRenew: false,
        apn: plan.apn || 'globaldata'
      };

      setProcessing(false);
      onSuccessPurchase(newEsim, finalUser);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">{plan.flag}</span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Comprar eSIM: {plan.name}</h2>
              <p className="text-xs text-slate-500 font-mono">
                {plan.isUnlimited ? 'Datos Ilimitados' : `${plan.dataAmountGB} GB`} • {plan.validityDays} Días
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCheckout} className="py-4 space-y-4">
          
          {/* Guest User Information Form (if not logged in) */}
          {!user ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Datos del Viajero (Para entrega de la eSIM)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Delgado"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email de Entrega</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Te identificaremos automáticamente para que accedas a tu código QR en <strong>"Mis eSIMs"</strong>.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{user.name}</span>
                  <span className="text-slate-600 text-[11px] font-mono">{user.email}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Usuario Identificado
              </span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                <span>Apple / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span>Saldo Monedero</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>eSIM {plan.name}:</span>
              <span className="font-semibold text-slate-900">€{plan.priceEUR.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Activación &amp; Perfil eSIM:</span>
              <span className="text-emerald-700 font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-200 text-sm font-bold">
              <span>Total:</span>
              <span className="text-emerald-700 font-mono">€{plan.priceEUR.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{processing ? 'Generando perfil eSIM y código QR...' : `Pagar €${plan.priceEUR.toFixed(2)} y Obtener eSIM`}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
