import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import { db } from '../../../Utils/Firebase';
import { formatNumber, formatPlayTime } from '../../../Utils/Localization';

const MPMapScores = ({ playTime, lobby, player1, player2}) => {
    const [init, setInit] = useState(false);
    const [p1, setP1] = useState(false);
    const [p2, setP2] = useState(false);
    const [p1HP, setP1HP] = useState(0);
    const [p2HP, setP2HP] = useState(0);
    const [animClass, setAnimClass] = useState(false);
    const getPlayers = async () => {
        const p1Doc = doc(db, `users/${player1}`);
        const p2Doc = doc(db, `users/${player2}`);
        await getDoc(p1Doc).then((data) => {
            setP1(data.data());
            setP1HP(lobby.player1HP);
        });
        await getDoc(p2Doc).then((data) => {
            setP2(data.data());
            setP2HP(lobby.player2HP); 
        });        
    };

    useEffect(() => {
        if(playTime === 119){ 
            setAnimClass("anim"); 
        }
    });

    useEffect(() => {
        getPlayers(); 
    },[]);
   
    return (
        <Badge bg="off" className={`timeAlert ${animClass}`} style={{zIndex: 6, position:'absolute',left:'50%',right:'50%',transform:'translateX(-50%)',width:'200px',borderTopLeftRadius:0,borderTopRightRadius:0}}>
            <Row>
                <Col>
                    <img src={p1?.avatar} style={{width:"32px",height:"32px"}} alt="p1Avatar" /><br/>
                    {formatNumber(lobby.player1HP || 0)}
                </Col>
                <Col className="text-center">
                    <div className="rallySymbol size-32">t</div>
                    {formatPlayTime(playTime)}
                </Col>
                <Col>
                    <img src={p2?.avatar} style={{width:"32px",height:"32px"}} alt="p2Avatar" /><br/>
                    {formatNumber(lobby.player2HP || 0)}
                </Col>
            </Row>
        </Badge>
    );
};

export default MPMapScores;