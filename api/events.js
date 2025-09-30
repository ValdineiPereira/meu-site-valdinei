// Arquivo: /api/events.js

export default async function handler(request, response) {
  // 1. Pegar as chaves secretas do ambiente seguro da Vercel
  const API_KEY = process.env.GOOGLE_API_KEY;
  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

  // 2. Montar a URL da API do Google, exatamente como antes, mas agora no servidor
  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  
  const googleApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    // 3. Fazer a chamada para o Google a partir do servidor
    const googleResponse = await fetch(googleApiUrl);
    
    if (!googleResponse.ok) {
      // Se o Google retornar um erro, nós o registramos e informamos
      console.error(`Google API Error: ${googleResponse.statusText}`);
      throw new Error('Falha ao buscar eventos do Google Calendar.');
    }
    
    const data = await googleResponse.json();
    
    // 4. Enviar os dados de volta para o navegador do visitante
    response.status(200).json(data);

  } catch (error) {
    // Se algo der errado, enviar uma mensagem de erro
    console.error(error);
    response.status(500).json({ error: error.message });
  }
}