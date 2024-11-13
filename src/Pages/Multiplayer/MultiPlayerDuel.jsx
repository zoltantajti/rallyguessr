import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import MPMapScores from '../../Widgets/Game/Multiplayer/MPMapScores';
import MPMap from '../../Widgets/Game/Multiplayer/MPMap';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';
import { UserModel } from '../../Datas/Models/UserModel';
import { handleUserXP } from './_matchmaking';
import { getLevelID } from '../../Datas/Levels';
import { calculateDistance, formatDistance, GenerateRandomCoord } from '../../Utils/GeoService';
import { getPointsByDistance } from '../../Utils/CalculatePoints';
import CountDown from './CountDown';
import GameStreetView from '../../Widgets/Game/GameStreetView';

/*ID; Topic; Data*/
const MultiPlayerDuel = () => {
    /*Globals*/
    const user = UserModel.load();
    const mapRef = useRef(null);
    const playerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [lobbyID, setLobbyID] = useState(false);
    const [lobbyTopic, setLobbyTopic] = useState(false);
    const [lobbyData, setLobbyData] = useState([]);
    const [playTime, setPlayTime] = useState(120);
    const [timer, setTimer] = useState(false);
    const [cancelledModal, setCancelledModal] = useState(false);
    const [resultModal, setResultModal] = useState(false);


    const timerStart = () => {
        setPlayTime(120);
        if (!timer) {
            let t = setInterval(() => {
                setPlayTime((prev) => {
                    let time = prev - 1;
                    if (time === 0) {
                        clearInterval(t);
                        setMarkerTip({ lat: 0.0, lng: 0.0 });
                    };
                    return time;
                });
            }, 1000);
            setTimer(t);
        };
    }
    const timerStop = () => {
        clearInterval(timer);
        setTimer(false);
    }

    useEffect(() => {
        setLobbyID(location.state.id);
        setLobbyTopic(location.state.topic);
        setLobbyData(location.state.data);
        playerRef.current = (location.state.data.player1 === user.__get('uid') ? 'player1' : 'player2');

        const lobbyRef = doc(db, `lobbies/${location.state.id}`);
        updateDoc(lobbyRef, { status: "started" });


        const unsubscribe = onSnapshot(lobbyRef, (snapshot) => {
            const data = snapshot.data();
            if (data) {
                const { player1Tip, player2Tip, status } = data;
                if (status === "started" && (player1Tip !== "" || player2Tip !== "")) {
                    setPlayTime(10);
                    if (mapRef.current) {
                        mapRef.current.OppentMap((playerRef.current === "player1") ? player2Tip : player1Tip);
                    };
                };
                if (status === "started" && (player1Tip !== "" && player2Tip !== "")) {
                    setResultModal(true);
                };
                if (status === "cancelled") {
                    setCancelledModal(true);
                }
            };
        });

        if (!timer) { timerStart(); };

        return () => unsubscribe();
    }, [location]);

    /*Match functions*/
    const abortMatch = async () => {
        const lobbyRef = doc(db, `lobbies/${lobbyID}`);
        const lobbyData = (await getDoc(lobbyRef)).data();
        if (lobbyData.status === "cancelled") {
            await synchUserDatas();
            navigate("/prepare_multiplayer");
        } else {
            await updateDoc(lobbyRef, {
                status: "cancelled",
                reason: `${playerRef.current} feladta a mérkőzést`,
                callerID: user.__get('uid')
            });
            handleUserXP(user.__get('uid'), -10);
            handleUserXP((lobbyData.player1 === user.__get('uid') ? lobbyData.player2 : lobbyData.player1), 10);
            await synchUserDatas();
            navigate("/prepare_multiplayer");
        };
    }
    const synchUserDatas = async () => {
        const user = UserModel.load();
        const userRef = doc(db, `users/${user.__get('uid')}`);
        const userData = (await getDoc(userRef)).data();
        let xp = userData.exp;
        let level = getLevelID(xp);
        user.__set('exp', xp);
        user.__set('level', level);
        user.save();
        await updateDoc(userRef, { level: level });
    }

    /*Map functions*/
    const setMarkerTip = async (coords, force = false) => {
        const lobbyRef = doc(db, `lobbies/${location.state.id}`);
        const lobbyData = (await getDoc(lobbyRef)).data();
        console.log(lobbyData);
        if (!force) {
            if (lobbyData.player1Tip !== "" && lobbyData.player2Tip !== "") {
            } else {
                updateDoc(lobbyRef, { [`${playerRef.current}Tip`]: JSON.stringify(coords) });
                setPlayTime(10);
                timerStop();
            };
        };
    }

    /*Result funtions*/
    const [p1, setP1] = useState(false);
    const [p2, setP2] = useState(false);
    const [p1HP, setP1HP] = useState(0);
    const [p2HP, setP2HP] = useState(0);
    const [p1Dist, setP1Dist] = useState(0);
    const [p2Dist, setP2Dist] = useState(0);
    const [p1PTS, setP1PTS] = useState(0);
    const [p2PTS, setP2PTS] = useState(0);
    const [displayMode, setDisplayMode] = useState("Pont");
    const scoreScreenInit = async () => {
        const p1Doc = doc(db, `users/${lobbyData.player1}`);
        const p1Snapshot = await getDoc(p1Doc);
        const p1Data = p1Snapshot.data();
        setP1(p1Data);
        const p2Doc = doc(db, `users/${lobbyData.player2}`);
        const p2Snapshot = await getDoc(p2Doc);
        const p2Data = p2Snapshot.data();
        setP2(p2Data);
    }
    const calculatePoints = async () => {
        
        setP1HP(lobbyData.player1HP);
        setP2HP(lobbyData.player2HP);
        const lDoc = doc(db, `lobbies/${lobbyID}`);
        await getDoc(lDoc).then((data) => {
            data = data.data();
            if (data.player1Tip && data.player2Tip) {
                const p1Distance = calculateDistance(JSON.parse(data.coord), JSON.parse(data.player1Tip)); setP1Dist(p1Distance);
                const p2Distance = calculateDistance(JSON.parse(data.coord), JSON.parse(data.player2Tip)); setP2Dist(p2Distance);
                const p1Point = getPointsByDistance(p1Distance); setP1PTS(p1Point);
                const p2Point = getPointsByDistance(p2Distance); setP2PTS(p2Point);
                setTimeout(() => {
                    let winner = null;
                    if(p1Point > p2Point) { winner = p1Point; }
                    if(p1Point < p2Point) { winner = p2Point; };
                    let p1pts = Math.abs(p1Point - Math.abs(winner));
                    let p2pts = Math.abs(p2Point - Math.abs(winner));
                    setP1PTS(p1pts); setP2PTS(p2pts); setDisplayMode("Sebzés");
                    setTimeout(() => {
                        let p1hp = lobbyData.player1HP - p1pts;
                        let p2hp = lobbyData.player2HP - p2pts;
                        setP1HP(p1hp); setP2HP(p2hp);
                        setP1PTS(0);
                        setP2PTS(0);
                        mapRef.current.clearMap();
                        GenerateRandomCoord(lobbyTopic).then(async (coord) => {
                            updateDoc(lDoc, {
                                player1HP: p1hp,
                                player2HP: p2hp,
                                player1Tip: "",
                                player2Tip: "",
                                coord: JSON.stringify(coord)
                            });
                            await getDoc(lDoc).then((gameData) => {
                                const gameState = {
                                    id: location.state.id,
                                    topic: location.state.topic,
                                    data: gameData.data()
                                };
                                setTimeout(() => {
                                    if (gameData.data().player1HP > 0 && gameData.data().player2HP > 0) {
                                        setP1(false);
                                        setP2(false);
                                        setP1HP(0);
                                        setP2HP(0);
                                        setP1Dist(0);
                                        setP1Dist(0);
                                        setResultModal(false);
                                        setPlayTime(120);
                                        navigate("/game/duel", { state: gameState });
                                    } else {
                                        navigate("/game/duel_overview", { state: gameState });
                                    }
                                }, 3000);
                            });
                        });
                    },3000);
                }, 3000);
            };
        });
    }

    useEffect(() => {
        if (resultModal) {
            scoreScreenInit();
            calculatePoints();
        };
    }, [resultModal]);

    return (
        <>
            {/*<GameStreetView pos={JSON.parse(location.state.data.coord)} style={{zIndex: 4}} />*/}
            <Button variant="secondary" size="lg" style={{ position: 'absolute', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, height: "52px", zIndex: 125 }} onClick={abortMatch}>Feladás</Button>
            <MPMapScores playTime={playTime} lobby={location.state.data} player1={location.state.data.player1} player2={location.state.data.player2} />
            <MPMap ref={(el) => { mapRef.current = el; }} callback={(coords) => { setMarkerTip(coords); }} />
            {/*CancelledModal*/}
            <Modal className="resultModal" show={cancelledModal} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body className="text-center">
                    Sajnáljuk, az ellenfeled feladta a mérkőzést és ezzel 10 XP-t veszített.<br />
                    <span className="color-yellow">A 10 XP-t jóváírjuk neked!</span>
                    <hr />
                    <Button onClick={abortMatch} variant="outline-light">Rendben</Button>
                </Modal.Body>
            </Modal>
            {/*ResultModal*/}
            {(resultModal) && (
                <Modal className="resultModal" show={resultModal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body className="text-center">
                        <Row>
                            <Col md={{ span: 5, offset: 1 }}>
                                <Card className="statisticBoard">
                                    <Card.Body className="text-center">
                                        <img src={p1?.avatar} style={{ width: "128px", height: "128px" }} alt="myAvatar" /><br />
                                        <b className="color-white">{p1?.username}</b><br />
                                        <b className="color-yellow">HP: {p1HP}</b><br />
                                        <hr />
                                        <b className="color-white">{formatDistance(p1Dist)}</b><br />
                                        <b className="color-white">{displayMode}: {p1PTS}</b>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={{ span: 5 }}>
                                <Card className="statisticBoard">
                                    <Card.Body className="text-center">
                                        <img src={p2?.avatar} style={{ width: "128px", height: "128px" }} alt="myAvatar" /><br />
                                        <b className="color-white">{p2?.username}</b><br />
                                        <b className="color-yellow">HP: {p2HP}</b><br />
                                        <hr />
                                        <b className="color-white">{formatDistance(p2Dist)}</b><br />
                                        <b className="color-white">{displayMode}: {p2PTS}</b>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default MultiPlayerDuel;