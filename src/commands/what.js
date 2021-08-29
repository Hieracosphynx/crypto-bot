const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
require('dotenv').config();

const fetchData = async (search) => {
  try {
    const response = await fetch(
      `https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${search}`,
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong.');
    }
    const data = await response.json();

    const searchUrlData = data.data[search.toUpperCase()];

    const searchData = {
      name: searchUrlData.name,
      symbol: searchUrlData.symbol,
      logo: searchUrlData.logo,
      description: searchUrlData.description,
      website: searchUrlData.urls.website[0]
        ? searchUrlData.urls.website[0]
        : 'No website found',
      twitter: searchUrlData.urls.twitter[0]
        ? searchUrlData.urls.twitter[0]
        : 'No twitter found',
      reddit: searchUrlData.urls.reddit[0]
        ? searchUrlData.urls.reddit[0]
        : 'No reddit found',
    };

    const embedSearch = new MessageEmbed()
      .setColor('#6f98b0')
      .setTitle(searchData.name)
      .setURL(searchData.website)
      .setDescription(searchData.description)
      .setThumbnail(searchData.logo)
      .addFields(
        {
          name: 'Twitter',
          value: searchData.twitter,
          inline: true,
        },
        {
          name: 'Reddit',
          value: searchData.reddit,
          inline: true,
        }
      )
      .setImage(
        `https://cryptoicons.org/api/black/${searchData.symbol.toLowerCase()}/200`
      )
      .setTimestamp();
    return embedSearch;
  } catch (e) {
    console.log(e.message);
    return new MessageEmbed()
      .setColor('#eb4034')
      .setDescription(
        '404: Not found. Use the crypto symbol (eth, btc, doge) when searching'
      );
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('what')
    .setDescription('Search for crypto')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Search by symbol ex: ETH, BTC, SKILL')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      embeds: [await fetchData(interaction.options.getString('input'))],
    });
  },
};
