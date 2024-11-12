import React, { useEffect, useState } from 'react';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';
import { GenerateRandomCoord } from '../../Utils/GeoService';
import MyStorage from '../../Utils/MyStorage';
import { useNavigate } from 'react-router-dom';
import { WSISend } from '../../WebSocket/WSService';
import { UserModel } from '../../Datas/Models/UserModel';
import { removeFromMatchmaker, removeFromQueue } from './_matchmaking';

const PrepareMultiPlayer = () => {
    const { t, i18next } = useTranslation();
    const navigate = useNavigate();
    const [WRCTracks, setWRCTracks] = useState(0);
    const [ERCTracks, setERCTracks] = useState(0);
    const [ORBTracks, setORBTracks] = useState(0);

    const SelectCategory = (target) => {
        navigate("/game/matchmaking", {state: {topic: target}});
    }

    const __clearState = () => {
        setWRCTracks(0);
        setERCTracks(0);
        setORBTracks(0);
    }

    const getTracks = async () => {
        __clearState();
        const q = query(collection(db,"tracks"), where("activeTrack","==",true));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            if(doc.data().topic.includes("WRC")){ setWRCTracks(prev => prev + 1)};
            if(doc.data().topic.includes("ERC")){ setERCTracks(prev => prev + 1)};
            if(doc.data().topic.includes("ORB")){ setORBTracks(prev => prev + 1)};
        });
    }

    useEffect(() => { 
        getTracks(); 
        const user = UserModel.load();
        //WSISend(JSON.stringify({type: 'onDisconnect', userID: user.__get('uid')}));
        removeFromMatchmaker(user);
    },[]);

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox />
                <Container style={{marginTop: "55px"}}>
                    <Row>
                        <Col md={{span: 4}}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/fiaWRCLogo.png" className={`track-selector ${(WRCTracks === 0) ? 'inactive' : ''}`}/>
                                <Card.Text>
                                    {t('wrcTitle')}<br/> {t('wrcCaption')}
                                    <Button disabled={(WRCTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("WRC"); }} variant="light" className={`d-block w-100 stretched-link track-selector ${(WRCTracks === 0) ? 'inactive' : ''}`}>{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/fiaERCLogo.png" className={`track-selector ${(ERCTracks === 0) ? 'inactive' : ''}`}/>
                                <Card.Text>
                                    {t('ercTitle')}<br/> {t('ercCaption')}
                                    <Button disabled={(ERCTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("ERC"); }} variant="light" className={`d-block w-100 stretched-link track-selector ${(ERCTracks === 0) ? 'inactive' : ''}`}>{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/HUMDAORBLogo.png" className={`track-selector ${(ORBTracks === 0) ? 'inactive' : ''}`}/>
                                <Card.Text>
                                    {t('orbTitle')}<br/> {t('orbCaption')}
                                    <Button disabled={(ORBTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("ORB"); }} variant="light" className={`d-block w-100 stretched-link track-selector ${(ORBTracks === 0) ? 'inactive' : ''}`}>{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default PrepareMultiPlayer;