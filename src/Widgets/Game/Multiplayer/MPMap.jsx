import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import FaIcon from '../../Global/FaIcon';
import MPMapScores from './MPMapScores';
import { icons } from '../../../Datas/MarkerIcons';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const MPMap = forwardRef(({ callback }, ref) => {
    const { t, i18next } = useTranslation();
    const mapRef = useRef(null);
    useImperativeHandle(ref, () => ({
        OppentMap, clearMap
    }))
    
    
    const [hasResult, setHasResult] = useState(false);
    const [mapState, setMapState] = useState(false);
    const toggleMap = () => { setMapState(!mapState); }
    useEffect(() => {
        let style = document.getElementById('guessrMap').style;
        let button = document.getElementById('toggleMapButton').style;
        if(!hasResult){
            if(mapState){
                style.height = "600px";
                style.width = "600px";
                button.bottom = "600px";
                button.left = "calc(600px - 42px)";
            }else{
                style.height = "200px";
                style.width = "200px";
                button.bottom = "200px";
                button.left = "calc(200px - 42px)";
            };  
        }else{
            style.height = "calc(100vh)";
            style.width = "calc(100vw)";
        }
    },[mapState,hasResult]);

    /*GuessrMap*/
    const [markedPos, setMarkedPos] = useState(false);
    const oppentMarkerRef = useRef(false);
    const clearMap = () => {
        if(mapRef.current.hasLayer(oppentMarkerRef.current)) { mapRef.current.removeLayer(oppentMarkerRef.current); };
        setMarkedPos(false);
    }
    const GuessMap = () => {
        useMapEvents({
            click(e){ 
                setMarkedPos(e.latlng); 
            }
        });
        return markedPos ? <Marker icon={icons.default} position={markedPos} /> : null;
    }
    const OppentMap = (c) => {
        try{
            c = JSON.parse(c);
            if(oppentMarkerRef.current !== false) {mapRef.current.removeLayer(oppentMarkerRef.current); oppentMarkerRef.current = false; }
            if(c && c.lat !== undefined && c.lng !== undefined){
                let m = L.marker([c.lat, c.lng], {icon: icons.default}).addTo(mapRef.current);
                oppentMarkerRef.current = m;
            };
        }catch(e){
            console.log(e);
        };
        return null;
    }

    /*SubmitCoords*/
    const submitCoords = () => { callback(markedPos); }

    return (
        <>
            <Button style={{ position: 'absolute', bottom: '200px', left: 'calc(200px - 42px)', borderRadius: 0, zIndex:6 }} onClick={toggleMap} variant="light" className="guessrButton" id="toggleMapButton"><FaIcon type="solid" icon="arrows-maximize" /></Button>
            {(markedPos) && ( <Button style={{position:'absolute',bottom:'35px',left:'300px',zIndex:9,transform:'translateX(-50%)'}} variant="off" className="register-button" onClick={submitCoords} >{t('duel_submitCoords')}</Button> )}
            <MapContainer
                ref={mapRef}
                center={[48.647458, 15.907382]}
                zoom={5}
                style={{
                    width: '200px',
                    height: '200px',
                    position: 'absolute',
                    bottom: '0px',
                    left: '0px',
                    zIndex: 6
                }}
                id="guessrMap"
                className="guessrMap"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                <ChangeMapView hasResult={hasResult} mapState={mapState} center={[48.647458, 15.907382]} zoom={5}/>
                <GuessMap />
            </MapContainer> 
        </>
    );
});

const ChangeMapView = memo(({ mapState, hasResult, center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            try{
                map.invalidateSize();
                if(!hasResult) map.flyTo(center, zoom);
            }catch(e){};
        }, 550);        
    },[map, mapState, hasResult])  
});

export default MPMap;