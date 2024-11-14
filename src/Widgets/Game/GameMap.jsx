import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import React, { useEffect, useRef, useState } from 'react';
import FaIcon from '../Global/FaIcon';
import { Badge, Button, Modal, ProgressBar } from 'react-bootstrap';
import MyStorage from '../../Utils/MyStorage';
import { calculateDistance, GenerateRandomCoord } from '../../Utils/GeoService';
import { getPointsByDistance } from '../../Utils/CalculatePoints';
import { trackPromise } from 'react-promise-tracker';
import { useNavigate } from 'react-router-dom';
import { calcPercent, calculateXP, getLevelID, getLevelMaxInMySkill } from '../../Datas/Levels';
import MapTime from './MapTime';
import { icons } from '../../Datas/MarkerIcons';
import { UserModel } from '../../Datas/Models/UserModel';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


const GameMap = ({ pos, current, max, topic, gm }) => {
    const { t, i18next } = useTranslation();
    const mapRef = useRef();
    const navigate = useNavigate();
    const [markedPos, setMarkedPos] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [newImage, setNewImage] = useState(false);
    const [finish, setFinish] = useState(false);
    const [overallPoint, setOverallPoint] = useState(0);
    const [prevXP, setPrevXP] = useState(0);
    const [claimedXP, setClaimedXP] = useState(0);
    const [xp, setXP] = useState(0);
    const [lvl, setLVL] = useState(0);
    const [mapTime, setMapTime] = useState(999);
    
    
    /*First load*/
    useEffect(() => {
        mapTimer();
        let overall = (MyStorage.local.get('overallPoint') !== null) ? MyStorage.local.get('overallPoint') : 0;
        setOverallPoint(overall);
    },[current]);
    
    /*MapTimer*/
    const interval = useRef(null);
    const mapTimer = () => {
        if (interval.current === null) {
            interval.current = setInterval(() => {
                setMapTime(prevTime => {
                    if (prevTime === 1) {
                        clearInterval(interval.current);
                        timeOutEvent();
                        return 0;
                    };
                    let nextTime = (prevTime - 1);
                    return nextTime;
                });
            }, 1000);
        };
    }
    const timeOutEvent = () => {
        MyStorage.session.put('overallPoint', parseInt(overallPoint) + 0);
    }

    /*ToggleMap*/
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

    /*Place map pin*/
    const GuessMap = () => {
        useMapEvents({
            click(e){ setMarkedPos(e.latlng); }
        });
        return markedPos ? <Marker icon={icons.default} position={markedPos} /> : null;
    }



    /*Submit coordinates*/    
    const [targetMarker, setTargetMarker] = useState(false);
    const [polyline, setPolyline] = useState(false);
    const submitCoords = (e) => {        
        clearInterval(interval.current);
        interval.current = null;
        let distance = calculateDistance(pos, markedPos);
        let points = getPointsByDistance(distance);
        let overall = parseInt(overallPoint) + parseInt(points);        
        MyStorage.local.put('overallPoint', overall);
        setOverallPoint(prev => overall);
        let _marker = L.marker([pos.lat, pos.lng], {icon: icons.finish}).addTo(mapRef.current);
        let _polyline = L.polyline([new L.LatLng(pos.lat, pos.lng), new L.LatLng(markedPos.lat, markedPos.lng)]).bindPopup(distance).openPopup().addTo(mapRef.current);
        setTargetMarker(_marker);
        setPolyline(_polyline);
        let cLat = (pos.lat + markedPos.lat) / 2;
        let cLng = (pos.lng + markedPos.lng) / 2;
        mapRef.current.flyTo(new L.LatLng(cLat, cLng));
        mapRef.current.fitBounds(new L.latLngBounds([pos, markedPos]));
        mapRef.current.off('click');
        if (current < max) {
            setNewImage(true);
            setTimeout(() => {
                try{
                    let nextImage = document.getElementById('nextImage');
                    nextImage.click();
                }catch(err){};
            },5000);
        } else {
            displayFinishResult();
        };
    }

    /*Next image*/
    const nextImage = (e) => {
        trackPromise(
            GenerateRandomCoord(topic)
                .then((data) => {
                    mapRef.current.removeLayer(targetMarker);
                    mapRef.current.removeLayer(polyline);
                    setNewImage(false);
                    setFinish(false);
                    setMarkedPos(false);
                    setMapTime(60);
                    setMapState(false);
                    setHasResult(false);
                    navigate(`/game/${gm}`, { state: { pos: data, image: (current + 1), max: max, topic: topic, gm: gm } });
                })
                .catch((err) => console.error(err))
        )
    }
    
    /*Finish Event*/
    const [pbValue, setPBValue] = useState(0);
    const [levelMax, setLevelMax] = useState(0);
    const finishEvent = async (e) => {
        const user = UserModel.load();
        //Add result
        await addDoc(collection(db,"results"), {
            uid: user.__get('uid'),
            gamemode: gm,
            topic: topic,
            imageCount: max,
            point: overallPoint, 
            date: new Date()
        });
        //Update user tábla
        const userRef = doc(db, "users", user.__get('uid'));
        updateDoc(userRef, {
            exp: xp,
            level: lvl
        });
        
        user.__set('exp', xp);
        user.__set('level', lvl);
        user.save();

        navigate('/scoreboard', { state: { topic: topic } });
    }

    
    const displayFinishResult = () => {
        setFinish(true);
        let user = UserModel.load();
        let prevExp = user.__get('exp');
        let claimExp = calculateXP(overallPoint);
        let _xp = (parseInt(prevExp) + parseInt(claimExp)).toFixed(0);
        let level = getLevelID(_xp);
        setLevelMax(getLevelMaxInMySkill(_xp));
        let percent = calcPercent(_xp, getLevelMaxInMySkill(_xp));
        
        //console.log("prevXP:", prevExp, "claimedXP:", claimExp, "currXP:", _xp, "Level:", level, "percent:", percent);
        
        setXP(_xp);
        setPBValue(percent);
        setLVL(level);
    }

    /*Renderer*/
    return (
        <>
            <Button style={{ position: 'absolute', bottom: '200px', left: 'calc(200px - 42px)', borderRadius: 0, zIndex:6 }} onClick={toggleMap} variant="light" className="guessrButton" id="toggleMapButton"><FaIcon type="solid" icon="arrows-maximize" /></Button>
            {markedPos && !newImage && !finish && (
                <Button style={{position:'absolute',bottom:'35px',left:'300px',zIndex:9,transform:'translateX(-50%)'}} variant="off" className="register-button" onClick={submitCoords} >{t('duel_submitCoords')}</Button>
            )}
            {markedPos && newImage && !finish && (
                <Button id="nextImage" style={{position:'absolute',bottom:'35px',left:'50%',right:'50%',transform:'translateX(-50%)',zIndex:9,width:'125px'}} variant="off" className="register-button" onClick={nextImage} >{t('btn_next')}</Button>
            )}
            {(finish) && (
                <Modal className="resultModal" show={finish} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body className="text-center">
                    <div className="text-center oswald oswald-700 size-24 color-yellow">{t('sp_endOfThegame')}!</div>
                    {t('sp_totalPoints')}: <b className="color-yellow">{overallPoint} {t('sboard_pts').toLowerCase()}</b><br/>
                    XP: <b className="color-yellow">{xp}</b><br/>
                    <ProgressBar now={pbValue} label={`${xp} / ${levelMax}`} style={{marginBottom:'50px',marginTop:'10px'}} variant="success"/>
                    <Button id="finishButton" style={{position:'absolute',bottom:'12px',left:'50%',right:'50%',transform:'translateX(-50%)',zIndex:9,width:'75px'}} variant="off" className="register-button" onClick={finishEvent} >{t('btn_finish')}</Button>
                </Modal.Body>
            </Modal>
            )}
            <MapTime time={mapTime} style={{position:'absolute',top:'0px',right:'50%',left:'50%',transform:'translateX(-50%)',zIndex:7,width:"120px",borderTopLeftRadius:0,borderTopRightRadius:0}}/>
            <Badge bg="secondary" style={{position:'absolute',top:'0px',right:'0px',zIndex:7,borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomRightRadius:0,paddingTop:'10px',paddingBottom:'10px',paddingLeft:'25px',paddingRight:'25px'}}>
                <div className="oswald oswald-500 size-16">{t('sp_round')}</div>
                <div className="oswald oswald-700 size-24">{current} / {max}</div>
            </Badge>
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
};

const ChangeMapView = ({ mapState, hasResult, center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
            if(!hasResult) map.flyTo(center, zoom);
        }, 550);        
    },[map, mapState, hasResult])  
}

export default GameMap;