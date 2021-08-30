"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

const GuildSchema = _mongoose.default.Schema({
  guild_id: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model('guilds', GuildSchema);

exports.default = _default;