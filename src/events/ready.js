const serverReady = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! ${client.user.tag}`);
  },
};

export default serverReady;
