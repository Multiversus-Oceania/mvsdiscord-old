import discord, os

client = discord.Client(intents=discord.Intents.default())
token = os.environ['DISCORD_BOT_TOKEN']

@client.event
async def on_message(message):
    if message.content.startswith('!hello'):
        await message.channel.send('Hello!')

client.run(token)

