const { SlashCommandBuilder } = require('@discordjs/builders');

const fetchData = (myString) => {
  return myString;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('/price CRYPTO'),
  async execute(interaction) {
    await interaction.reply(fetchData('What?!'));
  },
};
