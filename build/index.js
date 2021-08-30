"use strict";

require("core-js/modules/es.string.ends-with.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _discord = require("discord.js");

var _fs = _interopRequireDefault(require("fs"));

var _Guild = _interopRequireDefault(require("./models/Guild"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Init dotenv
(0, _dotenv.config)(); // Init client

const client = new _discord.Client({
  intents: [_discord.Intents.FLAGS.GUILDS, _discord.Intents.FLAGS.GUILD_MESSAGES, _discord.Intents.FLAGS.DIRECT_MESSAGES]
});
client.commands = new _discord.Collection(); // CRON job for alarm
// Read through event files

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
} // Read command files


const commandFiles = _fs.default.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require("./commands/".concat(file));

  client.commands.set(command.default.data.name, command.default);
} // Condition commands


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
}); // Save guild id

const guildHandler = async (guildId, callback) => {
  let guild = await _Guild.default.find({
    guild_id: guildId
  });

  if (guild.length > 0) {
    return callback('Guild already exist');
  }

  guild = new _Guild.default({
    guild_id: guildId
  });
  guild.save();
  return callback('Success');
};

client.on('messageCreate', async message => {
  const {
    guildId
  } = message;

  try {
    guildHandler(guildId, callback => {
      console.log(callback);
    });
  } catch (err) {
    console.error(err.message);
  }
}); // Login

client.login(process.env.TOKEN);