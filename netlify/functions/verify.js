const axios = require('axios');

exports.handler = async (event) => {
  const { uid } = event.queryStringParameters;

  if (!uid) {
    return { statusCode: 400, body: JSON.stringify({ error: "UID missing" }) };
  }

  try {
    // Codashop India BGMI Validation Endpoint
    const response = await axios({
      method: 'post',
      url: 'https://order-sg.codashop.com/initPayment.action',
      data: new URLSearchParams({
        'groupId': '45', // BGMI Group ID
        'itemId': '241', // Sample Item ID (60 UC)
        'cartId': '',
        'user_id': uid,
        'zoneId': '',
        'user_zone_id': '',
        'voucherPriceId': '1336',
        'price': '75.0',
        'payMethod': 'UP',
        'voucherId': '45'
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Origin': 'https://www.codashop.com',
        'Referer': 'https://www.codashop.com/in/battlegrounds-mobile-india'
      }
    });

    // Codashop response mein 'confirmationFields' ke andar username hota hai
    if (response.data && response.data.confirmationFields) {
      const username = response.data.confirmationFields.username;
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ name: username })
      };
    } else {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ error: "Manual", msg: "Codashop busy, enter name manually" }) 
      };
    }
  } catch (error) {
    return { 
      statusCode: 200, 
      body: JSON.stringify({ error: "Manual", msg: "Server Error: Enter Name Manually" }) 
    };
  }
};
