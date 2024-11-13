import React, { useEffect, useRef, useState } from 'react';
//import { addToQueue, createMatch, fetchEnemyData, removeFromQueue, searchPlayer } from './_matchmaking';
import { UserModel } from '../../Datas/Models/UserModel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Button, Card, Col, Container, Modal, Placeholder, Row } from 'react-bootstrap';
import PlaceholderIndicator from '../../Widgets/Game/PlaceholderIndicator';
import { addToMatchmaker, fetchLobbyById, findMatch, getOppentData, pairPlayers } from './_matchmaking';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';

const MPMatchmaking = () => {
    const user = UserModel.load();
    const location = useLocation();
    const navigate = useNavigate();
    const [haveEnemy, setHaveEnemy] = useState(false);
    const [enemy, setEnemy] = useState({});
    const [modal, setModal] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timeOut] = useState(999);
    const lobbyDataRef = useRef(null);
    const lobbyIDRef = useRef(null);
    /*StartEffect*/

    useEffect(() => {
        const topic = location.state.topic;       
        addToMatchmaker(topic, user)
            .then(() => {
                console.log("Játékos csatlakozott a matchmakinghez...");
                return findMatch(user);
            })
            .then(async (lobby) => {
                lobbyIDRef.current = lobby;
                lobbyDataRef.current = lobby;
                return await getOppentData(lobby.lobbyID, user);
            })
            .then(async (oppentData) => {
                const lobbyData = fetchLobbyById(lobbyDataRef.current.lobbyID);
                lobbyData.then((lobby) => { lobbyDataRef.current = lobby; });
                setEnemy({
                    avatar: oppentData.avatar,
                    country: oppentData.country,
                    username: oppentData.username,
                    xp: oppentData.exp
                });
                setHaveEnemy(true);      
                setTimeout(() => {
                    const gameState = {
                        id: lobbyIDRef.current.lobbyID,
                        topic: lobbyIDRef.current.topic,
                        data: lobbyDataRef.current
                    };
                    navigate("/game/duel", {state: gameState });
                },3000);       
            })
            .catch((err) => { console.error(err); });

        const interval = setInterval(async () => {
            await pairPlayers(topic);
        },5000);

        return () => clearInterval(interval);
    },[]);

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox />
                <Container style={{marginTop: "55px"}}>
                    <Row style={{position:"relative"}}>
                        <div className="oswald oswald-700 color-yellow size-100" style={{position:"absolute",top:"0",left:"0px",right:"0px",zIndex:9,textAlign:"center"}}>VS</div>
                        <div className="oswald oswald-700 color-yellow size-30" style={{position:"absolute",bottom:"0",left:"0px",right:"0px",zIndex:9,textAlign:"center"}}>
                            {(!haveEnemy) && (
                                <>
                                    Ellenfél keresése...<br/>
                                    {timer}
                                </>
                            )}
                            {(haveEnemy) && (
                                <>
                                    A meccs hamarosan indul...
                                </>
                            )}

                        </div>
                        <Col md={6} className='text-center'>
                            <Card className="statisticBoard">
                                <Card.Body >
                                    <img src={user.__get('avatar')} style={{width:"128px",height:"128px"}} alt="myAvatar"/><br/>
                                    <b className="oswald oswald-700 size-24 color-yellow">
                                        {user.__get('username')}
                                        {(user.__get('country') !== "N/A") && (<img style={{ position: 'relative', top: '-1px', left: '5px' }} src={`https://flagsapi.com/${user.__get('country')}/shiny/24.png`} alt="flag" />)}
                                    </b><br/>
                                    <b className="oswald oswald-500 size-20 color-white">
                                        XP: {user.__get('exp')}
                                    </b>
                                </Card.Body>
                            </Card>                            
                        </Col>
                        <Col md={6} className="text-center">
                            <Card className="statisticBoard">
                                {(!haveEnemy) && (
                                    <Placeholder as={Card.Body} animation='glow'>
                                        <PlaceholderIndicator color="#fff" width="128" height="128" />
                                        <Placeholder xs={5} />
                                    </Placeholder>
                                )}
                                {(haveEnemy) && (
                                    <Card.Body >
                                        <img src={enemy.avatar} style={{width:"128px",height:"128px"}} alt="myAvatar"/><br/>
                                        <b className="oswald oswald-700 size-24 color-yellow">
                                            {enemy.username}
                                            {(enemy.country !== "N/A") && (<img style={{ position: 'relative', top: '-1px', left: '5px' }} src={`https://flagsapi.com/${enemy.country}/shiny/24.png`} alt="flag" />)}
                                        </b><br/>
                                        <b className="oswald oswald-500 size-20 color-white">
                                            XP: {enemy.xp}
                                        </b>
                                    </Card.Body>
                                )}
                            </Card>  
                        </Col>
                    </Row>
                </Container>
                <Modal className="resultModal" show={modal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body className="text-center">
                        Sajnáljuk, de <b>nem találtunk</b> bejelentkezett ellenfelet.<br/>
                        Kérlek, próbáld újra később!
                        <hr/>
                        <Button onClick={() => {  }} variant="outline-light">Vissza</Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default MPMatchmaking;