require('dotenv').config();
const { Client } = require('multiversus.js');
const fs = require('node:fs');
const path = require('node:path');
const generatemvstoken = require('./generatemvstoken.js');
const { getidfromusername, getusernamefromid, getUserLeaderboard } = require('./search.js');
(async () => {
    const mvstoken = await generatemvstoken.getAccessToken();
	const str_token = JSON.stringify(mvstoken);
	mvs_client = new Client({accessToken: str_token});
    const user_id = await getidfromusername("ttvtaetaemvs");
    console.log("user_id: " + user_id);
    const username = await getusernamefromid(user_id);
    const userLeaderboard = await getUserLeaderboard(user_id);
    console.log(userLeaderboard.OneVsOne.rank);
    console.log(userLeaderboard.OneVsOne.score);
    console.log(userLeaderboard.TwoVsTwo.rank);
    console.log(userLeaderboard.TwoVsTwo.score);
})();