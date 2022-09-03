

export function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}


export function toFlag(lang) {
    switch (lang) {
        case "en":
            return "🇬🇧"
        case "zh":
            return "🇨🇳"
        case "ja":
            return "🇯🇵"
        case "ko":
            return "🇰🇷"
        case "vi":
            return "🇻🇳"
        case "id":
            return "🇮🇩"
        case "th":
            return "🇹🇭"
        case "es":
            return "🇪🇸"
        case "fr":
            return "🇫🇷"
        case "de":
            return "🇩🇪"
        case "it":
            return "🇮🇹"
        case "pt":
            return "🇵🇹"
        case "ru":
            return "🇷🇺"
        case "tr":
            return "🇹🇷"
        case "ar":
            return "🇸🇩"
        case "hi":
            return "🇮🇳"
        default:
            return "unknown"
    }
}


export const languageDict = {
    "en": "English",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "vi": "Vietnamese",
    "id": "Indonesian",
    "th": "Thai",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "tr": "Turkish",
    "ar": "Arabic",
    "hi": "Hindi"
}

