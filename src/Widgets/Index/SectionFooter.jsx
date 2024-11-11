import React from 'react';
import { Link } from 'react-router-dom';

const SectionFooter = () => {
    return (
        <div className="footer text-center">
            <Link to="/privacy">Privacy</Link> | <Link to="/terms">Terms</Link>
        </div>
    );
};

export default SectionFooter;