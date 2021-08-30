"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _mongoose = _interopRequireDefault(require("mongoose"));

const connectDB = async () => {
  try {
    await _mongoose.default.connect("mongodb+srv://mdlc:".concat(process.env.MONGODB_PASSWORD, "@cluster0.6qyku.mongodb.net/test?retryWrites=true&w=majority"), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to database');
  } catch (err) {
    console.error(err.message);
  }
};

var _default = connectDB;
exports.default = _default;