const { Client, Collection, Intents } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();
client.commands = new Collection();

const guildId = process.env.GUILD_ID;
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

let fetchIndex = 0;

setInterval(() => {
  crypto.map(async (current) => {
    try {
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${current.symbol}`,
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
      console.log(data);
      current.value = data.data[current.symbol].quote.USD.price.toFixed(2);
      client.guilds.cache
        .find((guild) => guild.id === guildId)
        .me.setNickname(`${current.value} | ${current.symbol}`);
    } catch (e) {
      console.log(e.message);
    }
  });
}, 1200000);

let index = 0;
setInterval(() => {
  client.guilds.cache
    .find((guild) => guild.id === guildId)
    .me.setNickname(
      `${crypto[index++ % crypto.length].value} | ${
        crypto[index % crypto.length].symbol
      }`
    );
}, 10000);

const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
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

// setInterval(async () => {
//   try {
//     const response = await fetch(
//       `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto[fetchIndex++]}`,
//       {
//         method: 'GET',
//         headers: {
//           'X-CMC_PRO_API_KEY': process.env.API_KEY,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error('Invalid!');
//     }
//     const data = await response.json();
//     const cryptoPrice = `${data.data.ADA.quote.USD.price.toFixed(2)}`;
//     client.guilds.cache
//       .find((guild) => guild.id === guildId)
//       .me.setNickname(`${cryptoPrice}|ADA`);
//   } catch (e) {
//     console.log(e.message);
//   client.guilds.cache
//     .find((guild) => guild.id === guildId)
//     .me.setNickname(`Cryptobot`);
// }
// }, 300000);
