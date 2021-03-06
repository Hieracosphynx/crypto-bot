import Discord from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import fs from 'fs';
import connectDB from './config/db';
import Guild from './models/Guild';
import { config } from 'dotenv';

config();
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const clientId = process.env.CLIENT_ID;

const commands = [];
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({
  version: '9',
}).setToken(process.env.TOKEN);

const delay = async (ms = 5000) =>
  setTimeout(() => {
    console.log('sss');
    return;
  }, ms);

(async () => {
  await connectDB();

  try {
    const guilds = await Guild.find({});
    console.log('Loading slash(/) commands');
    guilds.map(async ({ guild_id: guildId }) => {
      const res = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        {
          body: commands,
        }
      );
    });
    console.log('Success!');
  } catch (err) {
    console.error(err.message);
  }
})();
