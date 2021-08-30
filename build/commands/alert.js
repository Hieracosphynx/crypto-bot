"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _discord = require("discord.js");

var _builders = require("@discordjs/builders");

var _Alert = _interopRequireDefault(require("../models/Alert"));

const alertHandler = async (userId, crypto, value, guildId) => {
  const alert = await new _Alert.default({
    guild_id: guildId,
    user_id: userId,
    cryptocurrency: crypto,
    value: value,
    is_active: true
  });
  alert.save();
  return {
    embeds: [new _discord.MessageEmbed().setColor('#7afaae').setDescription("Not yet ".concat((0, _builders.bold)('functional'), "..."))]
  };
};

const alert = {
  data: new _builders.SlashCommandBuilder().setName('alert').setDescription('Alert user for cryptocurreny value').addStringOption(option => option.setName('cryptocurrency').setDescription('Cryptocurrency to look out for').setRequired(true)).addStringOption(option => option.setName('value').setDescription('Trigger when cryptocurrency reached value').setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const crypto = interaction.options.getString('cryptocurrency');
    const {
      id: guildId
    } = interaction.guild;
    const strValue = interaction.options.getString('value');
    const value = Number(strValue);

    if (!value) {
      await interaction.reply({
        embeds: [new _discord.MessageEmbed().setColor('#E31616').setTitle('Value field SHOULD be a number')]
      });
      return;
    }

    await interaction.reply(await alertHandler(userId, crypto, value, guildId));
  }

};
var _default = alert;
exports.default = _default;