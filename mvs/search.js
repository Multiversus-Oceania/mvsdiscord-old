const requestdata = require('./requestdata.js');
require('dotenv').config();
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require("fs");
const Characters = require("../mvs/characters");
const Discord = require("discord.js");
const Maps = require("./maps");
const Emotes = Maps.Emotes;
async function getAccountData(user_id) {
    return new Promise(async (resolve, reject) => {
        const account_data = await requestdata.requestData("/accounts/" + user_id, mvs_client.accessToken);
        resolve(account_data);
    });
}

async function getProfileData(user_id) {
    return new Promise(async (resolve, reject) => {
        const profile_data = await requestdata.requestData("/profiles/" + user_id, mvs_client.accessToken);
        resolve(profile_data);
    });
}
async function getidfromusername(user) {
    return new Promise(async (resolve, reject) => {
        const search = await mvs_client.profiles.search(user, limit = 99);
        const searchLength = search.results.length;
        if (searchLength === 1) {
            const user_id = search.results[0].result.account_id;
            resolve(user_id);
        }
        else {
            for (i = 0; i < searchLength; i++) {
                const user_id = search.results[i].result.account_id
                const account_data = await getAccountData(user_id);
                const username = account_data.identity.alternate.wb_network[0].username;
                if (username && username.toLowerCase() === user.toLowerCase()) {
                    resolve(user_id);
                }
            }
        }
        reject("Couldn't find user");
    });
}

async function getusernamefromid(user_id, platform = 'wb_network') {
    return new Promise(async (resolve, reject) => {
        const account_data = await getAccountData(user_id);
        if (platform === 'wb_network') {
            const username = account_data.identity.alternate.wb_network[0].username;
            resolve(username);
        }
        else {
            console.log("account_data: " + account_data);
            console.log("platform: " + platform);
            console.log("account_data.identity.alternate[platform] " + account_data.identity.alternate[platform]);
            const username = account_data.identity.alternate[platform][0].username;
            console.log("username: " + username);
            resolve(username);
        }

    });
}

async function getUserLeaderboard(id, gamemode="both") {
  return new Promise(async (resolve, reject) => {
    if (gamemode === "both") {
      const profile1v1 = await mvs_client.leaderboards.fetchProfile(id, "1v1");
      const profile2v2 = await mvs_client.leaderboards.fetchProfile(id, "2v2");
      resolve({ OneVsOne : {rank: profile1v1.rank, score: profile1v1.score}, TwoVsTwo: {rank: profile2v2.rank, score: profile2v2.score} });
    }
    else {
      const profile = await mvs_client.leaderboards.fetchProfile(id, gamemode);
      if (gamemode === "1v1") {
        resolve({ OneVsOne: {rank: profile.rank, score: profile.score} });
      }
      else if (gamemode === "2v2") {
        resolve({ TwoVsTwo: {rank: profile.rank, score: profile.score}});
    }
  }
  reject("Something went wrong");
});
}

async function getHighestRatedCharacter(user_id, gamemode) {
    const profile = await getProfileData(user_id);
    if (gamemode === "1v1") {
        console.log(profile['server_data']['1v1shuffle'][0].topRating.character);
        return Characters.slugToDisplay(profile['server_data']['1v1shuffle'][0].topRating.character);
    }
    else if (gamemode === "2v2") {
        console.log(profile['server_data']['2v2shuffle'][0].topRating.character);
        return Characters.slugToDisplay(profile['server_data']['2v2shuffle'][0].topRating.character);
    }
}

