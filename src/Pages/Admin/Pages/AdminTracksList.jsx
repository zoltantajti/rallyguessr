import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../../../Utils/Firebase';
import { checkJson } from '../../../Utils/Utils';
import FaIcon from '../../../Widgets/Global/FaIcon';

const formatTopic = (topic) => {
    if(checkJson(topic)){ topic = JSON.parse(topic); };
    let res = "";
    let variant = "";
    topic.map((item, index) => {
        switch (item) {
            case "WRC": variant = "danger text-white"; break;
            case "ERC": variant = "primary"; break;
            case "ORB": variant = "success"; break;
            default: variant = "secondary"; break;
        }
        res += `<span class="badge text-bg-${variant}">${item}</span>`
    });
    return res;
}

const AdminTracksList = () => {
    const location = useLocation();
    const [tracks, setTracks] = useState([]);
    const [message, setMessage] = useState(false);

    const getTracks = async () => {
        setTracks([]);
        const q = query(collection(db, "tracks"), where("activeTrack", "==", true));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            const item = {id: doc.id, data: doc.data()};
            setTracks((prev) => [...prev, item]);
        });
        console.log(tracks);
    }

    useEffect(() => {
        if(location?.state){
            setMessage({
                variant: (location?.state?.success) ? 'success' : 'danger',
                text: location?.state?.message
            });
        }
        getTracks();
    }, []);

    return (
        <Container style={{ paddingTop: '75px' }}>
            {(message) && (
                <Alert onClick={() => setMessage(false)} variant={message.variant}>{message.text}</Alert>
            )}
            <ListGroup>
                <ListGroup.Item>
                    <Row>
                        <Col md={3} style={{ fontWeight: 'bold' }}>Rally neve (Gyors száma)</Col>
                        <Col md={3} style={{ fontWeight: 'bold' }}>Szakasz neve</Col>
                        <Col md={1} style={{ fontWeight: 'bold' }}>Kategória</Col>
                        <Col md={5} style={{ fontWeight: 'bold' }}></Col>
                    </Row>
                </ListGroup.Item>
                {(tracks.map((item, index) => (
                    <ListGroup.Item>
                        <Row>
                            <Col md={3} style={{ fontWeight: 'bold' }}>{item.data.name} ({item.data.trackNumber})</Col>
                            <Col md={3} style={{ fontWeight: 'bold' }}>{item.data.trackName}</Col>
                            <Col md={1} style={{ fontWeight: 'bold' }}><span dangerouslySetInnerHTML={{ __html: formatTopic(item.data.topic)}}/></Col>
                            <Col md={5} style={{textAlign:'right'}}>
                                <Link to={`/admin/tracks/edit/${item.id}`}><FaIcon type="solid" icon="pencil" /></Link>
                                <Link to={`/admin/tracks/delete/${item.id}`}><FaIcon type="solid" icon="trash" style={{marginLeft:'10px',color:'#ff0000'}}/></Link>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )))}
            </ListGroup>
        </Container>
    );
};

export default AdminTracksList;