export interface LatLng {
    lat: number;
    lng: number;
}

export interface Reaction {
    user: string;
    text: string;
}

export interface DoseInfo {
    id?: string;
    user: string;
    time: Date;
    pos: LatLng,
    comment: string;
    rating: number;
}

export interface FriendInfo {
    friends: string[];
    requestsSent: string[];
}

export const EMPTY_FRIEND_INFO: FriendInfo = {
    friends: [],
    requestsSent: [],
};

export interface FriendRequestInfo {
    requesters: string[];
}

export const EMPTY_FRIEND_REQUEST_INFO: FriendRequestInfo = {
    requesters: [],
};

export interface UserInfo {
    name: string;
}
