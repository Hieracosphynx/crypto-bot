"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AlertSchema = _mongoose.default.Schema({
  user_id: {
    type: String,
    required: true
  },
  cryptocurrency: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  is_active: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model('alerts', AlertSchema);

exports.default = _default;