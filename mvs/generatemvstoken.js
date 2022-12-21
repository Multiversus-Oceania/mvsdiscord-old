const http = require("https");

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      hostname: "dokken-api.wbagora.com",
      path: "/access",
      headers: {
        "x-hydra-api-key": "51586fdcbd214feb84b0e475b130fce0",
        "x-hydra-user-agent": "Hydra-Cpp/1.132.0",
        "Content-Type": "application/json",
        "x-hydra-client-id": "47201f31-a35f-498a-ae5b-e9915ecb411e",
        Accept: "*/*",
      },
    };

    const req = http.request(options, function (res) {
      const chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = JSON.parse(Buffer.concat(chunks));
        const access_token = body.token;
        resolve(access_token);
      });
    });

    req.write(
      JSON.stringify({
        auth: {
          fail_on_missing: 1,
          steam: process.env.MULTIVERSUS_TOKEN,
        },
        options: ["wb_network"],
      }),
    );
    req.end();
  });
}
module.exports.getAccessToken = getAccessToken;