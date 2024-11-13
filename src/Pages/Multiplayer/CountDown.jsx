import React, { useEffect, useState } from 'react';

const CountDown = ({ value, duration = 1000 }) => {
    const [initVal, setInitVal] = useState(0);
    const [currentValue, setCurrentvalue] = useState(0);

    useEffect(() => {
        setInitVal(value);
        setCurrentvalue(value);
    }, []);

    useEffect(() => {
        const diff = initVal - value;
        const stepTime = duration / diff;
        const timer = setInterval(() => {
            setCurrentvalue((prevValue) => {
                if (prevValue == value) { clearInterval(timer); return value; };
                return prevValue > value ? prevValue - 1 : prevValue + 1;
            });
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);

    return currentValue;
};

export default CountDown;