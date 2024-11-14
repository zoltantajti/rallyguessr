import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FaIcon from './FaIcon';

const BackButton = () => {
    return (
        <Button as={Link} to="/start" variant="secondary" className="login-button back-button">
            <FaIcon type="solid" icon="arrow-left" />
        </Button>
    );
};

export default BackButton;