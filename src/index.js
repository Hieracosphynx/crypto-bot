import { Client, Collection, Intents } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';
import Guild from './models/Guild';
import { config } from 'dotenv';
import { cryptocurrencies } from './lib/crypto';

// Init dotenv
config();

// Init client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});
client.commands = new Collection();

// CRON job for alarm

// Read through event files
const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.default.name, (...args) =>
      event.default.execute(...args)
    );
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args));
  }
}

// Read command files
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

// Condition commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err.message);
    await interaction.reply({ content: 'Yea.... Something went wrong' });
  }
});

// Save guild id
const guildHandler = async (guildId, callback) => {
  let guild = await Guild.find({ guild_id: guildId });

  if (guild.length > 0) {
    return callback('Guild already exist');
  }

  guild = new Guild({
    guild_id: guildId,
  });

  guild.save();
  return callback('Success');
};

client.on('messageCreate', async (message) => {
  const { guildId } = message;
  console.log(guildId);
  try {
    guildHandler(guildId, (callback) => {
      console.log(callback);
    });
  } catch (err) {
    console.error(err.message);
    return;
  }
});

// Login
client.login(process.env.TOKEN);
