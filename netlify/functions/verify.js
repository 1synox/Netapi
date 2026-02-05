const axios = require('axios');

exports.handler = async (event) => {
  const { uid } = event.queryStringParameters;

  if (!uid) {
    return { statusCode: 400, body: JSON.stringify({ error: "UID missing" }) };
  }

  try {
    // Naya Endpoint: Yeh UniPin ka internal validation route hai
    const response = await axios.post('https://www.unipin.com/in/services/get-player-name', 
    `game_code=bgmi&user_id=${uid}&zone_id=`, // Form data format
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://www.unipin.com/in/bgmi'
      }
    });

    // UniPin aksar HTML ya JSON mix bhejta hai
    const responseData = response.data;

    // Agar response mein name hai (UniPin format check)
    if (responseData && responseData.status === 'success') {
      return {
        statusCode: 200,
        body: JSON.stringify({ name: responseData.player_name || responseData.data })
      };
    } else {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: "Invalid UID or UniPin Busy", raw: responseData }) 
      };
    }
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Blocked by Firewall", details: error.message }) 
    };
  }
};
