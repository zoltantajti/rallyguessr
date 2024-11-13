import userEvent from "@testing-library/user-event";
import { db } from "../../Utils/Firebase";
import { collection, addDoc, query, where, getDocs, setDoc, doc, deleteDoc, getDoc, onSnapshot, updateDoc, orderBy } from "firebase/firestore";
import { GenerateRandomCoord } from "../../Utils/GeoService";

export const addToMatchmaker = async (topic, player) => {
    const matchmakerRef = doc(db, `matchmaker/${player.__get('uid')}`);
    await setDoc(matchmakerRef, {
        uid: player.__get('uid'),
        topic: topic,
        status: "searching",
        timestamp: Date.now()
    })
}
export const removeFromMatchmaker = async (player) => {
    const ref = doc(db, `matchmaker/${player.__get('uid')}`);
    await deleteDoc(ref);
}

export const getOppentData = (lobbyID, my) => {
    return new Promise(async (resolve,reject) => {
        const lobbyRef = doc(db, "lobbies", lobbyID);
        const lobbyDoc = await getDoc(lobbyRef);
        if(lobbyDoc.exists()){
            const lobbyData = lobbyDoc.data();
            const oppentId = lobbyData.player1 === my.__get('uid') ? lobbyData.player2 : lobbyData.player1;
            const oppentRef = doc(db, "users", oppentId);
            const oppentDoc = await getDoc(oppentRef);
            if(oppentDoc.exists()){
                const oppentData = oppentDoc.data();
                resolve(oppentData);
            }else{
                reject("Oppent data not found!");
            };
        }else{
            reject("Lobby data not found");
        };
    });
}

export const findMatch = (player) => {
    return new Promise((resolve, reject) => {
        const matchmakerRef = collection(db, "matchmaker");
        const unsubscribe = onSnapshot(doc(matchmakerRef, player.__get('uid')), (docSnapshot) => {
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                if (data.status === "matched") {
                    unsubscribe();
                    resolve(data);
                };
            };
        });
    });
}
export const createLobby = async (topic, player1, player2) => {
    const lobbyRef = collection(db, "lobbies");
    const randomCoords = await GenerateRandomCoord(topic);
    const lobbyDoc = await addDoc(lobbyRef, {
        player1: player1,
        player2: player2,
        player1HP: 10000,
        player2HP: 10000,
        player1Tip: "",
        player2Tip: "",
        status: "pending",
        topic: topic,
        coord: JSON.stringify(randomCoords)
    });

    const matchmakerRef = collection(db, "matchmaker");
    const player1Doc = doc(matchmakerRef, player1);
    const player2Doc = doc(matchmakerRef, player2);
    await updateDoc(player1Doc, { status: "matched", lobbyID: lobbyDoc.id });
    await updateDoc(player2Doc, { status: "matched", lobbyID: lobbyDoc.id });

    return lobbyDoc.id;
}

export const pairPlayers = async (topic) => {
    const matchmakerRef = collection(db, "matchmaker");
    const q = query(matchmakerRef, where("topic","==",topic), where("status", "==", "searching"), orderBy("timestamp"));
    const snapshot = await getDocs(q);
    const players = [];
    snapshot.forEach((doc) => players.push(doc.id));
    for (let i = 0; i < players.length; i += 2) {
        if (players[i + 1]) {
            await createLobby(topic, players[i], players[i + 1]);
        };
    };
};

export const fetchLobbyById = async (id) => {
    const lobbyRef = doc(db, `lobbies/${id}`);
    const snapshot = await getDoc(lobbyRef);
    return snapshot.data();
}

export const handleUserXP = async (uid, xpToChange) => {
    const userRef = doc(db, `users/${uid}`);
    const userData = (await getDoc(userRef)).data();
    let _xp = parseInt(userData.exp) + parseInt(xpToChange);
    if(_xp < 0){ _xp = 0; };
    await updateDoc(userRef, { exp: _xp });
}