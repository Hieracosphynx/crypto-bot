const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
require('dotenv').config();
// const { api_key } = require('../config.json');

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
    const cryptoPrice = `${crypto} ${currency}: ${data.data[crypto].quote[
      currency
    ].price.toFixed(2)}`;

    return cryptoPrice;
  } catch (e) {
    return e.message;
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('/price CRYPTOCURRENCY')
    .addStringOption((option) =>
      option
        .setName('cryptocurrency')
        .setDescription('Choose your cryptocurrency')
        .setRequired(true)
        .addChoice('Ethereum', 'ETH')
        .addChoice('Bitcoin', 'BTC')
        .addChoice('Dogecoin', 'DOG')
        .addChoice('Cryptoblades', 'SKILL')
        .addChoice('DinoX', 'DNXC')
        .addChoice('Cordano', 'ADA')
        .addChoice('PlantVsUndead', 'PVU')
        .addChoice('Polkamonster', 'PKMON')
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
      content: await fetchPrice(
        interaction.options.getString('cryptocurrency'),
        interaction.options.getString('currency')
      ),
    });
  },
};
