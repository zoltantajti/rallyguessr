import React, { useRef, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import BrandImage from '../../Widgets/Global/BrandImage';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db} from '../../Utils/Firebase';
import { validateRegForm } from '../../Utils/Validate';
import FormErrorMessage from '../../Widgets/Global/FormErrorMessage';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const Register = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [input, setInput] = useState({email: "",password: "", password_rep: ""});
    const [errors, setErrors] = useState(false);
    const [success, setSuccess] = useState(false);
    const emailRef = useRef();
    const passwRef = useRef();
    const passwRepRef = useRef();

    const handleInput = (e) => {
        const {name,value} = e.target;
        setInput((prev) => ({...prev, [name] : value}));
        setErrors((prev) => ({...prev, [name] : ""}))
    };
    
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        setErrors(false);
        var payload = validateRegForm(input);
        if(payload.success){
            createUserWithEmailAndPassword(auth, input.email, input.password)
            .then(async (userCredential) => {
                await sendEmailVerification(userCredential.user);
                const docRef = await doc(db, "users", userCredential.user.uid);
                await setDoc(docRef, {
                    avatar: '/images/noavatar.png',
                    perm: 1,
                    level: 1,
                    exp: 1,
                    credits: 0,
                    country: "N/A"
                });
                setSuccess(true);
                setErrors({form: "reg_success"});
                setInput({email: "",password: "", password_rep: ""});
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

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang /></div>
            <Row style={{zIndex: 2, backdropFilter:'blur(5px)', padding: '25px'}}>
                <Col>
                    <BrandImage style={{ width: '320px' }} className="mb-3"/>
                    <Form onSubmit={handleSubmitEvent}>
                        {(errors?.form) && (<Alert onClick={() => setErrors(false)}  variant={(success) ? 'success' : 'danger'} ><span dangerouslySetInnerHTML={{ __html: t(errors.form) }} /></Alert>)}
                        <FloatingLabel controlId='email' label={t('email')} className="mb-3">
                            <Form.Control ref={emailRef} className={(errors?.email) ? 'is-invalid': ''} type="email" placeholder={t('email')} name="email" value={input.email} onChange={handleInput} />
                            <FormErrorMessage error={errors?.email} target={emailRef}/>
                        </FloatingLabel>
                        <FloatingLabel controlId='password' label={t('password')} className="mb-3">
                            <Form.Control ref={passwRef} className={(errors?.password_rep) ? 'is-invalid': ''} type="password" placeholder={t('password')} name="password" value={input.password} onChange={handleInput} />
                            <FormErrorMessage error={errors?.password} target={passwRef}/>
                        </FloatingLabel>
                        <FloatingLabel controlId='password_rep' label={t('password_rep')} className="mb-3">
                            <Form.Control ref={passwRepRef} className={(errors?.password_rep) ? 'is-invalid': ''} type="password" placeholder={t('password_rep')} name="password_rep" value={input.password_rep} onChange={handleInput} />
                            <FormErrorMessage error={errors?.password_rep} target={passwRepRef}/>
                        </FloatingLabel>
                        <Button className="d-block w-100 mb-3" type="submit" variant="success">
                            {t('register2')}
                        </Button>
                        <ButtonGroup className="w-100">
                            <Button className="d-block w-100" as={Link} to="/login" variant="secondary">{t('login')}</Button>
                            <Button className="d-block w-100" as={Link} to="/lostpassword" variant="secondary">{t('lostpassw')}</Button>
                        </ButtonGroup>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Register;