import React, { useState } from 'react';
import { Accordion, Button, ButtonGroup, ListGroup, ListGroupItem, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import BrandImage from '../../../Widgets/Global/BrandImage';
import FaIcon from '../../../Widgets/Global/FaIcon';


const PlusButtons = ({ path }) => {
    return (
        <>
            {(path === "/admin/tracks/list") && (<Button variant="outline-light" as={Link} to="/admin/tracks/add"><FaIcon type="solid" icon="plus" /> Pálya hozzáadása</Button>)}
            {(path === "/admin/tracks/add") && (<Button variant="outline-light" as={Link} to="/admin/tracks/list"><FaIcon type="solid" icon="times" /> Mégse</Button>)}
        </>
    );
}

const AdminNavbar = () => {
    const location = useLocation();
    const [show,setShow] = useState(false);
    const handleShow = () => { setShow(!show); };
    return (
        <>
            <ButtonGroup style={{position:'absolute',left:'15px',top:'15px'}}>
                <Button variant="outline-light" onClick={handleShow}><FaIcon type="solid" icon="bars" /></Button>
                <Button variant="outline-light" as={Link} to="/start"><FaIcon type="solid" icon="globe" /></Button>
                <PlusButtons path={location.pathname} />
            </ButtonGroup>
            <Offcanvas className="adminOffCanvas" data-bs-theme="dark" show={show} onHide={handleShow}>
                <Offcanvas.Header closeButton>
                    <BrandImage style={{width:'clamp(25px,100%,175px)'}}/>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Accordion>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <Button onClick={handleShow} as={Link} to="/admin" variant="off" type="button" aria-expanded="false" className="accordion-button collapsed simple">
                                    <FaIcon type="solid" icon="cogs" style={{paddingRight:'10px'}}/> Admin Főoldal
                                </Button>
                            </h2>
                        </div>                        
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><FaIcon type="solid" icon="route" style={{paddingRight:'10px'}}/> Pályák</Accordion.Header>
                            <Accordion.Body as={ListGroup}>
                                <ListGroupItem onClick={handleShow} as={Link} to="/admin/tracks/list"><FaIcon type="solid" icon="list" />  Lista</ListGroupItem>
                                <ListGroupItem onClick={handleShow} as={Link} to="/admin/tracks/add"><FaIcon type="solid" icon="plus" />  Új pálya</ListGroupItem>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AdminNavbar;