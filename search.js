const requestdata = require('./requestdata.js');
async function getaccountdata(user_id) {
    return new Promise(async (resolve, reject) => {
        const account_data = await requestdata.requestData("/accounts/" + user_id, mvs_client.accessToken);
        resolve(account_data);
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

module.exports.getaccountdata = getaccountdata;
module.exports.getidfromusername = getidfromusername;
module.exports.getusernamefromid = getusernamefromid;