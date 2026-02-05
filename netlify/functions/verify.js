const axios = require('axios');

exports.handler = async (event) => {
  const { uid } = event.queryStringParameters;

  if (!uid) {
    return { statusCode: 400, body: JSON.stringify({ error: "UID missing" }) };
  }

  try {
    // UniPin Validation API logic
    // Hum UniPin ko request bhej rahe hain jaise unka apna frontend bhejta hai
    const response = await axios.post('https://api.unipin.com/v1/gbw/order/validate', {
      userid: uid,
      zoneid: "",
      game: "bgmi"
    }, {
      headers: {
        'Origin': 'https://www.unipin.com',
        'Referer': 'https://www.unipin.com/in/bgmi',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.data && response.data.data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ name: response.data.data.username })
      };
    } else {
      return { statusCode: 404, body: JSON.stringify({ error: "Player not found" }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error or blocked by UniPin" }) };
  }
};
