import React, { useState } from 'react';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BrandImage from './BrandImage';
import { getLangByCode } from '../../Utils/Localization';
import FaIcon from './FaIcon';


const TopBar = ({ showBackButton }) => {
    const { t, i18n } = useTranslation();
    const [langs, setLangs] = useState(["hu","en"]);

    const setLang = (target) => { 
        i18n.changeLanguage(target); 
    };

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="topBar">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{width:'clamp(75px,100%,125px)'}}>
                    <BrandImage className="d-inline-block align-top" style={{width:'clamp(75px,100%,125px)'}}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {(showBackButton) && (<Nav.Link as={Link} to="/" className="login-button">
                            <FaIcon type="solid" icon="arrow-left" />    
                        </Nav.Link>)}
                    </Nav>
                    <Nav className="ms-auto">
                        <NavDropdown title={<span dangerouslySetInnerHTML={{ __html: getLangByCode(i18n.language, true) }}></span>} id="basic-nav-dropdown">
                            {(langs.map((item,index) => (
                                <NavDropdown.Item key={index} as={Button} onClick={() => setLang(item)}>
                                    <span dangerouslySetInnerHTML={{ __html: getLangByCode(item, true) }}></span>
                                </NavDropdown.Item>
                            )))}
                        </NavDropdown>
                        <Nav.Link as={Link} to="login" className="login-button">{t('login')}</Nav.Link>
                        <Nav.Link as={Link} to="register" className="register-button">{t('register')}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopBar;