import React, { useState } from 'react';
import { Search, Globe, Flame, Shield, Wifi, Zap, Check, ArrowRight, Smartphone, Sparkles, X } from 'lucide-react';
import { Destination, EsimPlan } from '../types';
import { DESTINATIONS, ESIM_PLANS } from '../data/esimData';

interface DestinationsCatalogProps {
  onSelectPlanForPurchase: (plan: EsimPlan) => void;
  onOpenAdvisor: () => void;
}

export const DestinationsCatalog: React.FC<DestinationsCatalogProps> = ({
  onSelectPlanForPurchase,
  onOpenAdvisor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.topOperators.some(op => op.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'popular') return dest.popular;
    return dest.region === selectedRegion;
  });

  const getPlansForDestination = (code: string): EsimPlan[] => {
    if (ESIM_PLANS[code]) return ESIM_PLANS[code];
    // Fallback plans generator for other countries
    return [
      {
        id: `plan-${code.toLowerCase()}-1gb`,
        name: `${activeDestination?.name || 'Destino'} 1 GB`,
        country: activeDestination?.name || 'Destino',
        countryCode: code,
        flag: activeDestination?.flag || '🌍',
        region: 'local',
        dataAmountGB: 1,
        isUnlimited: false,
        validityDays: 7,
        priceEUR: 4.50,
        operator: activeDestination?.topOperators[0] || 'Red Local 5G',
        network5G: true,
        apn: 'globaldata',
        voiceAndSms: false,
        tetheringSupported: true,
        coverageDetails: 'Cobertura nacional en alta velocidad con entrega instantánea.'
      },
      {
        id: `plan-${code.toLowerCase()}-3gb`,
        name: `${activeDestination?.name || 'Destino'} 3 GB`,
        country: activeDestination?.name || 'Destino',
        countryCode: code,
        flag: activeDestination?.flag || '🌍',
        region: 'local',
        dataAmountGB: 3,
        isUnlimited: false,
        validityDays: 15,
        priceEUR: 9.00,
        operator: activeDestination?.topOperators[0] || 'Red Local 5G',
        network5G: true,
        apn: 'globaldata',
        voiceAndSms: false,
        tetheringSupported: true,
        coverageDetails: 'Paquete estándar para navegación y redes sociales.',
        popular: true
      },
      {
        id: `plan-${code.toLowerCase()}-5gb`,
        name: `${activeDestination?.name || 'Destino'} 5 GB`,
        country: activeDestination?.name || 'Destino',
        countryCode: code,
        flag: activeDestination?.flag || '🌍',
        region: 'local',
        dataAmountGB: 5,
        isUnlimited: false,
        validityDays: 30,
        priceEUR: 13.50,
        operator: activeDestination?.topOperators[0] || 'Red Local 5G',
        network5G: true,
        apn: 'globaldata',
        voiceAndSms: false,
        tetheringSupported: true,
        coverageDetails: 'Para viajes de 2 a 4 semanas con uso constante.',
        popular: true
      },
      {
        id: `plan-${code.toLowerCase()}-10gb`,
        name: `${activeDestination?.name || 'Destino'} 10 GB`,
        country: activeDestination?.name || 'Destino',
        countryCode: code,
        flag: activeDestination?.flag || '🌍',
        region: 'local',
        dataAmountGB: 10,
        isUnlimited: false,
        validityDays: 30,
        priceEUR: 22.00,
        operator: activeDestination?.topOperators[0] || 'Red Local 5G',
        network5G: true,
        apn: 'globaldata',
        voiceAndSms: false,
        tetheringSupported: true,
        coverageDetails: 'Máxima capacidad para videollamadas y trabajo remoto.'
      }
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Search */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sin roaming ni tarjetas SIM físicas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            eSIMs Internacionales para Viajar Conectado
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Conexión 5G/4G inmediata en más de 140 países. Escanea el código QR y empieza a navegar al instante.
          </p>

          {/* Search bar inside hero */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca por país o región (ej. Japón, EE.UU., Europa...)"
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/15 focus:border-emerald-400 transition-all backdrop-blur-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Asistente IA de Viajes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedRegion('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedRegion === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Todos los Destinos ({DESTINATIONS.length})
        </button>
        <button
          onClick={() => setSelectedRegion('popular')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            selectedRegion === 'popular'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Más Populares</span>
        </button>
        <button
          onClick={() => setSelectedRegion('europe')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedRegion === 'europe'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🇪🇺 Europa
        </button>
        <button
          onClick={() => setSelectedRegion('asia')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedRegion === 'asia'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🇯🇵 Asia
        </button>
        <button
          onClick={() => setSelectedRegion('americas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedRegion === 'americas'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🌎 América
        </button>
        <button
          onClick={() => setSelectedRegion('global')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedRegion === 'global'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          🌐 Global Pass
        </button>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
          <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No encontramos destinos para "{searchTerm}"</h3>
          <p className="text-xs text-slate-500 mt-1">Prueba con el nombre del país en español o utiliza el filtro de regiones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setActiveDestination(dest)}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl leading-none">{dest.flag}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 block">{dest.regionLabel}</span>
                    </div>
                  </div>

                  {dest.popularBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {dest.popularBadge}
                    </span>
                  )}
                </div>

                {/* Operator chips */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold">Redes:</span>
                  {dest.topOperators.slice(0, 2).map((op, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                    >
                      {op}
                    </span>
                  ))}
                  {dest.topOperators.length > 2 && (
                    <span className="text-[10px] text-slate-400">+{dest.topOperators.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Desde</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    €{dest.startingPriceEUR.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                  <span>Ver Planes ({dest.plansCount})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Plan Selector Modal / Drawer */}
      {activeDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative overflow-hidden text-slate-900 max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{activeDestination.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{activeDestination.name}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      5G / 4G LTE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Redes asociadas: {activeDestination.topOperators.join(' • ')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDestination(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans List */}
            <div className="py-4 space-y-3 overflow-y-auto pr-1 flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Selecciona tu paquete de datos
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getPlansForDestination(activeDestination.code).map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-xl p-4 flex flex-col justify-between transition-all relative ${
                      plan.popular
                        ? 'border-emerald-500 bg-emerald-50/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                        Recomendado
                      </span>
                    )}

                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {plan.isUnlimited ? 'Datos Ilimitados' : `${plan.dataAmountGB} GB`}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Válido por {plan.validityDays} días
                      </div>

                      <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Compartir datos (Hotspot)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Instalación instantánea por QR</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        €{plan.priceEUR.toFixed(2)}
                      </span>

                      <button
                        onClick={() => {
                          onSelectPlanForPurchase(plan);
                          setActiveDestination(null);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Comprar eSIM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footnote */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Sin contratos ni permanencia
              </span>
              <span>Entrega inmediata por correo y app</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
