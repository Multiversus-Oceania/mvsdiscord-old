# MVSOCE Discord Bot
https://discord.gg/mvsoce


# TO USE
You will need to create a .env file in the root directory of this repository containing the following variables:

TOKEN=Your discord bot token
  
MULTIVERSUS_TOKEN=Multiversus API token
  
CLIENTID=Discord bot Client ID
  
GUILDID=Discord server you are testing on
  
userspath=path to users.json file
  
  
You will also need to create an empty users.json file. You can change the path to it, for example if you want to keep it on a mounted volume on deploy. 

Then run node deploy-commands to deploy slash commands.

Then run node . and your bot should be up and running!
