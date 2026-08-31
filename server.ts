import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { DESTINATIONS, ESIM_PLANS, DEMO_USERS, DEMO_USER_ESIMS } from './src/data/esimData';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper for Gemini AI
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Destinations
app.get('/api/destinations', (req: Request, res: Response) => {
  res.json({ success: true, destinations: DESTINATIONS });
});

// 3. Plans by country code
app.get('/api/plans', (req: Request, res: Response) => {
  const countryCode = (req.query.countryCode as string || '').toUpperCase();
  if (countryCode && ESIM_PLANS[countryCode]) {
    res.json({ success: true, plans: ESIM_PLANS[countryCode] });
  } else {
    res.json({ success: true, plans: Object.values(ESIM_PLANS).flat() });
  }
});

// 4. AI Travel Plan Recommendation
app.post('/api/ai/recommend', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, days, usage } = req.body;
    const ai = getGeminiClient();

    const destMatch = DESTINATIONS.find(d =>
      d.name.toLowerCase().includes((destination || '').toLowerCase()) ||
      (destination || '').toLowerCase().includes(d.name.toLowerCase())
    ) || DESTINATIONS[0];

    const plans = ESIM_PLANS[destMatch.code] || ESIM_PLANS['JP'];
    let chosenPlan = plans[1] || plans[0];
    if (usage === 'heavy' || parseInt(days) > 15) {
      chosenPlan = plans[plans.length - 1] || plans[0];
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Eres un asistente experto en viajes internacionales y telecomunicaciones eSIM.
El usuario viaja a: "${destination}" por ${days} días, con un perfil de uso "${usage}" (donde light=básico/mensajería, standard=redes/fotos, heavy=streaming/hotspot).
Genera una respuesta concisa en JSON con:
{
  "summary": "Explicación breve y profesional de por qué este paquete de datos es ideal",
  "tips": ["Consejo práctico 1 para ahorrar datos en ese destino", "Consejo 2 sobre cobertura local", "Consejo 3 sobre mapas o roaming"]
}`
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        res.json({
          success: true,
          recommendation: {
            summary: parsed.summary || `Recomendación óptima para ${days} días en ${destMatch.name}.`,
            recommendedPlan: chosenPlan,
            tips: parsed.tips || [
              `Descarga mapas offline antes de salir.`,
              `Configura la copia de seguridad de fotos solo en Wi-Fi.`,
              `Disfruta de conexión 5G con la red ${chosenPlan.operator}.`
            ]
          }
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini AI fallback triggered:', geminiErr);
      }
    }

    // Default fallback
    res.json({
      success: true,
      recommendation: {
        summary: `Para tu estancia de ${days} días en ${destMatch.name} con uso ${usage === 'heavy' ? 'intensivo' : 'habitual'}, te recomendamos el plan ${chosenPlan.name} en la red ${chosenPlan.operator}.`,
        recommendedPlan: chosenPlan,
        tips: [
          `Descarga los mapas offline de la zona en Google Maps antes del vuelo.`,
          `Desactiva la sincronización en segundo plano de apps pesadas para maximizar tus ${chosenPlan.dataAmountGB} GB.`,
          `La red ${chosenPlan.operator} ofrece cobertura 5G directa y soporte para compartir datos.`
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// VITE & SERVER INITIALIZATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`eSIM Global Hub Server running on http://localhost:${PORT}`);
  });
}

startServer();
