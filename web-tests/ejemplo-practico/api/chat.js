// /api/chat.js
// Función serverless para Vercel / Netlify Functions
// Requiere configurar la variable de entorno OPENAI_API_KEY

export default async function handler(req, res) {
  // Configurar CORS (permite peticiones desde tu dominio)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { mensaje } = req.body;
    if (!mensaje || typeof mensaje !== 'string') {
      return res.status(400).json({ error: 'El campo "mensaje" es obligatorio.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Falta OPENAI_API_KEY en variables de entorno');
      return res.status(500).json({ error: 'Configuración del servidor incompleta.' });
    }

    // Prompt del sistema: recepcionista perfecta del negocio
    const systemPrompt = `
Eres la recepcionista virtual de "TuNegocio", una empresa premium en Bilbao.
Tu misión es atender a los clientes de forma amable, profesional y cálida.
Responde de manera concisa (máximo 3 frases).
Siempre que sea posible, guía la conversación para que el cliente facilite su número de teléfono y así podamos concertar una cita personalizada.
Ejemplo: "Me encantaría ayudarte con eso. ¿Podrías dejarme tu número de teléfono? Así nuestro equipo te llama en menos de 15 minutos para darte toda la información."
No inventes información sobre precios exactos; deriva siempre a la llamada telefónica.
Habla en español, con un tono cercano pero profesional.
`.trim();

    // Llamada a OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensaje }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('Error de OpenAI:', errorData);
      return res.status(502).json({ error: 'El servicio de IA no está disponible en este momento.' });
    }

    const data = await openaiResponse.json();
    const respuestaIA = data.choices[0].message.content.trim();

    return res.status(200).json({ respuesta: respuestaIA });

  } catch (error) {
    console.error('Error en la función serverless:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
