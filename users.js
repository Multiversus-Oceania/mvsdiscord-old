const fs = require('fs');

class User {
  constructor(discordId, warnerBrosName, warnerBrosId) {
    this.discordId = discordId;
    this.warnerBrosName = warnerBrosName;
    this.warnerBrosId = warnerBrosId;
  }
}

function addUserToJSONFile(user) {
  fs.readFile('/data/users.json', (err, data) => {
    let users = {};
    if (!err) {
      users = JSON.parse(data);
    }
    if (users[user.discordId]) {
      console.log(`User with Discord ID ${user.discordId} is already registered`);
      return;
    }

    users[user.discordId] = user;

    fs.writeFile('/data/users.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log(`User with Discord ID ${user.discordId} was added to the JSON file`);
    });
  });
}

// function that removes a user from the JSON file
function removeUserFromJSONFile(discordId) {
    fs.readFile('/data/users.json', (err, data) => {
        if (err) throw err;

        let users = JSON.parse(data);
        if (!users[discordId]) {
        console.log(`User with Discord ID ${discordId} is not registered`);
        return;
        }

        delete users[discordId];

        fs.writeFile('/data/users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        console.log(`User with Discord ID ${discordId} was removed from the JSON file`);
        });
    });
}


module.exports.User = User;
module.exports.addUserToJSONFile = addUserToJSONFile;
module.exports.removeUserFromJSONFile = removeUserFromJSONFile;