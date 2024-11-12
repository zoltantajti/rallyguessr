import React, { useEffect, useState } from 'react';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import AvatarUploadModal from '../../Widgets/Private/AvatarUploadModal';
import { countries } from '../../Datas/Countries';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { UserModel } from '../../Datas/Models/UserModel';
import { auth, db } from '../../Utils/Firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const Account = () => {
    const { t, i18n } = useTranslation();
    const user = UserModel.load();
    const [state, setState] = useState({
        fields: {
            avatar: '',
            username: '',
            country: '',
            old_password: '',
            new_password: '',
            new_password_rep: ''
        }
    });
    /*Globals*/
    const fillStateFromUser = (_user = false) => {
        if (!_user) _user = user;
        let fields = state.fields;
        fields['avatar'] = _user.__get('avatar');
        fields['username'] = _user.__get('username');
        fields['country'] = _user.__get('country') || "N/A";
        setState({ ...state, fields });
    }
    const changeField = (event) => {
        const { name, value } = event.target;
        setState((prev) => ({
            ...prev, fields: {
                ...prev.fields, [name]: value
            }
        }));
    }
    useEffect(() => {
        fillStateFromUser();
    }, []);
    /*Modal upload handler*/
    const [uploadModal, setUploadModal] = useState(false);
    const uploadModalHandleClose = () => {
        setUploadModal(false);
        const _u = UserModel.load();
        fillStateFromUser(_u);        
    };
    /*Nickname and Country handler*/
    const [nickToggler, setNickToggler] = useState(false);
    const handleNickAndCountryToggler = () => { setNickToggler(!nickToggler); }
    const nicknameSubmitHandler = async (event) => {
        event.preventDefault();
        await updateProfile(auth.currentUser, { displayName: state.fields.username});
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { 
            country: state.fields.country,
            username: state.fields.username        
        });
        user.__set('username', state.fields.username);
        user.__set('country', state.fields.country);
        fillStateFromUser();
        handleNickAndCountryToggler();
    }
    /*PasswordChanger*/
    const [passwordToggler, setPasswordToggler] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const handlePasswordToggler = () => { setPasswordToggler(!passwordToggler); };
    const passwordSubmitHandler = (event) => {
        event.preventDefault();
        updatePassword(auth.currentUser, state.fields.new_password).then(() => {
            setState(prev => ({
                ...prev.fields,
                old_password: '',
                new_password: '',
                new_password_rep: ''
            }));
            handlePasswordToggler();
        });
    };

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox user={user} />
                <Container style={{ marginTop: '15px' }}>
                    <Row>
                        <Col className="text-center">
                            <h3 className="title">{t('btn_myProfile')}</h3>
                            <img src={state.fields.avatar} style={{ width: '100px', height: '100px', objectFit: 'cover', backgroundColor: '#fff', borderRadius: '50px' }} onClick={() => { setUploadModal(true); }} alt="Avatar" />
                        </Col>
                    </Row>
                    {/*Profil adatok (Becenév és ország)*/}
                    <Row className="mb-5">
                        <Col className="text-left">
                            <div className="sectionTitle-frame mb-3">
                                <span className="sectionTitle oswald-700">{t('profile_details')}</span>
                                <div className="sectionBars"></div>
                            </div>
                            {(!nickToggler) ? (
                                <Row>
                                    <Col md={4} xs={12}>
                                        <span className="sectionTitle oswald-700">{t('username')}</span><br />
                                        <span className="sectionTitle color-white oswald-700">{state.fields.username}</span>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <span className="sectionTitle oswald-700">{t('country')}</span><br />
                                        <span className="sectionTitle color-white oswald-700">
                                            {state.fields.country}
                                            {(state.fields.country !== "N/A") && (<img style={{ position: 'relative', top: '-1px', left: '5px' }} src={`https://flagsapi.com/${state.fields.country}/shiny/24.png`} alt="flag" />)}
                                        </span>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Button variant="outline-light" onClick={handleNickAndCountryToggler}>{t('btn_change')}</Button>
                                    </Col>
                                </Row>
                            ) : (
                                <Form onSubmit={nicknameSubmitHandler}>
                                    <Row>
                                        <Col md={4} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('username')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">
                                                <Form.Control type="text" name="username" value={state.fields.username} onChange={changeField} />
                                            </span>
                                        </Col>
                                        <Col md={4} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('country')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">
                                                <Form.Select name="country" onChange={changeField}>
                                                    {(countries.map((item, index) => (
                                                        <option value={item.code} selected={(item.code === state.fields.country)}>{item.name}</option>
                                                    )))}
                                                </Form.Select>
                                            </span>
                                        </Col>
                                        <Col md={4} xs={12}>
                                            <Button variant="outline-light" onClick={handleNickAndCountryToggler}>{t('btn_cancel')}</Button>
                                            <Button style={{ marginLeft: '5px' }} variant="off" className="register-button" type="submit">{t('btn_save')}</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Col>
                    </Row>

                    {/*Jelszómódosítás*/}
                    <Row>
                        <Col className="text-left">
                            <div className="sectionTitle-frame mb-3">
                                <span className="sectionTitle oswald-700">{t('profile_password')}</span>
                                <div className="sectionBars"></div>
                            </div>
                            {(!passwordToggler) ? (
                                <>
                                    {(passwordError) && (<span className="success" onClick={() => setPasswordError(false)}>{t(passwordError)}</span>)}
                                    <Row>
                                        <Col md={4} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('password')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">********</span>
                                        </Col>
                                        <Col md={4} xs={12}>
                                            <Button variant="outline-light" onClick={handlePasswordToggler}>{t('btn_change')}</Button>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <Form onSubmit={passwordSubmitHandler}>
                                    {(passwordError) && (<span className="error2" onClick={() => setPasswordError(false)}>{t(passwordError)}</span>)}
                                    <Row>
                                        <Col md={3} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('password')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">
                                                <Form.Control type="password" name="old_password" value={state.fields.old_password} onChange={changeField} />
                                            </span>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('password')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">
                                                <Form.Control type="password" name="new_password" value={state.fields.new_password} onChange={changeField} />
                                            </span>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <span className="sectionTitle oswald-700">{t('password')}</span><br />
                                            <span className="sectionTitle color-white oswald-700">
                                                <Form.Control type="password" name="new_password_rep" value={state.fields.new_password_rep} onChange={changeField} />
                                            </span>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <Button variant="outline-light" onClick={handlePasswordToggler}>{t('btn_cancel')}</Button>
                                            <Button style={{ marginLeft: '5px' }} variant="off" className="register-button" type="submit">{t('btn_save')}</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            {/*Widgetek*/}
            {(uploadModal) && (<AvatarUploadModal show={uploadModal} handleClose={uploadModalHandleClose} />)}
        </div>
    );
};

export default Account;