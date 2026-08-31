import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, Check, ArrowRight } from 'lucide-react';
import { EsimPlan } from '../types';
import { DESTINATIONS, ESIM_PLANS } from '../data/esimData';

interface AiTravelAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: EsimPlan) => void;
}

export const AiTravelAdvisorModal: React.FC<AiTravelAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan
}) => {
  const [destinationInput, setDestinationInput] = useState('');
  const [daysInput, setDaysInput] = useState('10');
  const [usageType, setUsageType] = useState<'light' | 'standard' | 'heavy'>('standard');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    summary: string;
    recommendedPlan: EsimPlan;
    tips: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationInput) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationInput,
          days: daysInput,
          usage: usageType
        })
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        throw new Error('Fallback logic');
      }
    } catch {
      // Local fallback advisor logic
      const destMatch = DESTINATIONS.find(d =>
        d.name.toLowerCase().includes(destinationInput.toLowerCase()) ||
        destinationInput.toLowerCase().includes(d.name.toLowerCase())
      ) || DESTINATIONS[0];

      const plans = ESIM_PLANS[destMatch.code] || ESIM_PLANS['JP'];
      let chosenPlan = plans[1] || plans[0];
      if (usageType === 'heavy' || parseInt(daysInput) > 15) {
        chosenPlan = plans[plans.length - 1] || plans[0];
      }

      setRecommendation({
        summary: `Para tu viaje de ${daysInput} días a ${destMatch.name} con un uso ${usageType === 'heavy' ? 'intensivo (streaming/hotspot)' : usageType === 'light' ? 'básico (mapas y mensajería)' : 'moderado (redes y fotos)'}, te recomendamos el plan de ${chosenPlan.name}.`,
        recommendedPlan: chosenPlan,
        tips: [
          `Descarga los mapas offline de Google Maps antes de despegar para ahorrar hasta un 20% de datos en ${destMatch.name}.`,
          `Configura las copias de seguridad de fotos en la nube para que solo se sincronicen con redes Wi-Fi.`,
          `La red local ${chosenPlan.operator} ofrece cobertura 5G automática en las principales ciudades.`
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative overflow-hidden text-slate-900 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Asistente IA de Viajes eSIM</h2>
              <p className="text-xs text-slate-500">Calcula los GB ideales para tu itinerario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
          {!recommendation ? (
            <form onSubmit={handleGetRecommendation} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ¿A qué país o región viajas?
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Japón, Francia, EE.UU., Tailandia..."
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Duración del viaje (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={daysInput}
                    onChange={(e) => setDaysInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Perfil de consumo
                  </label>
                  <select
                    value={usageType}
                    onChange={(e: any) => setUsageType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="light">Básico (WhatsApp y Mapas)</option>
                    <option value="standard">Moderado (Redes y Fotos)</option>
                    <option value="heavy">Intensivo (Streaming / Hotspot)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{loading ? 'Analizando itinerario con IA...' : 'Recomendar Mejor Plan'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Recomendación Inteligente</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-900">
                  {recommendation.summary}
                </p>
              </div>

              {/* Recommended Plan Card */}
              <div className="border border-emerald-500 bg-white rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{recommendation.recommendedPlan.flag}</span>
                    <div>
                      <h3 className="font-bold text-slate-900">{recommendation.recommendedPlan.name}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">{recommendation.recommendedPlan.operator}</span>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    €{recommendation.recommendedPlan.priceEUR.toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {recommendation.recommendedPlan.validityDays} días de validez 5G
                  </span>
                  <button
                    onClick={() => {
                      onSelectPlan(recommendation.recommendedPlan);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Seleccionar este Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Travel Tips */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Consejos para optimizar tus datos en viaje
                </label>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {recommendation.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setRecommendation(null)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2"
              >
                ← Realizar otra consulta
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
