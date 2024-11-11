import CryptoJS from 'crypto-js';

const MyStorage = {
    local: {
        get(key) {
            let hash = localStorage.getItem(`rallyGuessr/${key}`) || null;
            if (hash === null) return null;
            let json = JSON.parse(CryptoJS.AES.decrypt(hash, "RallyGuessr.hu#2024#&#").toString(CryptoJS.enc.Utf8));
            return json;
        },
        put(key, value, encrypt = false) {
            if (encrypt) {
                value = CryptoJS.AES.encrypt(JSON.stringify(value), "RallyGuessr.hu#2024#&#");
            } else {
                value = JSON.stringify(value);
            }
            return localStorage.setItem(`rallyGuessr/${key}`, value);
        },
        remove(key) {
            return localStorage.removeItem(`rallyGuessr/${key}`)
        },
        clear() {
            return localStorage.clear();
        }
    },
    session: {
        get(key) {
            let hash = sessionStorage.getItem(`rallyGuessr/${key}`) || null;
            if (hash === null) return null;
            return CryptoJS.AES.decrypt(hash, "RallyGuessr.hu#2024#&#").toString(CryptoJS.enc.Utf8);
        },
        put(key, val) {
            return sessionStorage.setItem(`rallyGuessr/${key}`, CryptoJS.AES.encrypt(val, "RallyGuessr.hu#2024#&#"));
        },
        remove(key) {
            return sessionStorage.removeItem(`rallyGuessr/${key}`);
        },
        clear() {
            sessionStorage.clear();
        }
    }
}
export default MyStorage;