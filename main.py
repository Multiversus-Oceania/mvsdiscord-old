import discord
from discord.ext import commands
import random
from mulpyversus.mulpyversus import MulpyVersus
from mulpyversus.leaderboards import *
description = '''An example bot to showcase the discord.ext.commands extension
module.
There are a number of utility commands being showcased here.'''

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='?', description=description, intents=intents)

with open('token.txt', 'r') as f:
    discordtoken = f.read()
with open('multiversustoken.txt', 'r') as f:
    multiversustoken = f.read()
    multiversustoken = multiversustoken.replace("\n", "")

mlp = MulpyVersus(multiversustoken)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('------')

@bot.command()
async def get2v2elo(ctx, username):
    user = mlp.get_user_by_username(username)
    leaderboard = mlp.get_user_leaderboard(user.get_account_id())
    await ctx.send(int(leaderboard.get_score_in_gamemode(GamemodeRank.TwoVsTwo)))
    
@bot.command()
async def get1v1elo(ctx, username):
    user = mlp.get_user_by_username(username)
    leaderboard = mlp.get_user_leaderboard(user.get_account_id())
    await ctx.send(int(leaderboard.get_score_in_gamemode(GamemodeRank.OneVsOne)))  

bot.run(discordtoken)
