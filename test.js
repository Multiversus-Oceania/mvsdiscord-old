require('dotenv').config();
const { getidfromusername, getusernamefromid } = require('./search.js');
const { Client } = require('multiversus.js');
const generatemvstoken = require('./generatemvstoken.js');
const mvs_client = new Client({accessToken: generatemvstoken.getAccessToken()});
console.log("test");
(async () => {
    const user_id = await getidfromusername("ttvtaetaemvs");
    console.log("user_id: " + user_id);
    const username = getusernamefromid(user_id);
    console.log("username: " + username);
    const profile = mvs_client.leaderboards.fetchProfile(user_id, '2v2');
    console.log("profile: " + profile);
    console.log("profile.score" + profile.score);

}
);