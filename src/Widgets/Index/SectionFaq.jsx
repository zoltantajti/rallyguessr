import React from 'react';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Accordion, Col, Container, Row } from 'react-bootstrap';

const SectionFAQ = () => {
    const { t, i18next } = useTranslation();

    const faq = [
        { q: t('whatisthis'), a: t('whatisthisText') },
        { q: t('itisfree'), a: t('itisfreeText') },
        { q: t('itavailableonMobile'), a: t('itavailableonMobileText') },
        { q: t('availableLanguages'), a: t('availableLanguagesText') }
    ];

    return (
        <Container className="mt-15">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <div className="sectionTitle-frame mb-3">
                        <span className="sectionTitle oswald-700">{t('faqTitle')}</span>
                        <div className="sectionBars"></div>
                    </div>
                    <Accordion className="mb-5">
                        {faq.map((item, index) => (
                            <Accordion.Item eventKey={index} key={index}>
                                <Accordion.Header>{item.q}</Accordion.Header>
                                <Accordion.Body dangerouslySetInnerHTML={{ __html: item.a }}></Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};

export default SectionFAQ;