import datetime
def current_week():
    """Return the current week number since 2000-01-01"""
    date = datetime.datetime.now()
    year, week_num, _ = date.isocalendar()
    week = (year - 2000) * 52 + week_num
    return week
    