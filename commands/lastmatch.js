const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const mvs = require('mvslib');
const { getEmbedFromCasualMatch } = require('../createEmbeds');
require('dotenv').config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lastmatch')
        .setDescription('Retrieves information about the last match played by a user')
        .addStringOption(option => option.setName('user').setDescription('WB Username').setRequired(false))
        .addStringOption(option => option.setName('gamemode').setDescription('Gamemode').setRequired(false).setChoices({ name: '1v1', value: '1v1' }, { name: '2v2', value: '2v2' })),
    async execute(interaction) {
        // Get the username from the command options
        await interaction.deferReply();
        const embed = await getEmbedFromCasualMatch(interaction);
        // Reply to the user to confirm that their username has been registered
        await interaction.editReply({ embeds: [embed]});
    }};

