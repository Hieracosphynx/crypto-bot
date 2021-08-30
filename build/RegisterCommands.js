"use strict";

require("core-js/modules/es.string.ends-with.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.to-json.js");

require("core-js/modules/es.promise.js");

var _discord = _interopRequireDefault(require("discord.js"));

var _v = require("discord-api-types/v9");

var _rest = require("@discordjs/rest");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _discord.default.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const commands = [];

const commandFiles = _fs.default.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require("./commands/".concat(file));

  commands.push(command.default.data.toJSON());
}

const rest = new _rest.REST({
  version: '9'
}).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('/ commands wait');
    await rest.put(_v.Routes.applicationGuildCommands(clientId, guildId), {
      body: commands
    });
    console.log('Reloaded / commands');
  } catch (e) {
    console.error(e);
  }
})();