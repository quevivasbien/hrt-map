import Map from "./Map"
import StaticRating from "./StaticRating"

export default function ({ time, loc, comment, rating }: { time: Date, loc: GeolocationCoordinates, comment: string, rating: number }) {
    return (
        <div className="m-4 p-2">
            <div>
                Time: {time.toLocaleString()}
            </div>
            <div>
                Location: lat {loc.latitude}, long {loc.longitude}
            </div>
            <div>
                Comment: {comment}
            </div>
            <div>
                Rating: <StaticRating rating={rating} />
            </div>  
            <Map lat={loc.latitude} lng={loc.longitude} />
        </div>
    )
}