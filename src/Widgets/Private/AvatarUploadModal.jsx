import React, { useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { checkImageIsAllowed } from '../../Utils/Utils';


const AvatarUploadModal = ({ show, handleClose}) => {
    //const user = MyStorage.local.get('user');
    const avatarRef = useRef();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
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
            console.log(file);
            const reader = new FileReader();
            reader.onloadend = () => { 
                setPreview(reader.result); 
            };
            reader.readAsDataURL(file);
        }else{
            setError("A filetípus nem engedélyezett!");
        }
    }

    const onSubmitEvent = async (event) => {
        event.preventDefault();
       
        /*const formData = new FormData();
        formData.append("file", file);
        formData.append("id", user.id);
        await client.post('/uploadAvatar', formData, (data) => {
            user['avatar'] = data.file;
            MyStorage.local.put('user', user);
            handleClose();
        },MyStorage.local.get('token'));*/
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