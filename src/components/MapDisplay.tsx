import { LatLng } from '@/types';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

export default function MapDisplay({ pos }: { pos: LatLng }) {

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
                center={pos}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={() => console.log('Map Component Loaded...')}
            >
                <Marker
                    position={pos}
                />
            </GoogleMap>
        </div>
    );
}