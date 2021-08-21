const fetch = require('node-fetch');
const { api_key } = require('./config.json');

const fetchData = async () => {
  try {
    const response = await fetch(
      'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD',
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': api_key,
        },
      }
    );

    if (!response.ok) {
      throw new Error('What');
    }

    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e.message);
  }
};

fetchData();
