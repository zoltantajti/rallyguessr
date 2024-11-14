import React, { useEffect, useState } from 'react';
import { Navbar, Button, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BrandImage from './BrandImage';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { getLangByCode } from '../../Utils/Localization';
import { availableLangs } from '../../i18n';

const SwitchLang = ({ onlyBrandImage }) => {
    const { t, i18n } = useTranslation();
    const [langs, setLangs] = useState(["hu","en"]);
    
    useEffect(() => {
        setLangs(availableLangs);
    },[]);

    const setLang = (target) => { 
        i18n.changeLanguage(target); 
    };
    

    return (
        <Navbar expand={false} className="topBar" style={{color:'#ffffff'}}>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <BrandImage className="d-inline-block align-top" style={{width:'clamp(75px,100%,125px)'}}/>
                </Navbar.Brand>
                {/*<Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">*/}
                    {(!onlyBrandImage) && (<Nav className="ms-auto">
                        <NavDropdown title={<span style={{color:"#ffffff"}} dangerouslySetInnerHTML={{ __html: getLangByCode(i18n.language, true) }}></span>} id="basic-nav-dropdown">
                            {(langs.map((item,index) => (
                                <NavDropdown.Item as={Button} onClick={() => setLang(item)}>
                                    <span style={{color:"#ffffff"}} dangerouslySetInnerHTML={{ __html: getLangByCode(item, true) }}></span>
                                </NavDropdown.Item>
                            )))}
                        </NavDropdown>
                    </Nav>)}
                {/*</Navbar.Collapse>*/}
            </Container>
        </Navbar>
    );
};

export default SwitchLang;