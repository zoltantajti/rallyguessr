import React, { useEffect, useRef, useState } from 'react';
import { addToQueue, createMatch, fetchEnemyData, removeFromQueue, searchPlayer } from './_matchmaking';
import { UserModel } from '../../Datas/Models/UserModel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Button, Card, Col, Container, Modal, Placeholder, Row } from 'react-bootstrap';
import PlaceholderIndicator from '../../Widgets/Game/PlaceholderIndicator';
import wsi, { WSIClose, WSISend } from '../../WebSocket/WSService';

const MPMatchmaking = () => {
    const user = UserModel.load();
    const location = useLocation();
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const [haveEnemy, setHaveEnemy] = useState(false);
    const [modal, setModal] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timeOut] = useState(999);

    const addToQueueAsync = async (topic) => { 
        await addToQueue(topic, user); 
        WSISend(JSON.stringify({type: 'onConnect', userID: user.__get('uid')}));
    }
    const remFromQueueAsync = async (topic) => { await removeFromQueue(topic, user); }
    const cancelMatchmaking = () => { 
        WSISend(JSON.stringify({type: 'onDisconnect', userID: user.__get('uid')}));
        WSIClose();
        remFromQueueAsync(); 
        navigate("/prepare_multiplayer");     
    }

    const timer_start = () => {
        if(!timerRef.current){
            timerRef.current = setInterval(() => {
                setTimer(prevTimer => {
                    const newTimer = prevTimer + 1;
                    if(newTimer === (timeOut + 1)){
                        timer_stop();
                        return newTimer;
                    };
                    return newTimer;
                })
            }, 1000);
        }
    }
    const timer_stop = (_modal = true) => {
        if(timerRef.current){
            clearInterval(timerRef.current);
            timerRef.current = null;
            if(modal) setModal(true);
        }
    }
    let searchTimer = false;
    const searchPlayerAsync = async (topic) => {
        
        searchPlayer(topic, user).then((enemy) => {
            if(enemy){
                WSISend(JSON.stringify({type: "onSelectEnemy", enemyID: enemy.id, userID: user.__get('uid')}));
                
            }else{
                searchTimer = setTimeout(() => {
                    console.log("next...");
                    searchPlayerAsync(topic);
                },3000);
            };
        })
    }
    const [enemy, setEnemy] = useState(false);
    wsi.onmessage = async (message) => {
        message = JSON.parse(message.data);
        if(message.type === "onEnemySelected"){
            clearTimeout(searchTimer);
            timer_stop(false);
            const _e = await fetchEnemyData(message.enemy);
            setHaveEnemy(true);
            setEnemy({
                avatar: _e.avatar,
                username: _e.username,
                country: _e.country,
                xp: _e.exp
            });
            createMatch(user.__get('uid'), message.enemy);
            removeFromQueue(user);
        }
    };
    
    /*StartEffect*/
    useEffect(() => {
        const topic = location.state.topic;       
        timer_start();
        addToQueueAsync(topic);        
        searchPlayerAsync(topic);
        
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
                        <Button onClick={() => { cancelMatchmaking(); }} variant="outline-light">Vissza</Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default MPMatchmaking;