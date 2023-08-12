import Star from "./Star";

export default function StaticRating({ rating, numStars = 5 }: { rating: number, numStars?: number }) {

    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(
            <Star key={`${i}${rating}`} size={32} color={"#5b21b6"} filled={rating >= i + 1} />
        );
    }

    return <div className="flex flex-row space-x-1">
        {stars}
    </div>
}
