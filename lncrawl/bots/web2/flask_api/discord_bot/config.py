from pathlib import Path
import json

discord_config_file = Path("lncrawl/bots/web2/flask_api/discord_bot/discord_config.json")
if not discord_config_file.exists():
    with open(discord_config_file, "w", encoding="utf-8") as f:
        json.dump(
            {
                "discord_bot_enable": "false",
                "discord_bot_token": "your bot token",
                "comments_channel_id": "channel id where you want the bot to repost comments",
            }
        )

with open(discord_config_file, "r", encoding="utf-8") as f:
    discord_config = json.load(f)

DISCORD_BOT_ENABLE = discord_config["discord_bot_enable"] == "true"
DISCORD_BOT_TOKEN = discord_config["discord_bot_token"]
try :
    COMMENTS_CHANNEL_ID = int(discord_config["comments_channel_id"])
except :
    COMMENTS_CHANNEL_ID = 0