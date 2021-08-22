const Discord = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const fs = require('fs');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
const commandFiles = fs
  .readdirSync('./src/commands')
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
