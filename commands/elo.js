const { SlashCommandBuilder } = require('discord.js');
const { getidfromusername, getusernamefromid, getUserLeaderboard } = require('../search.js');
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
            const username = interaction.options.getString('user');
            const user_id = await getidfromusername(username);
            if (user_id === 'Couldn\'t find user') {
                await interaction.editReply('Couldn\'t find user');
                return;
            }
            const wbname = await getusernamefromid(user_id);
            const profile = await getUserLeaderboard(user_id);
            console.log("1v1 rank: " + profile.OneVsOne.rank + " 1v1 elo: " + parseInt(profile.OneVsOne.score));
            console.log("2v2 rank: " + profile.TwoVsTwo.rank + " 2v2 elo: " + parseInt(profile.TwoVsTwo.score));
            const string = "user: " + wbname;
            const string1 = "1v1 rank: " + profile.OneVsOne.rank + " 1v1 elo: " + parseInt(profile.OneVsOne.score);
            const string2 = "2v2 rank: " + profile.TwoVsTwo.rank + " 2v2 elo: " + parseInt(profile.TwoVsTwo.score);
            const output = string + "\n" + string1 + "\n" + string2;
            await interaction.editReply(output);
        } else {
            // Check if the user has already registered their Warner Bros. in-game name
            fs.readFile(process.env.userspath, async (err, data) => {
                if (err) throw err;
                const users = JSON.parse(data);
                const user = users[interaction.member.id];
                if (user) {
                    const user_id = user.warnerBrosId;
                    const username = user.warnerBrosName;
                    const profile = await getUserLeaderboard(user_id);
                    console.log("1v1 rank: " + profile.OneVsOne.rank + " elo: " + parseInt(profile.OneVsOne.score));
                    console.log("2v2 rank: " + profile.TwoVsTwo.rank + " elo: " + parseInt(profile.TwoVsTwo.score));
                    const string = "user: " + username;
                    const string1 = "1v1 rank: " + profile.OneVsOne.rank + " elo: " + parseInt(profile.OneVsOne.score);
                    const string2 = "2v2 rank: " + profile.TwoVsTwo.rank + " elo: " + parseInt(profile.TwoVsTwo.score);
                    const output = string + "\n" + string1 + "\n" + string2;
                    return interaction.editReply(output);
                } else {
                    // User has not registered their Warner Bros. in-game name
                    return interaction.editReply('You have not registered your Warner Bros. in-game name. Use the `/register` command to register your in-game name.');
                }
            });
        }

    },
};