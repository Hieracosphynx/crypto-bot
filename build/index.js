"use strict";

require("core-js/modules/es.promise.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.string.ends-with.js");

require("core-js/modules/web.dom-collections.iterator.js");

var _discord = require("discord.js");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _discord.Client({
  intents: [_discord.Intents.FLAGS.GUILDS]
});

require('dotenv').config();

client.commands = new _discord.Collection();
const guildId = process.env.GUILD_ID;
let isInitial = true;
const crypto = [{
  symbol: 'ADA',
  value: 0
}, {
  symbol: 'SKILL',
  value: 0
}, {
  symbol: 'ETH',
  value: 0
}];

const fetchData = async () => {
  crypto.map(async current => {
    try {
      const response = await (0, _nodeFetch.default)("https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=".concat(current.symbol), {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Could not get data.');
      }

      const data = await response.json();
      current.value = data.data[current.symbol].quote.USD.price.toFixed(2);
      console.log("Fetch data: $".concat(current.value, " | ").concat(current.symbol));
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
  let nickName = "$".concat(crypto[computedIndex].value, " | ").concat(crypto[computedIndex].symbol);
  client.guilds.cache.find(guild => guild.id === guildId).me.setNickname("".concat(nickName));
  console.log("10seconds Nickname: $".concat(nickName));
}, 10000);

const eventFiles = _fs.default.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require("./events/".concat(file));

  if (event.once) {
    client.once(event.default.name, function () {
      return event.default.execute(...arguments);
    });
  } else {
    client.on(event.default.name, function () {
      return event.default.execute(...arguments);
    });
  }
}

const commandFiles = _fs.default.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require("./commands/".concat(file));

  client.commands.set(command.default.data.name, command.default);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (e) {
    console.error(e.message);
    await interaction.reply({
      content: 'Something went wrong!',
      ephemeral: true
    });
  }
});
client.login(process.env.TOKEN);