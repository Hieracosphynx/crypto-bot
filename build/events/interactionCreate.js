"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const interaction = {
  name: 'interactionCreate',

  execute(interaction) {
    console.log("".concat(interaction.user.tag, " in #").concat(interaction.channel.name, " triggred an action"));
  }

};
var _default = interaction;
exports.default = _default;