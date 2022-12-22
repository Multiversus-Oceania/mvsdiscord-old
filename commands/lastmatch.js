// noinspection JSCheckFunctionSignatures

const { SlashCommandBuilder } = require('discord.js');
const Search = require('../mvs/search.js')
const fs = require("fs");
const Characters = require("../mvs/characters");
const Discord = require("discord.js");
const Maps = require("../mvs/maps");
const Emotes = Maps.Emotes;
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
        const embed = await Search.getEmbedFromCasualMatch(interaction);
        // Reply to the user to confirm that their username has been registered
        await interaction.editReply({ embeds: [embed]});
    }};

