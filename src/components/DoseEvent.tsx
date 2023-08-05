import { DoseInfo } from "@/types"
import MapDisplay from "./MapDisplay"
import StaticRating from "./StaticRating"

export default function ({ info }: { info: DoseInfo }) {
    const { time, pos, comment, rating } = info;
    return (
        <div className="m-4 p-2 flex flex-col space-y-4">
            <div>
                Time: {time.toLocaleString()}
            </div>
            <div>
                Comment: {comment}
            </div>
            <div className="flex flex-row space-x-4 items-center">
                <span>Rating:</span> <StaticRating rating={rating} />
            </div>
            <MapDisplay pos={pos} />
        </div>
    )
}