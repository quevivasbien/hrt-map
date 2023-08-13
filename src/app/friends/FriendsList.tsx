export default function FriendsList({ friends }: { friends: string[] }) {
    if (friends.length === 0) {
        return (
            <div>No friends yet</div>
        );
    }
    return (
        <div className="flex flex-col">
            Friends
        </div>
    );
}