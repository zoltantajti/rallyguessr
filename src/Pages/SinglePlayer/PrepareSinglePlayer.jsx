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

const PrepareSinglePlayer = () => {
    const { t, i18next } = useTranslation();
    const navigate = useNavigate();
    const [WRCTracks, setWRCTracks] = useState(0);
    const [ERCTracks, setERCTracks] = useState(0);
    const [ORBTracks, setORBTracks] = useState(0);

    const SelectCategory = (target) => {
        trackPromise(
            GenerateRandomCoord(target)
            .then((data) => {
                MyStorage.local.put('overallPoint', 0);
                navigate("/game/singleplayer", {state: {pos: data, image: 1, max: 2, topic: target, gm: 'singleplayer'}});
            })
            .catch((err) => {
                console.error(err);
            })
        )
    }

    const getTracks = async () => {
        const q = query(collection(db,"tracks"), where("activeTrack","==",true));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            if(doc.data().topic.includes("WRC")){ setWRCTracks(prev => prev + 1)};
            if(doc.data().topic.includes("ERC")){ setERCTracks(prev => prev + 1)};
            if(doc.data().topic.includes("ORB")){ setORBTracks(prev => prev + 1)};
        });
    }

    useEffect(() => { getTracks(); },[]);

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox />
                <Container style={{marginTop: "55px"}}>
                    <Row>
                        <Col md={4}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/fiaWRCLogo.png" />
                                <Card.Text>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{WRCTracks}</span>
                                    {t('wrcTitle')}<br/> {t('wrcCaption')}
                                    <Button disabled={(WRCTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("WRC"); }} variant="light" className="d-block w-100 stretched-link">{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/fiaERCLogo.png" />
                                <Card.Text>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{ERCTracks}</span>
                                    {t('ercTitle')}<br/> {t('ercCaption')}
                                    <Button disabled={(ERCTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("ERC"); }} variant="light" className="d-block w-100 stretched-link">{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="pregameCard">
                                <Card.Img variant="top" src="images/HUMDAORBLogo.png" />
                                <Card.Text>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{ORBTracks}</span>
                                    {t('orbTitle')}<br/> {t('orbCaption')}
                                    <Button disabled={(ORBTracks === 0)? 'disabled' : ''} onClick={() => { SelectCategory("ORB"); }} variant="light" className="d-block w-100 stretched-link">{t('btn_start')}</Button>
                                </Card.Text>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default PrepareSinglePlayer;