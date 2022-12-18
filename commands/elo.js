const { SlashCommandBuilder } = require('discord.js');
const { getidfromusername, getusernamefromid } = require('../search.js');

const { requestData } = require('../requestdata.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('elo')
    .setDescription('Returns 1v1 and 2v2 elo of user!')
    .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(false)),
    execute: async function (interaction) {
        await interaction.deferReply();
        let username;
        const arg1 = interaction.options.getString('user') ?? 'No user provided';
        if (arg1 !== 'No user provided') {
            username = interaction.options.getString('user');
            const user_id = await getidfromusername(username);
            const wbname = await getusernamefromid(user_id)
            const score1v1 = await requestData("/leaderboards/1v1/score-and-rank/" + user_id, mvs_client.accessToken);
            const score2v2 = await requestData("/leaderboards/2v2/score-and-rank/" + user_id, mvs_client.accessToken);
            console.log(score1v1.score);
            console.log(score2v2.score);
            console.log("1v1: " + score1v1.score + " 2v2: " + score2v2.score);
            const string = "user: " + wbname + " 1v1 elo: " + parseInt(score1v1.score) + " 2v2 elo: " + parseInt(score2v2.score);
            await interaction.editReply(string);
        } else {
            // Check if the user has already registered their Warner Bros. in-game name
            fs.readFile('users.json', async (err, data) => {
                if (err) throw err;
                const users = JSON.parse(data);
                const user = users[interaction.member.id];
                if (user) {
                    const user_id = user.warnerBrosId;
                    const username = user.warnerBrosName;
                    const score1v1 = await requestData("/leaderboards/1v1/score-and-rank/" + user_id, mvs_client.accessToken);
                    const score2v2 = await requestData("/leaderboards/2v2/score-and-rank/" + user_id, mvs_client.accessToken);
                    console.log("1v1: " + score1v1.score + " 2v2: " + score2v2.score);
                    const string = "user: " + username + " 1v1 elo: " + parseInt(score1v1.score) + " 2v2 elo: " + parseInt(score2v2.score);
                    return interaction.editReply(string);
                } else {
                    // User has not registered their Warner Bros. in-game name
                    return interaction.editReply('You have not registered your Warner Bros. in-game name. Use the `/register` command to register your in-game name.');
                }
            });
        }

    },
};