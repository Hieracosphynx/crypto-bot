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
      throw new Error('Error');
    }
    const data = await response.json();
    const { price, last_updated } = data.data[symbol].quote['USD'];
    return { price: +price.toFixed(2), date: last_updated };
  } catch (err) {
    console.error(err.message);
  }
};

const cryptosHandler = (cryptos, alerts) => {
  let isExisting = false;
  cryptos.map(async (crypto) => {
    const { price } = await fetchHandler(crypto.toUpperCase());

    if (cryptocurrencies.length === 0) {
      cryptocurrencies.push({ cryptocurrency: crypto, value: price });
    }
    cryptocurrencies.map((cryptocurrency) => {
      if (cryptocurrency.cryptocurrency === crypto) {
        isExisting = true;
        cryptocurrency.value = price;
      }
      alerts.map((alert) => {
        const { cryptocurrency: alertCrypto, value, user_id } = alert;
        if (cryptocurrency.cryptocurrency === alertCrypto.toLowerCase()) {
          console.log(value, cryptocurrency.value);
          if (value >= cryptocurrency.value) {
            console.log('no');
          }
        }
      });
    });
    if (!isExisting) {
      isExisting = false;
      cryptocurrencies.push({ cryptocurrency: crypto, value: price });
    }
  });
};

const alertHandler = (activeAlerts) => {};

const serverReady = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setPresence({
      status: 'online',
    });
    // Connect to database
    await connectDB();

    console.log(`Ready! ${client.user.tag}`);

    // Get data
    let cryptos;
    let alerts;
    setInterval(async () => {
      cryptos = await Alert.find({})
        .distinct('cryptocurrency')
        .where('is_active')
        .equals('true');
      alerts = await Alert.find({}).where('is_active').equals('true');
      await cryptosHandler(cryptos, alerts);
    }, 10000);
  },
};

export default serverReady;
