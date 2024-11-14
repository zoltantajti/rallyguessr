import React, { useEffect, useState } from 'react';
import { Form, Col, Container, Modal, ModalTitle, Row, Button } from 'react-bootstrap';
import "../../i18n";
import { availableLangs } from '../../i18n';
import { getLangByCode } from '../../Utils/Localization';
import { useTranslation } from 'react-i18next';
import { SettingsModel } from '../../Datas/Models/SettingsModel';
import FaIcon from '../Global/FaIcon';

const Settings = ({ show, handleClose }) => {
    const sm = SettingsModel.load() || new SettingsModel("hu",50, true, false);
    
    const { t, i18n } = useTranslation();
    const [langs, setLangs] = useState([]);
    const [volume, setVolume] = useState(50);
    const [sound, setSound] = useState(true);
    const [soundString, setSoundString] = useState("Sound ON");
    const [soundIcon, setSoundIcon] = useState("volume");
    const [fullScreen, setFullScreen] = useState(false);
    const [fullScreenString, setFullScreenString] = useState("Fullscreen OFF");
    const [fullScreenIcon, setFullScreenIcon] = useState("maximize");

    const eventOnSubmit = (event) => { event.preventDefault(); }
    useEffect(() => { 
        setLangs(availableLangs); 
    },[]);

    const handleVolume = (event) => {
        setVolume(prev => event.target.value); 
        sm.__set("volume", event.target.value);
        sm.save();
    }
    const handleLang = (event) => {
        i18n.changeLanguage(event.target.value);
        sm.__set("lang", event.target.value);
        sm.save();
    }
    const handleSound = (event) => {
        setSoundString((event.target.checked) ? "Sound ON" : "Sound OFF");
        setSoundIcon((event.target.checked) ? "volume" : "volume-slash");
        setSound(event.target.checked);
        sm.__set("sound", event.target.checked);
        sm.save();
    }
    const handleFullscreen = (event) => {
        if(event.target.checked){ document.documentElement.requestFullscreen(); }else{ document.exitFullscreen(); };
        setFullScreenString((event.target.checked) ? "Fullscreen ON" : "Fullscreen OFF");
        setFullScreenIcon((event.target.checked) ? "maximize" : "minimize");
        setFullScreen(event.target.checked);
        sm.__set("fullscreen", event.target.checked);
        sm.save();
    }

    return (
        <Modal show={show} dialogClassName='settingsModal' bsclass="my-modal">
            <Modal.Header>
                <ModalTitle>Settings</ModalTitle>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={eventOnSubmit}>
                    <Container>
                        <Row>
                            <Col md={{ span: 4, offset: 4}}>
                                <Form.Group className="mb-3">
                                    <label>Effect volume</label>
                                    <Form.Range name="volume" min={0} max={100} value={volume} onChange={handleVolume}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <label>Language</label>
                                    <Form.Select name="lang" value={i18n.language} onChange={handleLang}>
                                        {(langs.map((item,index) => ( <option value={item}>{getLangByCode(item)}</option> )))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4} className="text-center" >
                                            <FaIcon type="solid" icon={soundIcon} style={{color:"#fff"}}/><br/>
                                            <b className="switchLabel text-white">{soundString}</b><br/>
                                            <Form.Check type="switch" name="sound" checked={sound} onChange={handleSound}/>
                                        </Col>
                                        <Col md={4} className="text-center" >
                                            <FaIcon type="solid" icon={fullScreenIcon} style={{color:"#fff"}}/><br/>
                                            <b className="switchLabel text-white">{fullScreenString}</b><br/>
                                            <Form.Check type="switch" name="fullScreen" checked={fullScreen} onChange={handleFullscreen}/>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3" style={{textAlign: "center"}}>
                                    <Button onClick={handleClose} variant="off" className="login-button">Close</Button>
                                </Form.Group>
                            </Col>
                        </Row>                        
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Settings;