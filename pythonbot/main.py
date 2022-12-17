import discord
from discord.ext import commands
import random
from MulpyVersus.mulpyversus.asyncmulpyversus import AsyncMulpyVersus
from MulpyVersus.mulpyversus import utils

description = '''Discord bot for Multiversus Oce https://discord.gg/mvsoce'''
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='?', description=description, intents=intents)

with open('token.txt', 'r') as f:
    discordtoken = f.read()
with open('multiversustoken.txt', 'r') as f:
    multiversustoken = f.read()
    multiversustoken = multiversustoken.replace("\n", "")

async def init():
    mlp = AsyncMulpyVersus(multiversustoken)
    await mlp.init()
    return mlp

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('------')

@bot.command()
async def get2v2elo(ctx, username):
    mlp = await init()
    users = await mlp.get_users_by_username(username)
    user = (await users).get_user_by_number_in_page(1)
    account_id = int((await user).get_account_id(), 16)
    hex_value = hex(account_id)
    elo = await mlp.get_elo_in_gamemode(utils.GamemodeRank.TwoVsTwo, hex_value)
    await ctx.send(elo)
    
@bot.command()
async def get1v1elo(ctx, username):
    mlp = await init()
    user = await mlp.get_users_by_username(username)
    leaderboard = await mlp.get_user_leaderboard_in_gamemode(utils.GamemodeRank.OneVsOne, user.get_account_id())
    await ctx.send(leaderboard.get_score_in_gamemode(utils.GamemodeRank.OneVsOne))

bot.run(discordtoken)

