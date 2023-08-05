import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

export default function Map({ lat, lng }: { lat: number, lng: number }) {

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
        <div>
            <GoogleMap
                options={mapOptions}
                zoom={12}
                center={{ lat, lng }}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '400px', height: '400px' }}
                onLoad={() => console.log('Map Component Loaded...')}
            >
                <Marker
                    position={{ lat, lng }}
                />
            </GoogleMap>
        </div>
    );
}