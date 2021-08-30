import mongoose from 'mongoose';

const AlertSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    cryptocurreny: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('alerts', AlertSchema);
