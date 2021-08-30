"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const serverReady = {
  name: 'ready',
  once: true,

  execute(client) {
    console.log("Ready! ".concat(client.user.tag));
  }

};
var _default = serverReady;
exports.default = _default;