import React from 'react';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Button, Carousel, Container } from 'react-bootstrap';
import BrandImage from '../Global/BrandImage';
import { Link } from 'react-router-dom';

const SectonHero = () => {
    const { t, i18n } = useTranslation();
    return (
        <Container fluid>
            <Carousel controls={false} indicators={false}>
                <Carousel.Item>
                    <img className="d-block w-100 animZoom anim-60 anim-ease anim-infinite fade-bottom-to-site" src="images/wallpaper.jpg" alt="Slide 0" />
                    <Carousel.Caption>
                        <div className="carousel-caption-content">
                            <BrandImage />
                            <p className="oswald oswald-200 size-64" dangerouslySetInnerHTML={{ __html: t('exploreworld')}}></p>
                            <p className="oswald oswald-200 size-24" dangerouslySetInnerHTML={{ __html: t('pageSubTitle')}}></p>
                            <Button size="lg" className="register-button" as={Link} to="/register">{t('register')}</Button>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default SectonHero;