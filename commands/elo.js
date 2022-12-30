const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const mvs = require('mvslib');
const { formatProfile } = require('../createEmbeds');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('elo')
    .setDescription('Returns 1v1 and 2v2 elo of user!')
    .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(false)),
    execute: async function (interaction) {
        await interaction.deferReply();
        const arg1 = interaction.options.getString('user') ?? 'No user provided';
        let wbname, user_id, profile;
        // User is provided
        if (arg1 !== 'No user provided') {
            const username = interaction.options.getString('user');
            user_id = await mvs.Search.getidfromusername(username);
            if (user_id === 'Couldn\'t find user') {
                await interaction.editReply('Couldn\'t find user');
                return;
            }
            wbname = await mvs.Search.getusernamefromid(user_id);
            profile = await mvs.Search.getUserLeaderboard(user_id);
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
                    profile = await mvs.Search.getUserLeaderboard(user_id);
                    await formatProfile(profile, wbname, user_id, interaction);

                } else {
                    // User has not registered their Warner Bros. in-game name
                    return interaction.editReply('You have not registered your Warner Bros. in-game name. Use the `/register` command to register your in-game name.');
                }
            });
        }



    },
};