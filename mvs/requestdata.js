const https = require('https');
const generatemvstoken = require('./generatemvstoken.js');
async function requestData(rqst, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "dokken-api.wbagora.com",
            path: rqst,
            headers: {
                'x-hydra-api-key': '51586fdcbd214feb84b0e475b130fce0',
                'x-hydra-user-agent': 'Hydra-Cpp/1.132.0',
                'Content-Type': 'application/json',
                'x-hydra-access-token': token
            }
        };

        https.get(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', async () => {
                if (res.statusCode === 200) {
                    if (body.includes("msg") && body.includes("User session")) {
                        token = await generatemvstoken.getAccessToken();
                        requestData(rqst, token);
                    } else {
                        load = JSON.parse(body);
                        resolve(load);
                    }
                }
            });
        }).on('error', (error) => {
            console.error(error);
        });
    });
}

module.exports.requestData = requestData;