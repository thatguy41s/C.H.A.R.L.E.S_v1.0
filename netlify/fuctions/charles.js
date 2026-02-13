const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message, isAdmin } = JSON.parse(event.body);
  const KEY = process.env.OPENROUTER_KEY; // Pulled from Netlify dashboard

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-2-9b-it:free",
        "messages": [
          {
            "role": "system", 
            "content": `You are Charles, a dry, sarcastic AI. You hate guests but tolerate the creator JOse. User is ${isAdmin ? 'THE ARCHITECT' : 'A GUEST'}.`
          },
          {"role": "user", "content": message}
        ]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Neural link failed." }) };
  }
};