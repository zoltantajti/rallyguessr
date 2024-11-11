import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup } from 'react-bootstrap';
import FaIcon from '../../../Widgets/Global/FaIcon';


function MapSearchControl(map) {
    const [address, setAddress] = useState('');
    
    const handleSearch = async () => {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: address,
                    format: 'json',
                },
            });

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                console.log(map.map.current.setView([lat,lon],13));
            } else {
                alert('Hely nem található!');
            }
        } catch (error) {
            console.error('Hiba a cím keresésében:', error);
        }
    };

    return (
        <div style={{ 
            position:'relative',
            top:'-5px',
            border: "2px solid rgba(0, 0, 0, 0.2)", 
            borderRadius: "5px",
            pointerEvents: 'auto'
        }}>
            <InputGroup>
                <Form.Control 
                    size="sm" 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Cím keresése" 
                    style={{borderRadius:"5px !important"}}
                    onClick={(e) => { e.stopPropagation(); }}
                />
                <Button 
                    size="sm" 
                    variant="light" 
                    onClick={handleSearch}
                >
                    <FaIcon type="solid" icon="search" />
                </Button>
            </InputGroup>
        </div>
    );
}

export default MapSearchControl;