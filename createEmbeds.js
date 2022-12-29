const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require("fs");
const Discord = require("discord.js");
const mvs = require('mvslib');
async function getUserInfo(interaction) {
    return new Promise(async (resolve, reject) => {
        const arg1 = interaction.options.getString('user') ?? 'No user provided';
        if (arg1 !== 'No user provided') {
            const username = interaction.options.getString('user');
            const user_id = await mvs.Search.getidfromusername(username);
            resolve({username: username, user_id: user_id});
            if (user_id === 'Couldn\'t find user') {
                reject('Couldn\'t find user');
            }
        } else {
            // check users.json
            fs.readFile(process.env.userspath, async (err, data) => {
                if (err) throw err;
                const users = JSON.parse(data);
                const user = users[interaction.member.id];
                if (user) {
                    const user_id = user.warnerBrosId;
                    const username = user.warnerBrosName;
                    resolve({username: username, user_id: user_id});
                } else {
                    // User has not registered their Warner Bros. in-game name
                    reject('You have not registered your Warner Bros. in-game name. Use the `/register` command to register your in-game name.');
                }
            });
        }
    });
}

async function getEmbedFromCasualMatch(interaction) {
    const user_info = await getUserInfo(interaction);
    const user_id = user_info.user_id;
    const game_mode = interaction.options.getString('gamemode') ?? 'any';
    // Retrieve the last match
    let error;
    const last_match = await mvs.Search.getLastMatch(user_id).catch((err) => {
        console.log("Error:", err);
        error = err;
    });
    if (!last_match) {
        return errorEmbed(error);
    }
    // Get information about the last match
    const server_data = last_match.server_data;
    const map = server_data.MapName;
    const players = server_data.PlayerData;
    const character_rating_changes = last_match.data.ratingUpdates.player_rating_changes;
    const player_rating_changes = last_match.data.ratingUpdates.general_rating_changes;
    const winners = server_data.WinningTeamId;
    const mode = last_match.template.name;
    const team_scores = server_data.TeamScores;


    // Create an array to hold the player information for each team
    const teamPlayers = [[], []];

    // Organize the player information by team
    for (let i = 0; i < players.length; i++) {
        const teamIndex = players[i].TeamIndex;
        const playerName = players[i].Username;
        const characterSlug = players[i].CharacterSlug;
        const character = mvs.Characters.getEmote(mvs.Characters.slugToDisplay(characterSlug));
        const damageDone = players[i].DamageDone;
        const ringouts = players[i].Ringouts;
        const deaths = players[i].Deaths;
        const ratingChange = character_rating_changes[i].post_match_rating.mean - character_rating_changes[i].pre_match_rating.mean;
        const playerRatingChange = player_rating_changes[i].post_match_rating.mean - player_rating_changes[i].pre_match_rating.mean;
        const characterRating = character_rating_changes[i].post_match_rating.mean;
        const playerRating = player_rating_changes[i].post_match_rating.mean;
        teamPlayers[teamIndex].push({ playerName, playerRating, playerRatingChange, character, characterSlug, characterRating, ratingChange, damageDone, ringouts, deaths });
    }

    const ringoutLeader = teamPlayers[0].concat(teamPlayers[1]).sort((a, b) => b.ringouts - a.ringouts)[0] || { playerName: "None" };
    // Create a new Discord embed
    const embed = new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Last Match (Unranked) : ${map} - ${mode} ${mvs.Maps.Emotes[mode]}`)
        .addFields({ name: "Match Results", value: `${winners === 0 ? `Blue Team` : `Red Team`} won ${team_scores[0]} - ${team_scores[1]}`}, { name: `${winners === 0 ? `Blue Team ${mvs.Maps.Emotes["Win"]}` : `Blue Team`}`, value: teamPlayers[0].map(p => { let value = `${p.playerName} ${p.character}
Player Rating: ${parseInt(p.playerRating, 10)}${p.playerRatingChange.toFixed(1) > 0 ? " (+" : p.playerRatingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.playerRatingChange.toFixed(1))})
Character Rating: ${parseInt(p.characterRating, 10)}${p.ratingChange.toFixed(1) > 0 ? " (+" : p.ratingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.ratingChange.toFixed(1))})
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true }, { name: `${winners === 1 ? `Red Team ${mvs.Maps.Emotes["Win"]}` : `Red Team`}`, value: teamPlayers[1].map(p => { let value = `${p.playerName} ${p.character}
Player Rating: ${parseInt(p.playerRating, 10)}${p.playerRatingChange.toFixed(1) > 0 ? " (+" : p.playerRatingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.playerRatingChange.toFixed(1))})
Character Rating: ${parseInt(p.characterRating, 10)}${p.ratingChange.toFixed(1) > 0 ? " (+" : p.ratingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.ratingChange.toFixed(1))})
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${mvs.Maps.Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${mvs.Maps.Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true });

    return embed;
}

async function getEmbedFromRankedMatch(interaction) {
    const user_info = await getUserInfo(interaction);
    const user_id = user_info.user_id;

    const game_mode = interaction.options.getString('gamemode') ?? 'any';
    // Retrieve the last match
    let error;
    const last_match = await mvs.Search.getLastRankedMatch(user_id).catch((err) => {
        console.log("Error:", err);
        error = err;
    });
    if (!last_match) {
        return errorEmbed(error);
    }
    // Get information about the last match
    const server_data = last_match.server_data;
    const map = server_data.MapName;
    const players = server_data.PlayerData;
    const winners = server_data.WinningTeamId;
    const mode = last_match.template.name;
    const gamemode_string = mode.concat('_ranked');
    const team_scores = server_data.TeamScores;



    // Create an array to hold the player information for each team
    const teamPlayers = [[], []];

    // Organize the player information by team
    for (let i = 0; i < players.length; i++) {


        const teamIndex = players[i].TeamIndex;
        const playerName = players[i].Username;
        const current_user_id = await getidfromusername(playerName);
        const current_user_profile = await getProfileData(current_user_id);
        const characterSlug = players[i].CharacterSlug;
        const character = mvs.Characters.getEmote(mvs.Characters.slugToDisplay(characterSlug));
        const damageDone = players[i].DamageDone;
        const ringouts = players[i].Ringouts;
        const deaths = players[i].Deaths;
        const ranked_rating = current_user_profile.server_data[gamemode_string][1].rank.current_points;

        teamPlayers[teamIndex].push({ playerName, ranked_rating, character, characterSlug, damageDone, ringouts, deaths });
    }

    const ringoutLeader = teamPlayers[0].concat(teamPlayers[1]).sort((a, b) => b.ringouts - a.ringouts)[0] || { playerName: "None" };
    // Create a new Discord embed
    const embed = new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Last Match (Ranked): ${map} - ${mode} ${mvs.Maps.Emotes[mode]}`)
        .addFields({ name: "Match Results", value: `${winners === 0 ? `Blue Team` : `Red Team`} won ${team_scores[0]} - ${team_scores[1]}`}, { name: `${winners === 0 ? `Blue Team ${Emotes["Win"]}` : `Blue Team`}`, value: teamPlayers[0].map(p => { let value = `${p.playerName} ${p.character}
Updated Ranked Rating: ${parseInt(p.ranked_rating, 10)}
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${mvs.Maps.Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${mvs.Maps.Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true }, { name: `${winners === 1 ? `Red Team ${Emotes["Win"]}` : `Red Team`}`, value: teamPlayers[1].map(p => { let value = `${p.playerName} ${p.character}
Updated Ranked Rating: ${parseInt(p.ranked_rating, 10)}
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${mvs.Maps.Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${mvs.Maps.Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true });

    return embed;
}

function errorEmbed(error) {
    return new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Error`)
        .setDescription(error);
}

async function formatProfile(profile, wbname, user_id, interaction) {
    return new Promise(async (resolve, reject) => {
        console.log("Executing search for " + wbname);
        const top_1s = await mvs.Search.getHighestRatedCharacter(user_id, "1v1");
        const top_2s = await mvs.Search.getHighestRatedCharacter(user_id, "2v2");
        const emote1s = mvs.Characters.getEmote(top_1s);
        const emote2s = mvs.Characters.getEmote(top_2s);
        const user_profile = await mvs.Search.getProfileData(user_id);
        const ranked_rating1 = user_profile.server_data["1v1_ranked"][1].rank.current_points;
        const ranked_rating2 = user_profile.server_data["2v2_ranked"][1].rank.current_points;
        // Create an embed object
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Player stats for ${wbname}`)
            .setAuthor({name: "taetae"})
            .addFields(
                { name: `**1v1** ${emote1s}`, value: `Ranked Rating: ${ranked_rating1}\nTop character: ${top_1s}\nOverall rank (Unranked): ${profile.OneVsOne.rank}\nElo (Unranked): ${parseInt(profile.OneVsOne.score)}`, inline: true },
                { name: `**2v2** ${emote2s}`, value: `Ranked Rating: ${ranked_rating2}\nTop character: ${top_2s}\nOverall rank (Unranked): ${profile.TwoVsTwo.rank}\nElo (Unranked): ${parseInt(profile.TwoVsTwo.score)}`, inline: true }
            )
        await interaction.editReply({ embeds: [embed]});
        resolve(embed);
    });
}


module.exports.getUserInfo = getUserInfo;
module.exports.getEmbedFromCasualMatch = getEmbedFromCasualMatch;
module.exports.getEmbedFromRankedMatch = getEmbedFromRankedMatch;
module.exports.errorEmbed = errorEmbed;
module.exports.formatProfile = formatProfile;