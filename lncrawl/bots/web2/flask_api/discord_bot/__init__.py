from . import config
from . import bot
import asyncio
import threading

if config.DISCORD_BOT_ENABLE:

    # bot.client.run(config.DISCORD_BOT_TOKEN)
    # We need to run the bot in a separate thread
    
    # bot_thread = threading.Thread(target=bot.client.run, args=(config.DISCORD_BOT_TOKEN,), daemon=True)
    # bot_thread.start()

    # https://stackoverflow.com/questions/62671883/discordbot-using-threading-raise-runtimeerror-set-wakeup-fd-only-works-in-main
    # I'd suggest you to use client.start() in async coroutine instead of client.run() in separate thread.
    loop = asyncio.get_event_loop()
    loop.create_task(bot.client.start(config.DISCORD_BOT_TOKEN))
    threading.Thread(target=loop.run_forever, daemon=True).start()
