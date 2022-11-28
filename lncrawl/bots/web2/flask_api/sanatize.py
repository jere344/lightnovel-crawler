import unicodedata


def sanitize(text: str) -> str:
    """
    Remove all special characters from a string, replace accentuated characters with their
    non-accentuated counterparts, and remove all non-alphanumeric characters.
    """
    text = text.replace("\n", " ").replace("\r", " ").replace("\t", " ").replace("-", " ").replace("_", " ").upper().strip()
    text = unicodedata.normalize("NFKD", text)
    return "".join([c for c in text if not unicodedata.combining(c)])


def pathify(text: str) -> str:
    """
    Make a string safe to use as a filename.
    """
    text = sanitize(text)
    illegal_chars = r'<>:"/\|?*'
    for char in illegal_chars:
        text = text.replace(char, "_")
    return text
