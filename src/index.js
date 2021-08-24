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
      current.value = data.data[current.symbol].quote.USD.price.toFixed(2);

      console.log(`Fetch data: $${current.value} | ${current.symbol}`);
    } catch (e) {
      console.log(e.message);
    }
  });
}, 600000);

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
