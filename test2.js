require('dotenv').config();
const { Client } = require('multiversus.js');
const fs = require('node:fs');
const path = require('node:path');
const generatemvstoken = require('./generatemvstoken.js');
const { getidfromusername, getusernamefromid, getUserLeaderboard } = require('./search.js');
const { getaccountdata, getprofiledata, getHighestRatedCharacter } = require("./search");
(async () => {
    const mvstoken = await generatemvstoken.getAccessToken();
	mvs_client = new Client({accessToken: mvstoken});
    const user_id = await getidfromusername("ttvtaetaemvs");
    console.log("user_id: " + user_id);
    const username = await getusernamefromid(user_id);
    console.log("username: " + username);
    const top_1s = await getHighestRatedCharacter(user_id, "1v1");
    console.log("top 1s char: " + top_1s);
    const top_2s = await getHighestRatedCharacter(user_id, "2v2");
    console.log("top 2s char: " + top_2s);
})();