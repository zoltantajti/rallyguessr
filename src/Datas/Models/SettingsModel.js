import { doc, getDoc, updateDoc } from "firebase/firestore";
import MyStorage from "../../Utils/MyStorage";
import { db } from "../../Utils/Firebase";
import { UserModel } from "./UserModel";

export const SettingsModel = (function () {
    const privateData = new WeakMap();
    return class Settings {
        constructor(lang, volume, sound, fullscreen){
            privateData.set(
                this, 
                {lang, volume, sound, fullscreen}
            ); 
        }
        __get(key){ 
            return privateData.get(this)[key]; 
        }
        __set(key, val){ 
            privateData.get(this)[key] = val; 
            this.save();
        }
        
        
        /*Save & Load*/
        toJSON() { return JSON.stringify(privateData.get(this)); }
        save() {
            const json = this.toJSON();
            const user = UserModel.load();
            const userDoc = doc(db, `users/${user.__get('uid')}`);
            updateDoc(userDoc, { settings: json });
            MyStorage.session.put("settings", json);
        }
        static load() {
            const local = MyStorage.session.get("settings");
            const user = UserModel.load();
            const userDoc = doc(db, `users/${user.__get('uid')}`);
            getDoc(userDoc).then((data) => {
                if (local !== null) {
                    const localData = JSON.parse(local);
                    return new SettingsModel(localData.lang, localData.volume, localData.sound, localData.fullscreen);
                }else if(data !== null){
                    if(data.data().settings){
                        const storedData = JSON.parse(data.data().settings);
                        return new SettingsModel(storedData.lang, storedData.volume, storedData.sound, storedData.fullscreen);
                    }else{
                        return new SettingsModel();
                    };
                }else{
                    return new SettingsModel();
                };
            }).catch((e) => { console.error(e); return new SettingsModel(); });
        }
        dispose() {
            MyStorage.session.remove("settings");
            privateData.delete(this);
        }
    }
})();