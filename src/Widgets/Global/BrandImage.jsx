import React from 'react';

const BrandImage = ({ className, style}) => {
    return (
        <img src='/images/brandImage.png' className={className} style={style} alt="Logo" />
    );
};

export default BrandImage;