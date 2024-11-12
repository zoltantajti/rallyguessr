import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const PlaceholderIndicator = ({ color, width, height }) => {
    return (
        <TailSpin style={{display:'block',textAlign:'center'}} color={color} height={width} width={height} />
    );
};

export default PlaceholderIndicator;