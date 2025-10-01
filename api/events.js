// Arquivo: /api/events.js

export default async function handler(request, response) {
  // Adiciona cabeçalhos CORS para permitir que o frontend chame esta API
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Responde a requisições OPTIONS (pre-flight) que os navegadores fazem
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // 1. Pega as chaves secretas do ambiente seguro da Vercel
  const API_KEY = process.env.GOOGLE_API_KEY;
  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

  // Se as chaves não estiverem configuradas, retorne um erro claro
  if (!API_KEY || !CALENDAR_ID) {
    console.error('ERRO: Variáveis de ambiente GOOGLE_API_KEY ou GOOGLE_CALENDAR_ID não encontradas.');
    return response.status(500).json({ error: 'As variáveis de ambiente do Google Calendar não estão configuradas no servidor.' });
  }

  // 2. Monta a URL da API do Google
  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  
  const googleApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    // 3. Faz a chamada para o Google a partir do servidor
    const googleResponse = await fetch(googleApiUrl);
    
    // Se a resposta do Google não for OK, captura e loga o erro
    if (!googleResponse.ok) {
      const errorBody = await googleResponse.json();
      console.error(`Google API Error: ${googleResponse.status} ${googleResponse.statusText}`, JSON.stringify(errorBody, null, 2));
      const errorMessage = errorBody?.error?.message || 'Falha ao buscar eventos do Google Calendar.';
      throw new Error(errorMessage);
    }
    
    const data = await googleResponse.json();
    
    // 4. Envia os dados de volta para o navegador do visitante
    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na função da API:', error);
    return response.status(500).json({ error: error.message });
  }
}