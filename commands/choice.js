const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require('./price');

let choiceName = '';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choice')
    .setDescription('This is a dummy choice')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Yep category')
        .setRequired(true)
        .addChoice('ETH', 'gif_funny')
        .addChoice('Meme', 'yea_right')
        .addChoice('Witcher', (choiceName = 'Geralt'))
    ),
  async execute(interaction) {
    await interaction.reply(`You are ${choiceName}`);
  },
};
