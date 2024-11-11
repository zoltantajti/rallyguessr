import React, { useEffect, useRef } from 'react';

const GameStreetView = ({ pos }) => {
    const streetViewRef = useRef(null);
    
    useEffect(() => {
        const initStreetView = () => {
            new window.google.maps.StreetViewPanorama(
                streetViewRef.current,
                {
                    position: {lat: pos.lat, lng: pos.lng },
                    disableDefaultUI: true,
                    scrollwheel: false,
                    draggame: false,
                }
            );
        }
        
        const loadGoogleMapsScript = () => {
            if(window.google){
                initStreetView();
            }else{
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA2FwOGh1VmFEywtKIB6_hz4rMuOCJgkrk&v=weekly`
                script.async = true;
                script.defer = true;
                script.onload = initStreetView;
                document.head.appendChild(script);
            }
        };
        loadGoogleMapsScript();
    })
    
    return (
        <div ref={streetViewRef} style={{width:'100vw',height:'100vh'}} />
    );
};

export default GameStreetView;