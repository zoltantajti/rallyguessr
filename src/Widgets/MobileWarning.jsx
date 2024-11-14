import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import BrandImage from './Global/BrandImage';

const MobileWarning = () => {
    return (
        <Container style={{paddingTop: "50px"}}>
            <Row>
                <Col className="text-center">
                    <BrandImage style={{width:"90%"}} className="mb-5"/>
                    <h1 className="oswald color-yellow oswald-700 mb-5">A Mobilnézet nem érhető el!</h1>
                    <p className="color-white">
                        Kérlek, látogass vissza később, vagy próbáld meg asztali számítógépen megtekinteni a weboldalt!
                    </p>
                    <img src="images/skodafabiar5evo2.png" className="img-responsive" style={{maxWidth: '100%'}} alt="SkodaR5EVO2"/>
                </Col>
            </Row>

        </Container>
    );
};

export default MobileWarning;