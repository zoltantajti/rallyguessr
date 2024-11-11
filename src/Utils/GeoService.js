import { collection, getDocs, query, where } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { db } from './Firebase';

export const GenerateRandomCoord = (target) => {
    return new Promise(async (resolve,reject) => {
        const q = query(collection(db,"tracks"), where("activeTrack","==",true), where("topic", "array-contains", target));
        const snapshot = await getDocs(q);
        const activeTrack = snapshot.docs[Math.floor(Math.random() * snapshot.docs.length)];
        let { start, finish, points } = activeTrack.data();
        start = JSON.parse(start); 
        finish = JSON.parse(finish); 
        points = JSON.parse(points);
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                ...Array.isArray(points) && points.length > 0 ? points.map(point => L.latLng(point.lat, point.lng)) : [],
                L.latLng(finish.lat, finish.lng)
            ],
            routeWhileDragging: false,
            createMarker: () => null,
            router: L.Routing.osrmv1()
        });        
        routingControl.on('routesfound', function (e) {
            const route = e.routes[0];
            const points = route.coordinates;
            const randomPoint = points[Math.floor(Math.random() * points.length)];
            resolve(randomPoint); 
        });
        routingControl.on('error', (err) => {
            reject(err);
        });        
        await routingControl.route();
    })
}
export const calculateDistance = (pos1, pos2) => {
    const R = 6371;
    const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180);
    const dLng = (pos2.lng - pos1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pos1.lat * (Math.PI / 180)) *
        Math.cos(pos2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); //Távolság kilóméterben (xx.xx km)
}

export const formatDistance = (distance) => {
    if(distance < 1){
        return `${(distance / 1000).toFixed(2)} Km`;
    }else{
        return `${(distance)} Km`
    }
}