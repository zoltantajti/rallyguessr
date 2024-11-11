import React from 'react';
import "../../i18n";
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Ads from '../Global/Ads';

const SectionInfos = () => {
    const { t, i18next } = useTranslation();

    return (
        <Container style={{paddingTop: '15px'}}>
            <Row>
                <Col md={{ span:8, offset: 2}}><Ads /></Col>
            </Row>
            <Row>
                <Col md={{span: 8, offset: 2}}>
                    <Row className="info-frame">
                        <Col md={{order: 1, span: 7}} xs={{ order: 2}} className="text-center">
                            <div className="caption caption-title" dangerouslySetInnerHTML={{ __html: t('exploreworld')}}></div>
                            <div className="caption caption-text" dangerouslySetInnerHTML={{ __html: t('pageSubTitle')}}></div>
                        </Col>
                        <Col md={{order: 2, span: 5}} xs={{ order: 1}} className="text-center">
                            <div className="caption-image-wrapper">
                                <img src="images/infos_01.jpg" alt="info01" className="caption-image"/>
                            </div>
                        </Col>
                    </Row>
                    <Row className="info-frame">
                        <Col md={{order: 1, span: 4}} xs={{ order: 1}} className="text-center">
                            <div className="caption-image-wrapper">
                                <img src="images/podium.jpg" alt="info01" className="caption-image"/>
                            </div>
                        </Col>
                        <Col md={{order: 1, span: 8}} xs={{ order: 2}} className="text-center">
                            <div className="caption caption-title" dangerouslySetInnerHTML={{ __html: t('bealeader')}}></div>
                            <div className="caption caption-text" dangerouslySetInnerHTML={{ __html: t('bealeaderText')}}></div>
                        </Col>                        
                    </Row>
                    <Row className="info-frame">
                        <Col md={{order: 1, span: 7}} xs={{ order: 2}} className="text-center">
                            <div className="caption caption-title" dangerouslySetInnerHTML={{ __html: t('flylikepilot')}}></div>
                            <div className="caption caption-text" dangerouslySetInnerHTML={{ __html: t('flylikepilotText')}}></div>
                        </Col>
                        <Col md={{order: 2, span: 5}} xs={{ order: 1}} className="text-center">
                            <div className="caption-image-wrapper">
                                <img src="images/skodafabiar5evo2.jpg" alt="info01" className="caption-image"/>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default SectionInfos;