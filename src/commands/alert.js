import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Alert from '../models/Alert';

const alertHandler = async (userId, crypto, value) => {
  const alert = await new Alert({
    user_id: userId,
    cryptocurrency: crypto,
    value: value,
    is_active: true,
  });

  alert.save();

  return { content: `Saved!` };
};

const alert = {
  data: new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Alert user for cryptocurreny value')
    .addStringOption((option) =>
      option
        .setName('cryptocurrency')
        .setDescription('Cryptocurrency to look out for')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('value')
        .setDescription('Trigger when cryptocurrency reached value')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const crypto = interaction.options.getString('cryptocurrency');
    const strValue = interaction.options.getString('value');
    const value = Number(strValue);

    if (!value) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#E31616')
            .setTitle('Value field SHOULD be a number'),
        ],
      });
      return;
    }
    await interaction.reply(await alertHandler(userId, crypto, value));
  },
};

export default alert;
