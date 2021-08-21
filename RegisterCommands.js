const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
require('dotenv').config();
const fs = require('fs');

const clientId = process.env.CLIENT_ID;
const guildId = '767371436603211797';

const commands = [];
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({
  version: '9',
}).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('/ commands wait');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log('Reloaded / commands');
  } catch (e) {
    console.error(e);
  }
})();
