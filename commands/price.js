const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('/price CRYPTOCURRENCY')
    .addStringOption((option, cryptocurrency) =>
      option
        .setName('cryptocurrencies')
        .setDescription('Choose your cryptocurrency')
        .addChoice('ETH', 'Ethereum')
        .addChoice('BIT', 'Bitcoin')
        .addChoice('DOG', 'Doge Coin')
    ),
  async execute(interaction) {
    await interaction.reply({
      content: '[This]https://Cryptocurrency.com',
      ephemeral: true,
    });
  },
};
