const requestdata = require('./requestdata.js');
const characters = require('./characters.js');
const fs = require('fs');
require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

async function getaccountdata(user_id) {
    return new Promise(async (resolve, reject) => {
        const account_data = await requestdata.requestData("/accounts/" + user_id, mvs_client.accessToken);
        resolve(account_data);
    });
}

async function getprofiledata(user_id) {
    return new Promise(async (resolve, reject) => {
        const profile_data = await requestdata.requestData("/profiles/" + user_id, mvs_client.accessToken);
        resolve(profile_data);
    });
}
async function getidfromusername(user) {
    return new Promise(async (resolve, reject) => {
        search = await mvs_client.profiles.search(user);
        const searchlength = search.results.length;
        if (searchlength === 1) {
            const user_id = search.results[0].result.account_id;
            resolve(user_id);
        }
        else {
            for (i = 0; i < searchlength; i++) {
                const user_id = search.results[i].result.account_id
                const account_data = await getaccountdata(user_id);
                console.log(account_data.identity.alternate.wb_network[0]);
                const username = account_data.identity.alternate.wb_network[0].username;
                if (username.toLowerCase() === user.toLowerCase()) {
                    resolve(user_id);
                }
            }
        }
        reject("Couldn't find user");
    });
}

async function getusernamefromid(user_id, platform = 'wb_network') {
    return new Promise(async (resolve, reject) => {
        const account_data = await getaccountdata(user_id);
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
    const profile = await getprofiledata(user_id);
    if (gamemode === "1v1") {
        return characters.slugToDisplay(profile['server_data']['1v1shuffle'][0].topRating.character);
    }
    else if (gamemode === "2v2") {
        return characters.slugToDisplay(profile['server_data']['2v2shuffle'][0].topRating.character);
    }
}

async function formatProfile(profile, wbname, user_id, interaction) {
    return new Promise(async (resolve, reject) => {
        console.log("Executing search for " + wbname);
        const top_1s = await getHighestRatedCharacter(user_id, "1v1");
        const top_2s = await getHighestRatedCharacter(user_id, "2v2");

        // Create an embed object
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Player stats for ${wbname}`)
            .setAuthor({name: "taetae"})
            .setDescription('Here are the player stats:')
            .addFields(
                { name: '1v1', value: `Top character: ${top_1s}\nOverall rank: ${profile.OneVsOne.rank}\nElo: ${parseInt(profile.OneVsOne.score)}`, inline: true },
                { name: '2v2', value: `Top character: ${top_2s}\nOverall rank: ${profile.TwoVsTwo.rank}\nElo: ${parseInt(profile.TwoVsTwo.score)}`, inline: true }
            );
        resolve(embed);
    });
}


module.exports.getaccountdata = getaccountdata;
module.exports.getidfromusername = getidfromusername;
module.exports.getusernamefromid = getusernamefromid;
module.exports.getUserLeaderboard = getUserLeaderboard;
module.exports.getprofiledata = getprofiledata;
module.exports.getHighestRatedCharacter = getHighestRatedCharacter;
module.exports.formatProfile = formatProfile;