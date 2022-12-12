import discord

client = discord.Client()

@client.event
async def on_message(message):
    if message.content.startswith('!hello'):
        await message.channel.send('Hello!')

client.run('YOUR_BOT_TOKEN_HERE')
