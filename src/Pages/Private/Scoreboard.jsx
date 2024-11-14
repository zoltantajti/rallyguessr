import React, { useEffect, useState } from 'react';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { UserModel } from '../../Datas/Models/UserModel';
import { Col, Container, ListGroup, ListGroupItem, Row, Tab, Tabs } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getCountryByCode } from '../../Datas/Countries';
import { formatNumber } from '../../Utils/Localization';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../Utils/Firebase';
import { getAuth } from 'firebase/auth';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const Scoreboard = () => {
    const { t } = useTranslation();
    const user = UserModel.load();
    const location = useLocation();
    const topic = location.state?.topic || "WRC";

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox user={user} />
                <Container style={{ marginTop: "35px" }}>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <Tabs defaultActiveKey={topic} className="mb-3 scoreBoard" >
                                <Tab eventKey="WRC" title="WRC">
                                    <ScoreBoardFrame topic="WRC" />
                                </Tab>
                                <Tab eventKey="ERC" title="ERC">
                                    <ScoreBoardFrame topic="ERC" />
                                </Tab>
                                <Tab eventKey="ORB" title="ORB">
                                    <ScoreBoardFrame topic="ORB" />
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};
export default Scoreboard;

const ScoreBoardFrame = ({ topic }) => {
    const [board, setBoard] = useState([]);
    
    const asyncEffect = async () => {
        const q = query(collection(db,"results"), where("gamemode","==","singleplayer"), where("topic","==",topic));
        const snapshot = await getDocs(q);
        const aggregatedResults = {};
        for(const d of snapshot.docs) {
            const data = d.data();
            const { uid, point, imageCount } = data;

            const userDocRef = doc(db, `users/${uid}`);
            const userDoc = await getDoc(userDocRef);
            const avatar = userDoc.data().avatar;
            const username = userDoc.data().username;
            const country = userDoc.data().country;

            if(!aggregatedResults[uid]){ 
                aggregatedResults[uid] = {
                    uid, 
                    username,
                    avatar,
                    country,
                    point: 0, 
                    images: 0
                }; 
            };
            aggregatedResults[uid].point += point || 0;
            aggregatedResults[uid].images += imageCount || 0;
        };

        const resultArray = Object.values(aggregatedResults);
        setBoard(resultArray);
    }

    useEffect(() => {
       asyncEffect();
    }, []);

    return (
        <ListGroup className="score-group">
            <ScoreBoardHeader />
            {(board.map((item, index) => (<ScoreBoardItem row={item} count={(index + 1)} key={index} />)))}
        </ListGroup>
    );
}
const ScoreBoardHeader = () => {
    return (
        <ListGroupItem className="scoreBoardItem">
            <Row>
                <Col md={1} style={{ display: "flex", alignItems: 'center', textAlign: 'center' }}>&nbsp;</Col>
                <Col md={1} style={{ display: "flex", alignItems: 'center', textAlign: 'center' }}>&nbsp;</Col>
                <Col md={6}>&nbsp;</Col>
                <Col md={2} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <b>{ t('sboard_imageCount') }</b>
                </Col>
                <Col md={2} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <b>{ t('sboard_pts') }</b>
                </Col>
            </Row>
        </ListGroupItem>
    )
}
const ScoreBoardItem = ({ row, count }) => {
    return (
        <ListGroupItem className='scoreBoardItem'>
            <Row>
                <Col md={1} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <b>{count}</b>
                </Col>
                <Col md={1} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <img src={row.avatar} style={{ width: "32px", height: "32px", borderRadius: "16px", objectFit: 'cover' }} alt="Avatar" />
                </Col>
                <Col md={6}>
                    <b><i>{row.username}</i></b><br />
                    <img style={{ width: "16px", height: "16px", position: 'relative', top: '-1px', marginRight: '5px' }} src={`https://flagsapi.com/${row.country}/shiny/24.png`} alt="flag" />
                    <b>{getCountryByCode(row.country)}</b>
                </Col>
                <Col md={2} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    {row.images}
                </Col>
                <Col md={2} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    {formatNumber(row.point)}
                </Col>
            </Row>
        </ListGroupItem>
    )
}