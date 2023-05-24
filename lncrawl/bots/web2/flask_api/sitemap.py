from pathlib import Path
from urllib.parse import quote
def replace_xml_illegal(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")

def generate_sitemap(sitemap_file : Path, include_chapterlist : bool = False):
    """Generate sitemap.xml file"""
    from . import lib
    from . import database
    import math

    sitemap = []
    import datetime

    sitemap.append(f"""
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd 
                        http://www.google.com/schemas/sitemap-image/1.1 
                        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
>"""
            )


    sitemap.append(f"""
    <url>
        <loc>{lib.WEBSITE_URL}/</loc>
        <lastmod>{datetime.datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{lib.WEBSITE_URL}/browse/</loc>
        <lastmod>{datetime.datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>{lib.WEBSITE_URL}/search/</loc>
        <lastmod>{datetime.datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>{lib.WEBSITE_URL}/addnovel/</loc>
        <lastmod>{datetime.datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    """)

    for page in range(math.ceil(len(database.all_novels) / 20)):
        sitemap.append(f"""
    <url>
        <loc>{lib.WEBSITE_URL}/browse/page-{page + 1}/</loc>
        <lastmod>{datetime.datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
        """)
            

    for novel in database.all_novels:



        for source in novel.sources:
            image = f"""
        <image:image>
            <image:loc>https://api.lncrawler.monster/image/{quote(source.cover)}</image:loc>
            <image:caption>{replace_xml_illegal(source.title)}</image:caption>
            <image:title>{replace_xml_illegal(source.title)}</image:title>
        </image:image>""" if source.cover else ""

            sitemap.append(f"""
    <url>
        <loc>{lib.WEBSITE_URL}/novel/{source.xml_url}</loc>
        <lastmod>{source.last_update_date if source.last_update_date else "2022-11-01T00:00:00"} </lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>{image}
    </url>
            """)


            if include_chapterlist:
                for page in range(math.ceil(source.chapter_count / 100)):
                    sitemap.append(f"""
    <url>
        <loc>{lib.WEBSITE_URL}/novel/{source.xml_url}chapterlist/page-{page + 1}/</loc>
        <lastmod>{source.last_update_date if source.last_update_date else "2022-11-01T00:00:00"} </lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.2</priority>
    </url>
                """)        
    sitemap.append("</urlset>")
    with open(sitemap_file, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap).strip())




