import discord

from . import config



client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


def send_comment(author: str, content: str, url: str, novel_title: str):
    if not config.DISCORD_BOT_ENABLE:
        return
    if config.COMMENTS_CHANNEL_ID == 0:
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
        await channel.send(f"**__{author}__** commented on [{novel_title}](<{url}>) chapter **{chapter}**\n{content}\n")
    else :
        await channel.send(f"**__{author}__** commented on [{novel_title}](<{url}>)\n{content}\n")

def send_release(novel_title: str, novel_url: str,  chapter: str, chapter_url: str):
    if not config.DISCORD_BOT_ENABLE:
        return
    if config.RELEASES_CHANNEL_ID == 0:
        return
    client.loop.create_task(_send_release(novel_title, novel_url, chapter, chapter_url))

async def _send_release(novel_title: str, novel_url: str,  chapter: str, chapter_url: str):
    channel = client.get_channel(config.RELEASES_CHANNEL_ID)
    if not channel:
        print("Channel not found")
        return
    print("Sending release")
    if not chapter.lower().startswith("chapter"):
        chapter = f"Chapter {chapter}"
    await channel.send(f"[{novel_title}](<{novel_url}>) has released {chapter}   [[Read it here](<{chapter_url}>)]")