export default async function handler(request, response) {
  // Manejo de cabeceras CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // URL del Web App de Google Apps Script (usar Variable de Entorno en Vercel)
  const urlGoogleScript = process.env.GAS_WEB_APP_URL || "https://script.google.com/macros/s/AKfycbwXPIvlweR0DGfJjfKvKAPz_OHQN0HXiMi4Z3uTbneTfRVDWTNLM-Lv_JUxpucGnLQyzw/exec";

  try {
    let targetUrl = urlGoogleScript;
    const fetchOptions = {
      method: request.method,
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow' // Permite seguir la redirección requerida por Google Apps Script
    };

    if (request.method === 'POST') {
      fetchOptions.body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
    } else if (request.method === 'GET') {
      // Reenviar parámetros URL si vienen en la petición GET
      const queryParams = new URLSearchParams(request.query).toString();
      if (queryParams) {
        targetUrl += `?${queryParams}`;
      }
    }

    const apiRespuesta = await fetch(targetUrl, fetchOptions);
    const datos = await apiRespuesta.json();

    return response.status(200).json(datos);
  } catch (error) {
    return response.status(500).json({ error: "Error al conectar con Google Script", details: error.message });
  }
} 