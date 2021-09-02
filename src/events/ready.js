import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Alert from '../models/Alert';
import Guild from '../models/Guild';
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
    return { price: +price.toFixed(2), date: last_updated };
  } catch (err) {
    console.error(err.message);
  }
};

const addCryptoValueHandler = (symbols) => {
  symbols.map((symbol) => {
    cryptoValues.map((cryptoValue) => {
      if (cryptoValue.symbol === symbol) {
        fetchHandler(symbol).then((res) => {
          cryptoValue.price = res.price;
          cryptoValue.date = res.date;
        });
      }
    });
  });
};

const addSymbolHandler = (cryptos) => {
  cryptos.map((crypto) => {
    const upperCrypto = crypto.toUpperCase();
    const exist = cryptocurrencies.includes(upperCrypto);
    if (!exist) {
      cryptocurrencies.push(upperCrypto);
      cryptoValues.push({ symbol: upperCrypto, price: 0 });
    }
  });
};

const alertHandler = (alerts, client) => {
  console.log(cryptoValues);
  alerts.map(async (alert) => {
    const { _id, user_id, guild_id, cryptocurrency: symbol, value } = alert;
    const guild = await Guild.find({ guild_id });
    if (!guild) {
      console.log('No guild!');
    }
    const { channel_id } = guild[0];
    if (!channel_id) {
      console.error('No channel!');
      return;
    }
    const channel = client.channels.cache.get(`${channel_id}`);

    cryptoValues.map(async (cryptoValue) => {
      if (cryptoValue.symbol.toUpperCase() === symbol.toUpperCase()) {
        if (value <= cryptoValue.price) {
          await Alert.findByIdAndUpdate({ _id }, { is_active: false });
          const date = new Date(cryptoValue.date).toUTCString();
          const messageEmbed = new MessageEmbed()
            .setColor('#0C9BED')
            .addFields(
              {
                name: 'Alert:',
                value: `<@${user_id}>`,
                inline: true,
              },
              {
                name: 'Threshold: ',
                value: `$${value}`,
                inline: true,
              }
            )
            .addFields(
              {
                name: 'Symbol:',
                value: `${symbol}`,
                inline: true,
              },
              {
                name: 'Price:',
                value: `$${cryptoValue.price}`,
                inline: true,
              },
              {
                name: 'Date Updated: ',
                value: `${date}`,
              }
            );
          channel.send({ embeds: [messageEmbed] });
        }
      }
    });
  });
};

// TODO: Set a main function.

const serverReady = {
  name: 'ready',
  once: true,
  async execute(client) {
    // Connect to database
    await connectDB();
    client.user.setPresence({
      status: 'offline',
    });

    // Get data
    let cryptos;
    let alerts;

    setInterval(async () => {
      try {
        /**
         * Set initial value to empty arrays.
         * Remove any unneccessary cryptocurrencies not being monitored by any user/s
         */
        cryptocurrencies.splice(0, cryptocurrencies.length);
        cryptoValues.splice(0, cryptoValues.length);

        cryptos = await Alert.find({})
          .distinct('cryptocurrency')
          .where('is_active')
          .equals('true');
        alerts = await Alert.find({}).where('is_active').equals('true');
        addSymbolHandler(cryptos);
        addCryptoValueHandler(cryptocurrencies);
        setTimeout(() => alertHandler(alerts, client), 10000); // Delay function to wait for data to be fetched
      } catch (err) {
        console.error(err.message);
      }
    }, 900000);
  },
};

export default serverReady;
