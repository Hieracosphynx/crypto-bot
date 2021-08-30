"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _db = _interopRequireDefault(require("../config/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const serverReady = {
  name: 'ready',
  once: true,

  async execute(client) {
    // Connect to database
    await (0, _db.default)(); // const channel = client.channels.cache.get('881378641563496478');
    // channel.send('Baho mo naman');

    client.user.setPresence({
      status: 'idle'
    });
    console.log("Ready! ".concat(client.user.tag));
  }

};
var _default = serverReady;
exports.default = _default;