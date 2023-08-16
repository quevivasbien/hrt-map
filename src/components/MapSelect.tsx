import { LatLng } from '@/types';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import React from 'react';

export default function MapSelect({ pos, setPos = null }: { pos: LatLng, setPos?: React.Dispatch<React.SetStateAction<LatLng>> | null }) {
    const [markerPos, setMarkerPos] = React.useState<LatLng>(pos);
    const updateMarkerPos = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            return;
        }
        const eventPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPos(eventPos);
        if (setPos) {
            setPos(eventPos);
        }
    }

    const mapOptions = {
        disableDefaultUI: true,
        clickableIcons: false,
        scrollwheel: true
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    });
    if (!isLoaded) {
        return (
            <p>Loading...</p>
        );
    }
    return (
        <div className="w-full h-96">
            <GoogleMap
                options={mapOptions}
                zoom={12}
                center={markerPos}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
            >
                <Marker
                    position={markerPos}
                    draggable={true}
                    onDragEnd={updateMarkerPos}
                />
            </GoogleMap>
        </div>
    );
}