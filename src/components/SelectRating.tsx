import React from "react";
import Star from "./Star";

function StarButton({ size, color = "#000000", filled = false, onClick = (() => {}) }: { size: number, color?: string, filled?: boolean, onClick?: () => void }) {
    return <button className="rounded inline-flex items-center" onClick={onClick}>
        <Star size={size} color={color} filled={filled} />
    </button>
}

export default function SelectRating({ setSharedRating, numStars = 5 }: { setSharedRating: React.Dispatch<React.SetStateAction<number>>, numStars?: number }) {
    const [rating, setRating] = React.useState(0);

    const updateRating = (i: number) => {
        setRating(i);
        setSharedRating(i);
    };

    const randomKey = Math.random().toString().slice(2);  // to provide a unique key to this element
    const buttons = [];
    for (let i = 0; i < numStars; i++) {
        buttons.push(
            <StarButton key={`${randomKey}${i}`} size={32} color={"#5b21b6"} filled={rating >= i + 1} onClick={() => updateRating(i + 1)} />
        );
    }

    return <div className="flex flex-row space-x-1">
        {buttons}
    </div>
}
