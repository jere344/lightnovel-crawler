import config from './config.json';

let WEBSITE_URL, API_URL, DOMAIN;

if (config.dev_mode === "true") {
    WEBSITE_URL = config.dev_website_url
    API_URL = config.dev_api_url
    DOMAIN = "localhost"
}
else if (config.dev_mode === "false")
{
    WEBSITE_URL = config.website_url
    API_URL = config.api_url
    DOMAIN = config.website_url.replace("https://", "").replace("http://", "")
}
else {
    throw new Error("Invalid dev_mode value in config.json (must be 'true' or 'false')")
}

export { WEBSITE_URL, API_URL, DOMAIN }