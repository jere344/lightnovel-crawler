import msgspec
from typing import Optional

# region new struct :

class Chapter(msgspec.Struct):
    id:int
    url:str
    title:str
    volume:int
    volume_title:str
    success:Optional[bool] = None
    images:Optional[dict] = {}
    body: Optional[str] = None

class Volume(msgspec.Struct):
    id:int
    title:str
    start_chapter:int
    final_chapter:int
    chapter_count:int

class MetaNovel(msgspec.Struct):
    url:str
    title:str
    authors:list[str]
    cover_url:str
    chapters:list[Chapter]
    volumes:list[Volume]
    is_rtl:bool
    language:str
    has_manga:Optional[bool]
    has_mtl:Optional[bool]
    language_code:list[str]
    source:Optional[str]
    editors:list[str]
    translators:list[str]
    status:str
    genres:list[str]
    description:Optional[str]
    original_publisher:Optional[str]
    english_publisher:Optional[str]
    novelupdates_url:Optional[str]

    # for backward compatibility :
    # New :
    synopsis:Optional[str] # no default because it was also in the old one (but always empty)
    novel_tags:Optional[list[str]] = None

    # Old :
    summary:Optional[str] = None
    tags:Optional[list[str]] = None
    
class Session(msgspec.Struct):
    user_input:Optional[str]
    output_path:str
    completed:bool
    pack_by_volume:bool
    download_chapters:list[int]
    good_file_name:str
    no_append_after_filename:bool
    login_data:Optional[dict]
    output_formats:dict
    headers:Optional[dict] = {}
    cookies:Optional[dict] = {}
    proxies:Optional[dict] = {}

class Meta(msgspec.Struct):
    novel:MetaNovel
    session:Session
    last_update_date:Optional[str] = ""

# endregion

# region old struct :

VolumeOld = Volume
SessionOld = Session

class ChapterOld(msgspec.Struct):
    id:int
    volume:int
    url:str
    title:str
    volume_title:str

class MetaOld(msgspec.Struct):
    url:str
    title:str
    author:str
    cover:str
    volumes:list[VolumeOld]
    chapters:list[ChapterOld]
    rtl:bool
    session:Session
    language:Optional[str] = "en"
    summary:Optional[str] = ""
    last_update_date:Optional[str] = ""

# endregion
