const interaction = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an action`
    );
  },
};

export default interaction;
