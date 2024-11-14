import React, { useEffect, useRef, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { formatPlayTime } from '../../Utils/Localization';
import { playLoop, playSound, stopLoop } from '../../Utils/audio';

const MapTime = ({ time }) => {
    const timerRef = useRef(null);
    const [animClass, setAnimClass] = useState(false);
    useEffect(() => {
        if(time === 10){ setAnimClass("anim"); };
        if(time <= 10){ playSound("tenSeconds"); };
    });
    return (
        <Badge bg="off" className={`timeAlert ${animClass}`} size="lg" style={{position:'absolute',top:'0px',left:'50%',transform:'translate(-50%)',width:'145px',borderTopLeftRadius:0,borderTopRightRadius:0}}>
            <span className="rallySymbol size-50" style={{fontWeight:"100"}}>t</span>
            <span className="size-46">{formatPlayTime(time)}</span>
        </Badge>
    );
};

export default MapTime;