const { SlashCommandBuilder } = require('discord.js');
const { getidfromusername, getusernamefromid, getUserLeaderboard, formatProfile } = require('../search.js');
const fs = require('fs');
const {getHighestRatedCharacter} = require("../search");
require('dotenv').config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName('elo')
    .setDescription('Returns 1v1 and 2v2 elo of user!')
    .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(false)),
    execute: async function (interaction) {
        await interaction.deferReply();
        let username;
        const arg1 = interaction.options.getString('user') ?? 'No user provided';
        let wbname, user_id, profile;
        // User is provided
        if (arg1 !== 'No user provided') {
            const username = interaction.options.getString('user');
            user_id = await getidfromusername(username);
            if (user_id === 'Couldn\'t find user') {
                await interaction.editReply('Couldn\'t find user');
                return;
            }
            wbname = await getusernamefromid(user_id);
            profile = await getUserLeaderboard(user_id);
            await formatProfile(profile, wbname, user_id, interaction);
        }
        // User not provided
        else {
            // Check if the user has already registered their Warner Bros. in-game name
            fs.readFile(process.env.userspath, async (err, data) => {
                if (err) throw err;
                const users = JSON.parse(data);
                const user = users[interaction.member.id];
                if (user) {
                    user_id = user.warnerBrosId;
                    wbname = user.warnerBrosName;
                    profile = await getUserLeaderboard(user_id);
                    await formatProfile(profile, wbname, user_id, interaction);

                } else {
                    // User has not registered their Warner Bros. in-game name
                    return interaction.editReply('You have not registered your Warner Bros. in-game name. Use the `/register` command to register your in-game name.');
                }
            });
        }



    },
};