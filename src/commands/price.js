import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
require('dotenv').config();

const fetchPrice = async (crypto, currency) => {
  currency = currency === null ? 'USD' : currency;
  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto}&convert=${currency}`,
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Invalid!');
    }

    const data = await response.json();
    const cryptoName = data.data[crypto].name;
    const currencyData = data.data[crypto].quote[currency];
    const dateStr = new Date(currencyData.last_updated).toUTCString();
    const cryptoPrice = `${currency} ${currencyData.price.toFixed(2)}`;
    const cryptoSlug = data.data[crypto].slug;
    const cryptoUrl = `https://coinmarketcap.com/currencies/${cryptoSlug}/`;

    const embedMarketPrice = new MessageEmbed()
      .setTitle(cryptoName)
      .setColor('#6f98b0')
      .setThumbnail(
        'https://iconape.com/wp-content/files/bp/48627/png/coinmarketcap-1.png'
      )
      .setURL(cryptoUrl)
      .addFields(
        { name: 'Abbreviation', value: crypto, inline: true },
        { name: 'Market Price', value: cryptoPrice, inline: true },
        {
          name: 'Source',
          value: cryptoUrl,
        }
      )
      .setImage(`https://cryptoicons.org/api/black/${crypto.toLowerCase()}/200`)
      .setFooter(`Last update ${dateStr}`);

    return embedMarketPrice;
  } catch (e) {
    return e.message;
  }
};

const price = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('/price CRYPTOCURRENCY')
    .addStringOption((option) =>
      option
        .setName('cryptocurrency')
        .setDescription('Choose your cryptocurrency')
        .setRequired(true)
        .addChoice('Bitcoin', 'BTC')
        .addChoice('Cardano', 'ADA')
        .addChoice('Cryptoblades', 'SKILL')
        .addChoice('DinoX', 'DNXC')
        .addChoice('Dogecoin', 'DOGE')
        .addChoice('Ethereum', 'ETH')
        .addChoice('PlantVsUndead', 'PVU')
        .addChoice('Polkamonster', 'PKMON')
        .addChoice('Smooth Love Potion', 'SLP')
    )
    .addStringOption((option) =>
      option
        .setName('currency')
        .setDescription('Country currency')
        .addChoice('US Dollars', 'USD')
        .addChoice('Philippine Pesos', 'PHP')
        .addChoice('Canadian Dollar', 'CAD')
    ),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        await fetchPrice(
          interaction.options.getString('cryptocurrency'),
          interaction.options.getString('currency')
        ),
      ],
    });
  },
};

export default price;
