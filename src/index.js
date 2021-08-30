import { Client, Collection, Intents } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
client.commands = new Collection();

const guildId = process.env.GUILD_ID;
let isInitial = true;

const crypto = [
  {
    symbol: 'ADA',
    value: 0,
  },
  {
    symbol: 'SKILL',
    value: 0,
  },
  {
    symbol: 'ETH',
    value: 0,
  },
];

const fetchData = async () => {
  crypto.map(async (current) => {
    try {
      const response = await fetch(
        `https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${current.symbol}`,
        {
          method: 'GET',
          headers: {
            'X-CMC_PRO_API_KEY': process.env.API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Could not get data.');
      }
      const data = await response.json();
      current.value = data.data[current.symbol].quote.USD.price.toFixed(2);

      console.log(`Fetch data: $${current.value} | ${current.symbol}`);
    } catch (e) {
      console.log(e.message);
    }
  });
};

if (isInitial) {
  fetchData();
  isInitial = false;
}

setInterval(() => {
  fetchData();
}, 1200000);

let index = 0;
setInterval(() => {
  let computedIndex = index++ % crypto.length;
  let nickName = `$${crypto[computedIndex].value} | ${crypto[computedIndex].symbol}`;
  client.guilds.cache
    .find((guild) => guild.id === guildId)
    .me.setNickname(`${nickName}`);
  console.log(`10seconds Nickname: $${nickName}`);
}, 10000);

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

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (e) {
    console.error(e.message);
    await interaction.reply({
      content: 'Something went wrong!',
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
