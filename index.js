const fs = require('fs');
const { token, api_key } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const fetch = require('node-fetch');
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

setInterval(async () => {
  const response = await fetch(
    `https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=SKILL`,
    {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': api_key,
      },
    }
  );
  // if (!response.ok) {
  //   throw new Error('Invalid!');
  // }
  const data = await response.json();
  const cryptoPrice = `${data.data.SKILL.quote.USD.price.toFixed(2)}`;

  client.user.setUsername(`${cryptoPrice}|SKILL`);
}, 3600000);

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

client.login(token);
