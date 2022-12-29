// noinspection JSCheckFunctionSignatures
const { SlashCommandBuilder } = require('discord.js');
const { getEmbedFromRankedMatch } = require('../createEmbeds');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lastrankedmatch')
        .setDescription('Retrieves information about the last ranked match played by a user')
        .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(false))
        .addStringOption(option => option.setName('gamemode').setDescription('Gamemode').setRequired(false).setChoices({ name: '1v1', value: '1v1_ranked' }, { name: '2v2', value: '2v2_ranked' })),
    async execute(interaction) {
        // Get the username from the command options
        await interaction.deferReply();
        const embed = await getEmbedFromRankedMatch(interaction);
        // Reply to the user to confirm that their username has been registered
        await interaction.editReply({ embeds: [embed]});
    }};

