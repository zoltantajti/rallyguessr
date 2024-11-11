import React, { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import BrandImage from '../../Widgets/Global/BrandImage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../Utils/Firebase';
import { applyActionCode } from 'firebase/auth';

const Activate = () => {
    const { t, i18next } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        variant: '',
        text: ''
    });

    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const oobCode = queryParams.get('oobCode');
    
    useEffect(() => {
        applyActionCode(auth, oobCode)
            .then(async () => {
                const user = auth.currentUser;
                setState({
                    variant: 'success',
                    text: t('act_successful')
                });
            })
            .catch((err) => {
                setState({
                    variant: 'danger',
                    text: t(err.code)
                });
            })
        
    },[location]);
    
    
    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang /></div>
            <Row style={{zIndex: 2, backdropFilter:'blur(5px)', padding: '25px'}}>
                <Col>
                    <BrandImage style={{ width: '320px' }} className="mb-3"/>
                    <Alert variant={state.variant}>
                        <span dangerouslySetInnerHTML={{ __html: t(state.text) }} />
                    </Alert>
                    <Button className="d-block w-100 mb-3" as={Link} to="/login" variant="success">
                        {t('login')}
                    </Button>
                    <ButtonGroup className="w-100">
                        <Button className="d-block w-100" as={Link} to="/register" variant="secondary">{t('register2')}</Button>
                        <Button className="d-block w-100" as={Link} to="/lostpassword" variant="secondary">{t('lostpassw')}</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            
        </div>
    );
};

export default Activate;