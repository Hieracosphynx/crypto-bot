import connectDB from '../config/db';

const serverReady = {
  name: 'ready',
  once: true,
  async execute(client) {
    // Connect to database
    await connectDB();

    // const channel = client.channels.cache.get('881378641563496478');
    // channel.send('Baho mo naman');
    client.user.setPresence({
      status: 'idle',
    });
    console.log(`Ready! ${client.user.tag}`);
  },
};

export default serverReady;
