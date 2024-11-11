import React from 'react';
import TopBar from '../Widgets/Global/TopBar';
import { Container } from 'react-bootstrap';

const Privacy = () => {
    return (
        <>
            <TopBar showBackButton={true}/>
            <Container style={{color:"#fff",marginTop:"25px"}}>
                <h3 className='oswald oswald-700 text-center'>Privacy Statement</h3>
                <div className="privacy-content-box">
                    <p>Ez a sample box a privacyhoz</p>
                </div>
            </Container>
        </>
    );
};

export default Privacy;