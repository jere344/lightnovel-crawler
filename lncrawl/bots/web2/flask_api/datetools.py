import datetime


def current_week() -> str:
    """Return the current week number since 2000-01-01"""
    date = datetime.datetime.now()
    year, week_num, _ = date.isocalendar()
    week = (year - 2000) * 52 + week_num
    return str(week)

def utc_str_date() -> str:
    """Return the current date in UTC as a string"""
    return datetime.datetime.utcnow().isoformat()