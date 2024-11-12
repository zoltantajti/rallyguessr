import React, { useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { checkImageIsAllowed } from '../../Utils/Utils';
import axios from 'axios';
import { imageToB64 } from '../../Utils/ImageHandler';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';
import { UserModel } from '../../Datas/Models/UserModel';


const AvatarUploadModal = ({ show, handleClose}) => {
    const user = UserModel.load();
    const avatarRef = useRef();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [b64, setB64] = useState('');
    const [error, setError] = useState(false);

    const handleFieldClick = () => {
        if(avatarRef.current){ 
            setError(false); 
            avatarRef.current.click(); 
        };
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file && checkImageIsAllowed(file)) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { 
                setPreview(reader.result); 
                setB64(reader.result);
            };
            reader.readAsDataURL(file);
        }else{
            setError("A filetípus nem engedélyezett!");
        }
    }

    const onSubmitEvent = async (event) => {
        event.preventDefault();
        console.log("Filename: ", file);
        console.log("b64: ", b64);
        
        const userRef = doc(db,"users",user.__get('uid'));
        updateDoc(userRef, {avatar: b64}).then((data) =>
        {
            user.__set('avatar', b64);
            user.save();
            handleClose();
        })
    }
    
    return (
        <Modal className="custom-modal" show={show} onHide={handleClose}>
            <Modal.Body className="text-center">
                <div className="modalTitle">Válassz új avatart!</div>
                <Form onSubmit={onSubmitEvent}>
                    {(error) && (<span className="error2">{error}</span>)}
                    <div className="text-center upload-circle-base mb-5">
                        <div className="upload-circle" onClick={handleFieldClick}>
                            {preview ? (
                                <img src={preview} alt="Preview" className="preview-image" />
                            ) : (
                                <>
                                    Képfeltöltés
                                </>
                            )}
                            <Form.Control ref={avatarRef}  type="file" name="avatar" style={{display:'none'}} onChange={handleFileChange}/>
                        </div>
                    </div>
                    <Row>
                        <Col md={6} className="text-center">
                            <Button variant="off" type="submit" className="register-button">Mentés</Button>
                        </Col>
                        <Col md={6} className="text-center">
                            <Button variant="off" onClick={handleClose} className="login-button">Mégse</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AvatarUploadModal;