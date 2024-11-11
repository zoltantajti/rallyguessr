const __allovedImages = ["image/jpeg","image/png","image/gif"];
export const checkImageIsAllowed = (file) => {
    return (__allovedImages.includes(file.type)) ? true : false;
}

export const checkJson = (str) =>{
    try{ JSON.parse(str); }catch(e){ return false; }; return true;
}