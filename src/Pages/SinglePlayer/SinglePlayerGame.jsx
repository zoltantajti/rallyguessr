import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useLocation } from 'react-router-dom';
import GameMap from '../../Widgets/Game/GameMap';
import GameStreetView from '../../Widgets/Game/GameStreetView';

const SinglePlayerGame = () => {
    const location = useLocation();
    const data = location.state.pos;
    const current = location.state.image;
    const max = location.state.max;
    const topic = location.state.topic;
    const gm = location.state.gm;

    useEffect(() => {trackPromise(new Promise((resolve) => { setTimeout(() => { resolve("OK"); }, 500)}));},[data]);

    return (
        <>
            <GameStreetView pos={data} />
            <GameMap pos={data} current={current} max={max} topic={topic} gm={gm} />
        </>
    );
};

export default SinglePlayerGame;