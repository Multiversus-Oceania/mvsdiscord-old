const { SlashCommandBuilder } = require('discord.js');
const { User, addUserToJSONFile } = require('../users.js');
const { getidfromusername, getusernamefromid } = require('../search.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers your Warner Bros username (in game name) and links to your Discord account')
    .addStringOption(option => option.setName('username').setDescription('Your Warner Bros username (in game name)').setRequired(true)),
  async execute(interaction) {
    // Get the username from the command options
    await interaction.deferReply();
    const username = interaction.options.getString('username');
    const wbid = await getidfromusername(username);
    const wbuser = await getusernamefromid(wbid);
    
    const user = new User(interaction.member.id, wbuser, wbid);
    addUserToJSONFile(user);

    // Reply to the user to confirm that their username has been registered
    await interaction.editReply(`Your Warner Bros username has been registered as "${username}"`);
  },
};
