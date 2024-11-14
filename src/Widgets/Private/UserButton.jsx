import React, { useEffect, useState } from 'react';
import { auth } from '../../Utils/Firebase';
import { Col, Row } from 'react-bootstrap';
import { getLevelMax, getLevelMin, getLevelName } from '../../Datas/Levels';
import FaIcon from '../Global/FaIcon';
import { UserModel } from '../../Datas/Models/UserModel';

const UserButton = ({ user }) => {
    const [state, setState] = useState([]);
    
    useEffect(() => {
        if(!user){ user = UserModel.load(); };
        setState({
            avatar: user.__get('avatar'),
            username: user.__get('username'),
            exp: user.__get('exp'),
            levelName: getLevelName(user.__get('level')),
            levelMin: getLevelMin(user.__get('level')),
            levelMax: getLevelMax(user.__get('level')),
            credits: user.__get('credits') || 0
        });        
    },[]);
    
    return (
        <Row>
            <Col md={3} className="d-flex justify-content-center align-items-center col-3">
                <img src={state?.avatar} style={{ width: "48px", height:"48px", borderRadius:"50%", objectFit:"cover" }} alt="Avatar" />
            </Col>
            <Col md={9} className="text-left text-mobile-center col-9">
                <b>{state?.username}</b><br />
                <div style={{ display: 'flex' }}>
                    <span className="lvl-text">{state?.levelName}</span>
                    <progress style={{ position: 'relative', top: '4px' }} value={state?.exp} min={state?.levelMin} max={state?.levelMax} />
                </div>
                <FaIcon type="solid" icon="coins" /> {state?.credits}
            </Col>
        </Row>
    );
};

export default UserButton;