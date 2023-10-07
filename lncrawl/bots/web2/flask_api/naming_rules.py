def clean_name(string):
    string = string.strip().lower().replace("’", "'").replace("“", '"').replace("”", '"')
    end_remove = ["novel", "light novel", "web novel", "webnovel", "ln", "wn", "completed"]
    for end in end_remove:
        if string.endswith(end):
            string = string[:-len(end)]
        if string.endswith("(" + end + ")"):
            string = string[:-len(end) - 2]
    return string.strip()