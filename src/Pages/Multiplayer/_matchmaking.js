import userEvent from "@testing-library/user-event";
import { db } from "../../Utils/Firebase";
import { collection, addDoc, query, where, getDocs, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

export const addToQueue = async (topic, player) => {
    const ref = doc(db, `matchmaking/${player.__get('uid')}`);
    const docRef = await setDoc(ref, { 
        uid: player.__get('uid'),
        topic: topic 
    });
}
export const removeFromQueue = async (player) => {
    const docRef = doc(db, `matchmaking/${player.__get('uid')}`);
    const dd = deleteDoc(docRef);
    dd.then(() => { console.log("Törölve"); }).catch((e) => console.error(e));
}

export const searchPlayer = async (topic, player) => {
    const q = query(collection(db,"matchmaking"), where("topic","==",topic));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.filter((doc) => doc.id !== player.__get('uid')).map((doc) => ({ id: doc.id, ...doc.data() }));
    return results[Math.floor(Math.random() * results.length)] || false;
}

export const fetchEnemyData = async (uid) => {
    const docRef = doc(db, `users/${uid}`);
    const result = (await getDoc(docRef)).data();
    console.log(result);
    return result;
}

export const createMatch = async (player1, player2) =>{
    const matchesRef = collection(db, "matches");
    const q = query(
        matchesRef,
        where("status", "in", ["pending","running"]),
        where("player1","==", player1),
        where("player2","==", player1)
    );
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){ console.warn("Már léteik a meccs"); return ;};

    const newMatch = {
        status: "pending",
        player1: player1,
        player2: player2
    };

    try{
        const docRef = await addDoc(matchesRef, newMatch);
        console.log("Új játék ID-je:", docRef.id);
    }catch(error){
        console.error("Hiba: ", error);
    }
}