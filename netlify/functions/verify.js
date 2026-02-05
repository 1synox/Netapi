const axios = require('axios');

exports.handler = async (event) => {
  const { uid } = event.queryStringParameters;

  if (!uid) {
    return { statusCode: 400, body: JSON.stringify({ error: "UID missing" }) };
  }

  try {
    // Alternate Method: Using a different endpoint structure
    const response = await axios({
      method: 'post',
      url: 'https://www.unipin.com/in/services/get-player-name',
      data: `game_code=bgmi&user_id=${uid}&zone_id=`,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Origin': 'https://www.unipin.com',
        'Referer': 'https://www.unipin.com/in/bgmi'
      },
      timeout: 8000 // 8 seconds timeout
    });

    if (response.data && response.data.status === 'success') {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ name: response.data.player_name || response.data.data })
      };
    } else {
        // Agar UniPin fail ho, toh ye ek fallback error message dega
        return { 
          statusCode: 200, 
          body: JSON.stringify({ error: "UID sahi hai par name load nahi ho raha. Manually enter karein." }) 
        };
    }
  } catch (error) {
    // Cloudflare Bypass Attempt Failed
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
          error: "Verification Temporary Down", 
          msg: "UniPin ne server block kiya hai. Aap manually IGN daal sakte hain." 
      }) 
    };
  }
};
