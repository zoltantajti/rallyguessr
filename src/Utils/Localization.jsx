export const getLangByCode = (code, getFlag = false) => {
    let flag = '';
    let lang = code;
    switch(code){
        case "hu": lang = "Magyar"; break;
        case "en": lang = "English"; break;
        default: break;
    };
    flag = (getFlag) ? `<img style="width:32px;height:20px" src="data:image/svg+xml;utf8,${encodeURIComponent(getFlagByCode(code))}" alt="flag" /> ` : '';

    return flag + lang;
}

const __flags = {
    hu: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><path d="M0 0h1200v600H0" fill="#477050"/><path d="M0 0h1200v400H0" fill="#fff"/><path d="M0 0h1200v200H0" fill="#ce2939"/></svg>',
    en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="1200" height="600"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>'
}

const getFlagByCode = (code) => {
    return __flags[code];
}

export const formatNumber = (number, locale = 'hu-HU') => {
    return number.toLocaleString(locale).replace('/\./g', ' ');
}

export const formatPlayTime = (_sec) => {
    const minutes = Math.floor(_sec / 60);
    const seconds = _sec % 60;
    const formattedMinutes = String(minutes);
    const formattedSecods = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSecods}`;
}