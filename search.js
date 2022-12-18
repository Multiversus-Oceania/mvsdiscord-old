const requestdata = require('./requestdata.js');

async function searchbyusername(user) {
    return new Promise(async (resolve, reject) => {
        search = await mvs_client.profiles.search(user);
        const searchlength = search.results.length;
        if (searchlength == 1) {
            const user_id = await mvs_client.profiles.search(user).results[0].result.account_id;
            resolve(user_id);
        }
        else {
            for (i = 0; i < searchlength; i++) {
                const user_id = search.results[i].result.account_id
                account_data = await requestdata.requestData("/accounts/" + user_id, mvs_client.accessToken);
                username = account_data.identity.alternate.wb_network[0].username;
                if (username.toLowerCase() == user.toLowerCase()) {
                    console.log(account_data.identity.alternate.wb_network[0].username);
                    console.log("Match");
                    console.log("WB Username: " + username);
                    console.log("Input user: " + user);
                    resolve(user_id);
                }

            }
        }
    });
}

module.exports.searchbyusername = searchbyusername;