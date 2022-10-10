supported_bots = [
    "console",
    "telegram",
    "discord",
    "web2",
    "lookup",
]


def run_bot(bot):
    if bot not in supported_bots:
        bot = "console"
    if bot == "console":
        from ..bots.console import ConsoleBot

        ConsoleBot().start()
    elif bot == "telegram":
        from ..bots.telegram import TelegramBot

        TelegramBot().start()
    elif bot == "discord":
        from ..bots.discord import DiscordBot

        DiscordBot().start_bot()
    elif bot == "lookup":
        from ..bots.lookup import LookupBot

        LookupBot().start()
        
    elif bot == "web2":
        from . import web2

        web2.start()
    else:
        print("Unknown bot: %s" % bot)
