import mongoose from 'mongoose';

const GuildSchema = mongoose.Schema(
  {
    guild_id: {
      type: String,
      required: true,
    },
    channel_id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('guilds', GuildSchema);
