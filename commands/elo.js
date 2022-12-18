const { SlashCommandBuilder } = require('discord.js');
const { searchbyusername } = require('../search.js');
const { requestData } = require('../requestdata.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('elo')
		.setDescription('Returns 1v1 and 2v2 elo of user!')
        .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const username = interaction.options.getString('user');
        const user_id = await searchbyusername(username); 
        const score1v1 = await requestData("/leaderboards/1v1/score-and-rank/" + user_id, mvs_client.accessToken);
        const score2v2 = await requestData("/leaderboards/2v2/score-and-rank/" + user_id, mvs_client.accessToken);
        console.log(score1v1.score);
        console.log(score2v2.score);
        console.log("1v1: " + score1v1.score + " 2v2: " + score2v2.score);
        string = "user: " + username + " 1v1 elo: " + parseInt(score1v1.score) + " 2v2 elo: " + parseInt(score2v2.score); 
        await interaction.editReply(string);
	},
};