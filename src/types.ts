export interface LatLng {
    lat: number;
    lng: number;
}

export interface DoseInfo {
    user?: string;
    time: Date;
    pos: LatLng,
    comment: string;
    rating: number;
}