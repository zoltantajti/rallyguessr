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

        static async __syncFromDB(){
            const user = UserModel.load();
            const userDoc = doc(db, `users/${user.__get('uid')}`);
            return (await getDoc(userDoc)).data();
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
            const localData = JSON.parse(local);
            if(localData !== null){
                return new SettingsModel(localData.lang, localData.volume, localData.sound, localData.fullscreen);
            }else{
                return new SettingsModel("hu",50,true,false);
            }
        }
        dispose() {
            MyStorage.session.remove("settings");
            privateData.delete(this);
        }
    }
})();