async function formatProfile(profile, wbname, user_id, interaction) {
    return new Promise(async (resolve, reject) => {
        console.log("Executing search for " + wbname);
        const top_1s = await getHighestRatedCharacter(user_id, "1v1");
        const top_2s = await getHighestRatedCharacter(user_id, "2v2");
        const emote1s = Characters.getEmote(top_1s);
        const emote2s = Characters.getEmote(top_2s);
        // Create an embed object
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Player stats for ${wbname}`)
            .setAuthor({name: "taetae"})
            .addFields(
                { name: `1v1 ${emote1s}`, value: `Top character: ${top_1s}\nOverall rank: ${profile.OneVsOne.rank}\nElo: ${parseInt(profile.OneVsOne.score)}`, inline: true },
                { name: `2v2 ${emote2s}`, value: `Top character: ${top_2s}\nOverall rank: ${profile.TwoVsTwo.rank}\nElo: ${parseInt(profile.TwoVsTwo.score)}`, inline: true }
            )
        await interaction.editReply({ embeds: [embed]});
        resolve(embed);
    });
}

async function getLastMatch(user_id, gamemode="any") {
    return new Promise(async (resolve, reject) => {
        console.log(user_id);
        const matches = (await mvs_client.matches.fetchAll(user_id, limit = 1)).matches;
        const last_match = await getLastCompletedMatch(matches, gamemode);
        resolve(last_match);
    });
}

async function getLastRankedMatch(user_id, gamemode="any") {
    return new Promise(async (resolve, reject) => {
        console.log(user_id);
        const matches = (await mvs_client.matches.fetchAll(user_id, limit = 1)).matches;
        const last_match = await getLastCompletedRankedMatch(matches, gamemode);
        resolve(last_match);
    });
}
async function getLastCompletedMatch(matches, gamemode = "any") {
    return new Promise(async (resolve, reject) => {
        if (gamemode === "any") {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete") {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData) {
                        resolve(match);
                    }
                }
            }
        } else {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && matches[i].template.name === gamemode) {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData) {
                        resolve(match);
                    }
                }

            }
        }
    });
}

async function getLastCompletedRankedMatch(matches, gamemode = "any") {
    return new Promise(async (resolve, reject) => {
        if (gamemode === "any") {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete") {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData && match.server_data.match_config.QueueType === "Ranked") {
                        resolve(match);
                    }
                }
            }
        } else {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && matches[i].template.name === gamemode && match.server_data.match_config.QueueType === "Ranked") {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData) {
                        resolve(match);
                    }
                }

            }
        }
    });
}



async function getUserInfo(interaction) {
    return new Promise(async (resolve, reject) => {
        const arg1 = interaction.options.getString('user') ?? 'No user provided';
        if (arg1 !== 'No user provided') {
            const username = interaction.options.getString('user');
            const user_id = await getidfromusername(username);
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
    const last_match = await getLastMatch(user_id, game_mode);
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
        const character = Characters.getEmote(Characters.slugToDisplay(characterSlug));
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
        .setTitle(`Last Match (Unranked) : ${map} - ${mode} ${Emotes[mode]}`)
        .addFields({ name: "Match Results", value: `${winners === 0 ? `Blue Team` : `Red Team`} won ${team_scores[0]} - ${team_scores[1]}`}, { name: `${winners === 0 ? `Blue Team ${Emotes["Win"]}` : `Blue Team`}`, value: teamPlayers[0].map(p => { let value = `${p.playerName} ${p.character}
Player Rating: ${parseInt(p.playerRating, 10)}${p.playerRatingChange.toFixed(1) > 0 ? " (+" : p.playerRatingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.playerRatingChange.toFixed(1))})
Character Rating: ${parseInt(p.characterRating, 10)}${p.ratingChange.toFixed(1) > 0 ? " (+" : p.ratingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.ratingChange.toFixed(1))})
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true }, { name: `${winners === 1 ? `Red Team ${Emotes["Win"]}` : `Red Team`}`, value: teamPlayers[1].map(p => { let value = `${p.playerName} ${p.character}
Player Rating: ${parseInt(p.playerRating, 10)}${p.playerRatingChange.toFixed(1) > 0 ? " (+" : p.playerRatingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.playerRatingChange.toFixed(1))})
Character Rating: ${parseInt(p.characterRating, 10)}${p.ratingChange.toFixed(1) > 0 ? " (+" : p.ratingChange.toFixed(1) < 0 ? " (-" : ""}${Math.abs(p.ratingChange.toFixed(1))})
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true });

    return embed;
}

async function getEmbedFromRankedMatch(interaction) {
    const user_info = await getUserInfo(interaction);
    const user_id = user_info.user_id;

    const game_mode = interaction.options.getString('gamemode') ?? 'any';
    // Retrieve the last match
    const last_match = await getLastRankedMatch(user_id, game_mode);
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
        const user_profile = await getProfileData(user_id);
        const teamIndex = players[i].TeamIndex;
        const playerName = players[i].Username;
        const characterSlug = players[i].CharacterSlug;
        const character = Characters.getEmote(Characters.slugToDisplay(characterSlug));
        const damageDone = players[i].DamageDone;
        const ringouts = players[i].Ringouts;
        const deaths = players[i].Deaths;
        const ranked_rating = user_profile.server_data[gamemode_string][1].rank.current_points;

        teamPlayers[teamIndex].push({ playerName, ranked_rating, character, characterSlug, damageDone, ringouts, deaths });
    }

    const ringoutLeader = teamPlayers[0].concat(teamPlayers[1]).sort((a, b) => b.ringouts - a.ringouts)[0] || { playerName: "None" };
    // Create a new Discord embed
    const embed = new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Last Match (Ranked): ${map} - ${mode} ${Emotes[mode]}`)
        .addFields({ name: "Match Results", value: `${winners === 0 ? `Blue Team` : `Red Team`} won ${team_scores[0]} - ${team_scores[1]}`}, { name: `${winners === 0 ? `Blue Team ${Emotes["Win"]}` : `Blue Team`}`, value: teamPlayers[0].map(p => { let value = `${p.playerName} ${p.character}
Updated Ranked Rating: ${parseInt(p.ranked_rating, 10)}
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true }, { name: `${winners === 1 ? `Red Team ${Emotes["Win"]}` : `Red Team`}`, value: teamPlayers[1].map(p => { let value = `${p.playerName} ${p.character}
Updated Ranked Rating: ${parseInt(p.ranked_rating, 10)}
Damage Done: ${p.damageDone}
Ringouts: ${p.ringouts}
Deaths: ${p.deaths}`; if (p === ringoutLeader) value = `${Emotes["RingoutLeader"]} ${value}`; if (p.damageDone >= 400) value = `${Emotes["Damage"]} ${value}`;
                return value;
            }).join("\n\n"), inline: true });

    return embed;
}





module.exports.getAccountData = getAccountData;
module.exports.getidfromusername = getidfromusername;
module.exports.getusernamefromid = getusernamefromid;
module.exports.getUserLeaderboard = getUserLeaderboard;
module.exports.getProfileData = getProfileData;
module.exports.getHighestRatedCharacter = getHighestRatedCharacter;
module.exports.formatProfile = formatProfile;
module.exports.getLastMatch = getLastMatch;
module.exports.getUserInfo = getUserInfo;
module.exports.getEmbedFromCasualMatch = getEmbedFromCasualMatch;
module.exports.getLastRankedMatch = getLastRankedMatch;
module.exports.getEmbedFromRankedMatch = getEmbedFromRankedMatch;