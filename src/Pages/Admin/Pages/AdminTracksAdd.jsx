import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { icons } from '../../../Datas/MarkerIcons';
import MapSearchControl from '../Widgets/MapSearchControl';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Utils/Firebase';

const AdminTracksAdd = () => {
    const { id: paramId } = useParams();
    const id = paramId !== undefined ? paramId : -1;
    const navigate = useNavigate();
    const [track, setTrack] = useState({
        name: '',
        trackNumber: '',
        trackName: '',
        topic: [],
        start: false,
        finish: false,
        points: []
    });
    const [bounding, setBounding] = useState(false);

    const collectTrackData = async () => {
        const docRef = doc(db, "tracks", id);
        const snap = (await getDoc(docRef)).data();
        
        setTrack((prev) => ({
            ...prev,
            name: snap.name,
            trackNumber: snap.trackNumber,
            trackName: snap.trackName,
            topic: snap.topic,
            start: JSON.parse(snap.start),
            finish: JSON.parse(snap.finish),
            points: JSON.parse(snap.points)
        }));
        setBounding(true);
    }
    useEffect(() => { if (id !== -1) { collectTrackData(); }; }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name !== "topic") { setTrack({ ...track, [name]: value }); }
        else if (name === "topic") { let _topic = track.topic; if (!_topic.includes(value)) { _topic.push(value); } else { _topic.splice(_topic.indexOf(value), 1); }; setTrack({ ...track, ["topic"]: _topic }); };
    }
    const createTrackEvent = async (event) => {
        event.preventDefault();
        
        if (track.name.length > 0 && track.start !== false && track.finish !== false && track.topic.length > 0) {
            if (id === -1) {
                /*Insert new track*/
                addDoc(collection(db,"tracks"),{
                    name: track.name,
                    trackNumber: track.trackNumber,
                    trackName: track.trackName,
                    topic: track.topic,
                    start: JSON.stringify(track.start),
                    finish: JSON.stringify(track.finish),
                    points: JSON.stringify(track.points),
                    activeTrack: true
                });
                navigate('/admin/tracks/list', {state: {success: true, message: 'Pálya sikeresen létrehozva!'}});
            }else{
                /*Update existing track by id*/
                const docRef = doc(db, "tracks", id);
                updateDoc(docRef, {
                    name: track.name,
                    trackNumber: track.trackNumber,
                    trackName: track.trackName,
                    topic: track.topic,
                    start: JSON.stringify(track.start),
                    finish: JSON.stringify(track.finish),
                    points: JSON.stringify(track.points),
                    activeTrack: true
                });
                navigate('/admin/tracks/list', {state: {success: true, message: 'Pálya sikeresen módosítva!'}});
            }
        };
    }
    /*Map Functions*/
    const mapRef = useRef();
    const markerRef = useRef({ start: null, finish: null });
    const [route, setRoute] = useState(false);

    const updateRoute = () => {
        
        if (route) {
            mapRef.current.removeControl(route);
        }
        let r = L.Routing.control({
            waypoints: [
                track.start,
                ...Array.isArray(track.points) && track.points.length > 0 ? track.points.map(point => point) : [],
                track.finish
            ],
            fitSelectedRoutes: bounding,
            createMarker: () => null
        }).addTo(mapRef.current);
        setRoute(r);

        r.route();
    }
    const mapClick = (e) => {
        if (!track.start && !track.finish && track.points.length == 0) { setTrack(prevTrack => ({ ...prevTrack, start: e.latlng })); };
        if (track.start && !track.finish && track.points.length == 0) { setTrack(prevTrack => ({ ...prevTrack, finish: e.latlng })); };
        if (track.start && track.finish) { setTrack(prevTrack => ({ ...prevTrack, points: [...prevTrack.points, e.latlng] })); };
    }
    const dragEnd = (e) => {
        
        const markerName = e.target.options.name;
        const markerPos = e.target.getLatLng();
        setTrack(prevTrack => {
            if (markerName === "start" || markerName === "finish") {
                return { ...prevTrack, [markerName]: markerPos };
            } else if (markerName.startsWith("point-")) {
                const index = parseInt(markerName.split("-")[1], 10);
                const updatedPoints = [...prevTrack.points];
                updatedPoints[index] = markerPos;
                return { ...prevTrack, points: updatedPoints };
            };
            return prevTrack;
        });
    }

    const markerEventHandlers = useMemo(
        () => ({
            dragend(e) { dragEnd(e); }
        }), []
    );
    const AdminMapEvents = () => {
        useMapEvents({
            click(e) { mapClick(e); }
        });
        return (
            <>
                {(track.start) && (<Marker ref={el => markerRef.start = el} draggable={true} eventHandlers={markerEventHandlers} name="start" icon={icons.start} position={track.start} />)}
                {(track.finish) && (<Marker ref={el => markerRef.finish = el} draggable={true} eventHandlers={markerEventHandlers} name="finish" icon={icons.finish} position={track.finish} />)}
                {(track.points.length > 0) && (track.points.map((item, index) => (<Marker key={index} eventHandlers={markerEventHandlers} draggable={true} name={`point-${index}`} icon={icons.point} position={item} />)))}
            </>
        )
    };

    useEffect(() => {
        if (track.start && track.finish) {
            updateRoute();
        };
    }, [track.start, track.finish]);

    useEffect(() => {
        if (track.start && track.finish && track.points.length > 0) {
            updateRoute();
        };
    }, [track.start, track.finish, track.points]);

    /*Render*/
    return (
        <Container style={{ paddingTop: '55px' }}>
            <Form onSubmit={createTrackEvent}>
                <Row>
                    <Col>
                        <FloatingLabel controlId="floatingInput" label="Verseny neve" className="mb-3" >
                            <Form.Control type="text" name="name" value={track.name} onChange={handleChange} placeholder="Verseny neve" />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingInput" label="Pálya száma (SSx)" className="mb-3" >
                            <Form.Control type="text" name="trackNumber" value={track.trackNumber} onChange={handleChange} placeholder="Pálya száma (SSx)" />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingInput" label="Helyszín" className="mb-3" >
                            <Form.Control type="text" name="trackName" value={track.trackName} onChange={handleChange} placeholder="Helyszín" />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>Kategória választása:</Col>
                    <Col md={1}><Form.Check checked={(track.topic.includes("WRC") ? true : false)} onChange={handleChange} type="switch" name="topic" value="WRC" label="WRC" /></Col>
                    <Col md={1}><Form.Check checked={(track.topic.includes("ERC") ? true : false)} onChange={handleChange} type="switch" name="topic" value="ERC" label="ERC" /></Col>
                    <Col md={1}><Form.Check checked={(track.topic.includes("ORB") ? true : false)} onChange={handleChange} type="switch" name="topic" value="ORB" label="ORB" /></Col>
                    <Col>
                        <MapSearchControl map={mapRef} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="mb-3">
                        <MapContainer ref={mapRef} center={[48.647458, 15.907382]} zoom={5} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <AdminMapEvents />
                        </MapContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button type="submit" varaint="off" className="register-button">Mentés</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
export default AdminTracksAdd;