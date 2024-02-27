import subprocess

command = "python3 lncrawl --bot web2"  # --auto-proxy"
while True:
    p = subprocess.Popen(command, shell=True).wait()

    if p != 0:
        continue
    else:
        break
