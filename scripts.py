
# region test json

# from pathlib import Path
# import shutil

# folder = Path("Lightnovels")

# for novel in folder.iterdir():
#     if novel.is_dir():
#         for source in novel.iterdir():
#             has_json_folder = False
#             if source.is_dir() :
#                 for content in source.iterdir():
#                     if content.is_dir() and content.name == "json":
#                         has_json_folder = True
#                         break
#                 if not has_json_folder:
#                     print("Deleting " + str(source))
#                     shutil.rmtree(source)

# for novel in folder.iterdir():
#     if novel.is_dir():
#         has_sources = False
#         for source in novel.iterdir():
#             if source.is_dir():
#                 has_sources = True
#                 break
#         if not has_sources:
#             print("Deleting " + str(novel))
#             shutil.rmtree(novel)
        
# endregion


# region count sources

# sources = {}
# for novel in Path("Lightnovels").iterdir():
#     if novel.is_dir():
#         for source in novel.iterdir():
#             if source.is_dir():
#                 if source.name not in sources:
#                     sources[source.name] = 0
#                 sources[source.name] += 1

# for source in sorted(sources, key=sources.get, reverse=True):
#     print(source + ": " + str(sources[source]))

# endregion

# region test proxy

# from fp.fp import FreeProxy
# import threading
# import time
# proxy = []
 
# def fetch_proxy():
#     print("Fetching proxy")
#     proxy.append(FreeProxy(rand=True, timeout=1, https=True).get())
#     print("Fetched proxy")

# for i in range(100):
#     threading.Thread(target=fetch_proxy).start()

# with open("proxy.txt", "a") as f:
#     while True:
#         if len(proxy) != 0:
#             f.write(proxy[0] + "\n")
#             proxy.pop(0)
#             print("Wrote proxy")
#         else :
#             time.sleep(1)
#             print("Waiting for proxy")

# with open("proxy.txt", "r") as f:
#     proxy_list = set(f.read().splitlines())

# with open("proxy.txt", "w") as f:
#     for proxy in proxy_list:
#         f.write(proxy + "\n")

# endregion

# region largest source

# from pathlib import Path
# import os

# sources = {}

# for novel in Path("Lightnovels").iterdir():
#     if novel.is_dir():
#         for source in novel.iterdir():
#             if source.is_dir():
#                 # sources[novel.name + "/" + source.name] = shutil.disk_usage(str(source)).total
#                 sources[novel.name + "/" + source.name] = sum(os.path.getsize(f) for f in source.glob('**/*') if os.path.isfile(f))
        
# for source in sorted(sources, key=sources.get, reverse=True):
#     print(source + ": " + str(sources[source]))
    

# endregion


# region set all admin to 4


# import pathlib
# import json

# for novel in pathlib.Path("Lightnovels").iterdir():
#     if novel.is_dir():
#         file = novel / "stats.json"
#         if file.exists():
#             try :
#                 with open(file, "r") as f:
#                     stats = json.load(f)
#                     if stats["ratings"] and stats["ratings"]["-6455068401711230225"]:
#                         del stats["ratings"]["-6455068401711230225"]
#                         stats["ratings"]["admin"] = 4
#                 with open(file, "w") as f:
#                     json.dump(stats, f, indent=4)
#                 print("Set " + str(novel) + " to 4")
#             except KeyError:
#                 print("KeyError: " + str(novel))

                    

# endregion