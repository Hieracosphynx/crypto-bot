import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Alert from '../models/Alert';
import connectDB from '../config/db';
import { cryptocurrencies, cryptoValues } from '../lib/crypto';
import { API_URL } from '../config/endpoints';

const fetchHandler = async (symbol) => {
  try {
    const response = await fetch(`${API_URL}/quotes/latest?symbol=${symbol}`, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error('SError');
    }
    const data = await response.json();
    const { price, last_updated } =
      data.data[symbol.toUpperCase()].quote['USD'];
    return Promise.resolve({ price: +price.toFixed(2), date: last_updated });
  } catch (err) {
    console.error(err.message);
  }
};

const addCryptoValueHandler = (symbols) => {
  return Promise.all([
    symbols.map((symbol) => {
      cryptoValues.map((cryptoValue) => {
        if (cryptoValue.symbol === symbol) {
          fetchHandler(symbol).then((res) => {
            cryptoValue.price = res.price;
            cryptoValue.date = res.date;
          });
        }
      });
    }),
    alertHandler(),
  ]);
};

const addSymbolHandler = (cryptos) => {
  return Promise.all(
    cryptos.map((crypto) => {
      const upperCrypto = crypto.toUpperCase();
      const exist = cryptocurrencies.includes(upperCrypto);
      if (!exist) {
        cryptocurrencies.push(upperCrypto);
        cryptoValues.push({ symbol: upperCrypto, price: 0 });
      }
    })
  );
};

const alertHandler = (alerts, client) => {
  console.log(cryptoValues);
  // alerts.map((alert) => {
  //   const { user_id, guild_id, cryptocurrency: symbol } = alert;
  // });
};

const serverReady = {
  name: 'ready',
  once: true,
  async execute(client) {
    // Connect to database
    await connectDB();
    const { price, date } = await fetchHandler('BTC');
    cryptoValues.push({ price, date });

    // Get data
    // let cryptos;
    let alerts;
    // setInterval(async () => {
    // try {
    //   cryptos = await Alert.find({})
    //     .distinct('cryptocurrency')
    //     .where('is_active')
    //     .equals('true');
    alerts = await Alert.find({}).where('is_active').equals('true');
    //   await addSymbolHandler(cryptos);
    //   await addCryptoValueHandler(cryptocurrencies);
    alertHandler(alerts, client);
    // } catch (err) {
    //   console.error(err.message);
    // }
    // }, 3000);
    //   client.user.setPresence({
    //     status: 'offline',
    //   });
  },
};

export default serverReady;
// const cryptosHandler = (cryptos, alerts, client) => {
//   let isExisting = false;
//   console.log(client);
//   cryptos.map(async (crypto) => {
//     const { price } = await fetchHandler(crypto.toUpperCase());

//     if (cryptocurrencies.length === 0) {
//       cryptocurrencies.push({ cryptocurrency: crypto, value: price });
//     }
//     cryptocurrencies.map((cryptocurrency) => {
//       if (cryptocurrency.cryptocurrency === crypto) {
//         isExisting = true;
//         cryptocurrency.value = price;
//       }
//       alerts.map((alert) => {
//         const { cryptocurrency: alertCrypto, value, user_id } = alert;
//         if (cryptocurrency.cryptocurrency === alertCrypto.toLowerCase()) {
//           if (value >= cryptocurrency.value) {
//             let channel = client.channels.cache.get('881378641563496478');
//             channel.send(`<@${user_id}>! ${alertCrypto} is at ${price}`);
//           }
//         }
//       });
//     });
//     if (!isExisting) {
//       isExisting = false;
//       cryptocurrencies.push({ cryptocurrency: crypto, value: price });
//     }
//   });
// };
