import React, { useRef, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import BrandImage from '../../Widgets/Global/BrandImage';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, signInWithFacebookPopUp, signInWithGooglePopUp } from '../../Utils/Firebase';
import { validateLoginForm } from '../../Utils/Validate';
import FormErrorMessage from '../../Widgets/Global/FormErrorMessage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserModel } from '../../Datas/Models/UserModel';

const Login = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [input, setInput] = useState({email: "",password: ""});
    const [errors, setErrors] = useState(false);
    const [success] = useState(false);
    const emailRef = useRef();
    const passwRef = useRef();

    const handleInput = (e) => {
        const {name,value} = e.target;
        setInput((prev) => ({...prev, [name] : value}));
    };
    
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        var payload = validateLoginForm(input);
        if(payload.success){
            signInWithEmailAndPassword(auth, input.email, input.password)
            .then(async (userCredential) => {
                if(userCredential.user.emailVerified){
                    const user = userCredential.user;
                    const docRef = doc(db, "users", user.uid);
                    let docSnap = await getDoc(docRef);
                    const data = docSnap.data();
                    const userInstance = new UserModel(
                        user.uid,
                        user.displayName,
                        user.email,
                        data.avatar,
                        data.country,
                        data.credits,
                        data.exp,
                        data.level,
                        data.perm
                    );
                    userInstance.save();
    
                    navigate("/start");
                }else{
                    auth.signOut();
                    setErrors({form: "auth/unverified"});
                }
            })
            .catch((err) => {
                console.log(err.code, err.message);
                setErrors({form: err.code});
            })
        }else{
            const errors = payload.errors;
            setErrors(errors);
        };
    }
    const loginWithProvider = async (provider) => {
        try{
            const response = (provider === "Google") ? await signInWithGooglePopUp() : await signInWithFacebookPopUp();
            if(response.user){
                const user = response.user;
                const id = user.uid;
                const docRef = doc(db, "users", id);
                let docSnap = await getDoc(docRef);
                if(!docSnap.exists){
                    await setDoc(docRef, {
                        avatar: '/images/noavatar.png',
                        perm: 1,
                        level: 1,
                        exp: 1,
                        credits: 0,
                        country: "N/A"
                    });
                    docSnap = await getDoc(docRef);
                };
                const data = docSnap.data();
                const userInstance = new UserModel(
                    user.uid,
                    user.displayName,
                    user.email,
                    data.avatar,
                    data.country,
                    data.credits,
                    data.exp,
                    data.level,
                    data.perm
                );
                userInstance.save();
                navigate("/start");
            }
        }catch(err){
            console.log(err);
        };
    }


    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang /></div>
            <Row style={{zIndex: 2, backdropFilter:'blur(5px)', padding: '25px'}}>
                <Col>
                    <BrandImage style={{ width: '320px' }} className="mb-3"/>
                    <Form onSubmit={handleSubmitEvent}>
                        {(errors?.form) && (<Alert onClick={() => setErrors(false)}  variant={(success) ? 'success' : 'danger'} ><span dangerouslySetInnerHTML={{ __html: t(errors.form) }} /></Alert>)}
                        <FloatingLabel controlId='email' label={t('email')} className="mb-3">
                            <Form.Control ref={emailRef} type="email" placeholder={t('email')} name="email" value={input.email} onChange={handleInput} />
                            <FormErrorMessage error={errors?.email} target={emailRef}/>
                        </FloatingLabel>
                        <FloatingLabel controlId='password' label={t('password')} className="mb-3">
                            <Form.Control ref={passwRef} type="password" placeholder={t('password')} name="password" value={input.password} onChange={handleInput} />
                            <FormErrorMessage error={errors?.password} target={passwRef}/>
                        </FloatingLabel>
                        <Button className="d-block w-100 mb-3" type="submit" variant="success">
                            {t('login')}
                        </Button>
                        <Button className="d-block w-100 mb-3" onClick={() => {loginWithProvider("Google")}} variant="light">
                            {t('loginWithGoogle')}
                        </Button>
                        <Button className="d-block w-100 mb-3" onClick={() => {loginWithProvider("Facebook")}} variant="light">
                            {t('loginWithFacebook')}
                        </Button>
                        <ButtonGroup className="w-100">
                            <Button className="d-block w-100" as={Link} to="/register" variant="secondary">{t('register2')}</Button>
                            <Button className="d-block w-100" as={Link} to="/lostpassword" variant="secondary">{t('lostpassw')}</Button>
                        </ButtonGroup>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Login;