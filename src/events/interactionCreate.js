module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggred an action`
    );
  },
};