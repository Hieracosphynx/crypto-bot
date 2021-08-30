"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.number.to-fixed.js");

var _discord = require("discord.js");

var _builders = require("@discordjs/builders");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const fetchPrice = async (crypto, currency) => {
  currency = currency === null ? 'USD' : currency;

  try {
    const response = await (0, _nodeFetch.default)("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=".concat(crypto, "&convert=").concat(currency), {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Invalid!');
    }

    const data = await response.json();
    const cryptoName = data.data[crypto].name;
    const currencyData = data.data[crypto].quote[currency];
    const dateStr = new Date(currencyData.last_updated).toUTCString();
    const cryptoPrice = "".concat(currency, " ").concat(currencyData.price.toFixed(2));
    const cryptoSlug = data.data[crypto].slug;
    const cryptoUrl = "https://coinmarketcap.com/currencies/".concat(cryptoSlug, "/");
    const embedMarketPrice = new _discord.MessageEmbed().setTitle(cryptoName).setColor('#6f98b0').setThumbnail('https://iconape.com/wp-content/files/bp/48627/png/coinmarketcap-1.png').setURL(cryptoUrl).addFields({
      name: 'Abbreviation',
      value: crypto,
      inline: true
    }, {
      name: 'Market Price',
      value: cryptoPrice,
      inline: true
    }, {
      name: 'Source',
      value: cryptoUrl
    }).setImage("https://cryptoicons.org/api/black/".concat(crypto.toLowerCase(), "/200")).setFooter("Last update ".concat(dateStr));
    return embedMarketPrice;
  } catch (e) {
    return e.message;
  }
};

const price = {
  data: new _builders.SlashCommandBuilder().setName('price').setDescription('/price CRYPTOCURRENCY').addStringOption(option => option.setName('cryptocurrency').setDescription('Choose your cryptocurrency').setRequired(true).addChoice('Bitcoin', 'BTC').addChoice('Cardano', 'ADA').addChoice('Cryptoblades', 'SKILL').addChoice('DinoX', 'DNXC').addChoice('Dogecoin', 'DOGE').addChoice('Ethereum', 'ETH').addChoice('PlantVsUndead', 'PVU').addChoice('Polkamonster', 'PKMON').addChoice('Smooth Love Potion', 'SLP')).addStringOption(option => option.setName('currency').setDescription('Country currency').addChoice('US Dollars', 'USD').addChoice('Philippine Pesos', 'PHP').addChoice('Canadian Dollar', 'CAD')),

  async execute(interaction) {
    await interaction.reply({
      embeds: [await fetchPrice(interaction.options.getString('cryptocurrency'), interaction.options.getString('currency'))]
    });
  }

};
var _default = price;
exports.default = _default;