import discord

from . import config



client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


def send_comment(author: str, content: str, url: str, novel_title: str):
    if not config.DISCORD_BOT_ENABLE:
        return
    client.loop.create_task(_send_comment(author, content, url, novel_title))


async def _send_comment(author: str, content: str, url: str, novel_title: str):
    channel = client.get_channel(config.COMMENTS_CHANNEL_ID)
    if not channel:
        print("Channel not found")
        return
    print("Sending comment")
    if "chapter-" in url:
        chapter = url.split("chapter-")[-1].split("/")[0]
        await channel.send(f"**__{author}__** commented on [{novel_title}]({url}) chapter **{chapter}**\n{content}\n")
    else :
        await channel.send(f"**__{author}__** commented on [{novel_title}]({url})\n{content}\n")