import { DoseInfo } from "@/types"
import MapDisplay from "./MapDisplay"
import StaticRating from "./StaticRating"

export default function DoseEvent({ info }: { info: DoseInfo }) {
    const { time, pos, comment, rating } = info;
    return (
        <div className="flex flex-col space-y-4">
            <div>
                <span className="font-bold">Time</span>: {time.toLocaleString()}
            </div>
            {comment !== "" ? <div>
                <span className="font-bold">Comment</span>: {comment}
            </div> : null}
            {rating !== 0 ? <div className="flex flex-row space-x-4 items-center">
                <span className="font-bold">Rating:</span> <StaticRating rating={rating} />
            </div> : null}
            <MapDisplay pos={pos} />
        </div>
    )
}