const fs = require('fs');

class User {
  constructor(discordId, warnerBrosName, warnerBrosId) {
    this.discordId = discordId;
    this.warnerBrosName = warnerBrosName;
    this.warnerBrosId = warnerBrosId;
  }
}

function addUserToJSONFile(user) {
  fs.readFile('users.json', (err, data) => {
    let users = {};
    if (!err) {
      users = JSON.parse(data);
    }
    if (users[user.discordId]) {
      console.log(`User with Discord ID ${user.discordId} is already registered`);
      return;
    }

    users[user.discordId] = user;

    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log(`User with Discord ID ${user.discordId} was added to the JSON file`);
    });
  });
}

module.exports.User = User;
module.exports.addUserToJSONFile = addUserToJSONFile;