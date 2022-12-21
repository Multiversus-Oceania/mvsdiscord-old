const requestdata = require('./requestdata.js');
const Characters = require('./characters.js');
const fs = require('fs');
require('dotenv').config();
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

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
        const last_match_id = last_match.id;
        const match = await mvs_client.matches.fetch(last_match_id);
        resolve(match);
    });
}

async function getLastCompletedMatch(matches, gamemode = "any") {
    return new Promise(async (resolve, reject) => {
        if (gamemode === "any") {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && !matches[i].server_data.IsCustomMatch) {
                    resolve(matches[i]);
                }
            }
        } else {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && matches[i].template.name === gamemode && !matches[i].server_data.IsCustomMatch) {
                    resolve(matches[i]);
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







module.exports.getAccountData = getAccountData;
module.exports.getidfromusername = getidfromusername;
module.exports.getusernamefromid = getusernamefromid;
module.exports.getUserLeaderboard = getUserLeaderboard;
module.exports.getProfileData = getProfileData;
module.exports.getHighestRatedCharacter = getHighestRatedCharacter;
module.exports.formatProfile = formatProfile;
module.exports.getLastMatch = getLastMatch;
module.exports.getUserInfo = getUserInfo;