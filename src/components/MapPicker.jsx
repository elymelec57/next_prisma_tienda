'use client'

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ lat, lng, onChange }) {
    const [position, setPosition] = useState(lat && lng ? [lat, lng] : [7.8891, -72.4967]); // Default to Cucuta/San Cristobal area or similar

    useEffect(() => {
        if (lat && lng) {
            setPosition([lat, lng]);
        }
    }, [lat, lng]);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        onChange(pos[0], pos[1]);
    };

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 z-0">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
        </div>
    );
}
