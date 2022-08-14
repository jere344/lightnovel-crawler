import React from 'react'
import { Helmet } from "react-helmet";

function Metadata(data) {
    const { description, title, imageUrl, imageAlt, imageType } = data;

    return (
        <Helmet>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="author" content="https://github.com/jere344/lightnovel-crawler/tree/flask" />
            <meta name="language" content="en" />
            <meta name="distribution" content="global" />

            <meta property="og:url" content="{{ url_for(request.endpoint, **request.view_args) }}" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="lncrawler" />

            <meta name="twitter:site" content="lncrawler" />
            <meta name="twitter:creator" content="https://github.com/jere344/lightnovel-crawler/tree/flask" />
            <meta name="twitter:url" content="{{ url_for(request.endpoint, **request.view_args) }}" />
            <meta name="twitter:locale" content="en_US" />

            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="apple-mobile-web-app-title" content="LnCrawler" />

            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:type" content={imageType} />
            <meta property="og:image:alt" content={imageAlt} />
            <meta property="og:image:url" content={imageUrl} />

            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:type" content={imageType} />
            <meta name="twitter:image:alt" content={imageAlt} />
            <meta name="twitter:image:url" content={imageUrl} />
        </Helmet>
    )
}

export default Metadata