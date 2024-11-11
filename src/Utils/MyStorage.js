import CryptoJS from 'crypto-js';

const MyStorage = {
    local: {
        get(key) {
            return localStorage.getItem(`rallyGuessr/${key}`) || null;            
        },
        put(key, value) {
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
            let hash = sessionStorage.getItem(`rallyGuessr/${key}`);
            if(hash === null) return null;
            return CryptoJS.AES.decrypt(hash,"RallyGuessr.hu#2024#&#").toString(CryptoJS.enc.Utf8);
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