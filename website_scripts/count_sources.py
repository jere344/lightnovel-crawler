from pathlib import Path

sources = {}
for novel in Path("../Lightnovels").iterdir():
    if novel.is_dir():
        for source in novel.iterdir():
            if source.is_dir():
                if source.name not in sources:
                    sources[source.name] = 0
                sources[source.name] += 1

for source in sorted(sources, key=sources.get, reverse=True):
    print(source + ": " + str(sources[source]))
