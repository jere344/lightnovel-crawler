import discord

from . import config



client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


def send_comment(author: str, content: str, url: str):
    if not config.DISCORD_BOT_ENABLE:
        return
    client.loop.create_task(_send_comment(author, content, url))


async def _send_comment(author: str, content: str, url: str):
    channel = client.get_channel(config.COMMENTS_CHANNEL_ID)
    if not channel:
        print("Channel not found")
        return
    print("Sending comment")
    await channel.send(f"**{author}**\n{content}\n[[Comment]({url})]")