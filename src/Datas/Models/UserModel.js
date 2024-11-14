import MyStorage from "../../Utils/MyStorage";

export const UserModel = (function () {
    const privateData = new WeakMap();
    return class User {
        constructor(uid,username,email,avatar,country,credits,exp,level,perm){
            privateData.set(
                this, 
                {uid,username,email,avatar,country,credits,exp,level,perm}
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
        toJSON() {
            const {uid,username,email,avatar,country,credits,exp,level,perm} = privateData.get(this);
            return JSON.stringify({uid,username,email,avatar,country,credits,exp,level,perm});
        }
        save(){
            const json = this.toJSON();
            MyStorage.session.put("user", json);
        }
        static load(){
            const data = JSON.parse(MyStorage.session.get("user"));
            if(data !== null) return new UserModel(data.uid, data.username, data.email, data.avatar, data.country, data.credits, data.exp, data.level, data.perm);
            return false;
        }
        dispose(){
            MyStorage.session.remove("user");
            privateData.delete(this);
        }
    }
})();