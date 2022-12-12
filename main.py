import discord
from discord.ext import commands

# Create a new bot instance
bot = commands.Bot(command_prefix='!', intents=discord.Intents.default(), privileged_intents=discord.Intents.all())

# Define the hello command
@bot.command()
async def hello(ctx):
    await ctx.send('Hello!')

# Use the token to authenticate the bot
with open('token.txt') as f:
    token = f.read()
bot.run(token)
