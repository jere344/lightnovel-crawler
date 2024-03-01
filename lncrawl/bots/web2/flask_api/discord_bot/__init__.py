from . import config
from . import bot
import threading

if config.DISCORD_BOT_ENABLE:

    # bot.client.run(config.DISCORD_BOT_TOKEN)
    # We need to run the bot in a separate thread
    
    bot_thread = threading.Thread(target=bot.client.run, args=(config.DISCORD_BOT_TOKEN,), daemon=True)
    bot_thread.start()