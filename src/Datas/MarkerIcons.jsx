import { Icon, popup } from "leaflet";

const startIcon = new Icon({
    iconUrl: '../../images/markers/start.png',
    iconSize: [20,32],
    iconAnchor: [10,32],
    popupAnchor: [0,0]
});
const FinishIcon = new Icon({
    iconUrl: '../../images/markers/finish.png',
    iconSize: [20,32],
    iconAnchor: [10,32],
    popupAnchor: [0,0]
})
const PointIcon = new Icon({
    iconUrl: '../../images/markers/point.png',
    iconSize: [20,32],
    iconAnchor: [10,32],
    popupAnchor: [0,0]
})


export const icons = {
    start: startIcon,
    finish: FinishIcon,
    point: PointIcon
};