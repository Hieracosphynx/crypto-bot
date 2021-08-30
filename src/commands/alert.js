import { SlashCommandBuilder } from '@discordjs/builders';

const alert = {
  data: new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Alert user for cryptocurreny value')
    .addStringOption((option) =>
      option
        .setName('cryptocurrency')
        .setDescription('Cryptocurrency to look out for')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      content: interaction.options.getString('cryptocurrency'),
      ephemeral: true,
    });
  },
};

export default alert;
