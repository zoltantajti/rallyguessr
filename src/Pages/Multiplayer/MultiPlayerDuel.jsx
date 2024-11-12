import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useLocation } from 'react-router-dom';

const MultiPlayerDuel = () => {
    const location = useLocation();
    const lobby = location.state.lobby;

    console.log(lobby);

    return (
        <>
        </>
    )
}

export default MultiPlayerDuel;