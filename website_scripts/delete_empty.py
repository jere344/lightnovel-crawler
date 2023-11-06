import pathlib

def delete_folder(folder):
    for f in folder.iterdir():
        if f.is_dir():
            delete_folder(f)
        else:
            f.unlink()
    folder.rmdir()

for novel in pathlib.Path("../Lightnovels").iterdir():
    if novel.is_dir():
        # if there are no folders in the novel folder, delete it
        folder = False
        for source in novel.iterdir():
            if source.is_dir():
                folder = True
                break
        if not folder:
            print("Deleting " + str(novel))
            delete_folder(novel)