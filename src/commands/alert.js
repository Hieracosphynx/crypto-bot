import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder, bold } from '@discordjs/builders';
import Alert from '../models/Alert';
import Guild from '../models/Guild';

const alertHandler = async (userId, crypto, value, guildId, channelId) => {
  console.log(userId, crypto, value, guildId, channelId);
  const alert = await new Alert({
    guild_id: guildId,
    user_id: userId,
    cryptocurrency: crypto,
    value: value,
    is_active: true,
  });

  alert.save();
  const guild = await Guild.findOne({ guild_id: guildId });
  if (!guild) {
    console.log('guild');
    const newGuild = new Guild({
      guild_id: guildId,
      channel_id: channelId,
    });
    await newGuild.save();
  } else {
    const channel = await Guild.findOne({ channel_id: channelId });
    if (!channel) {
      console.log('channel');
      await Guild.findOneAndUpdate(
        { guild_id: guildId },
        { channel_id: channelId }
      );
    }
  }

  return {
    embeds: [
      new MessageEmbed()
        .setColor('#7afaae')
        .setDescription(`Set: $${value} Cryptocurrency: ${crypto}`),
    ],
  };
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
        .setName('value')
        .setDescription('Trigger when cryptocurrency reached value')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const crypto = interaction.options.getString('cryptocurrency');
    const { id: guildId } = interaction.guild;
    const { id: channelId } = interaction.channel;
    const strValue = interaction.options.getString('value');
    const value = +strValue;

    if (!value && value !== 0) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#E31616')
            .setDescription('Value option field should be a number'),
        ],
      });
      return;
    }
    await interaction.reply(
      await alertHandler(userId, crypto, value, guildId, channelId)
    );
  },
};

export default alert;
