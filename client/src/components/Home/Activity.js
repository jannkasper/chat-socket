import React from "react";
import Username from "../Username";
import Message from "../Message";
import Notice from "../Notice";

const Activity = ({ activity, scrollToBottom }) => {
    switch (activity.type) {
        case 'TEXT_MESSAGE':
            return <Message sender={activity.username} message={activity.text} timestamp={activity.timestamp}/>;
        case 'USER_ENTER':
            return (
                <Notice>
                    <div>
                        <Username key={0} username={activity.username}/> joined
                    </div>
                </Notice>
            );
        case 'USER_EXIT':
            return (
                <Notice>
                    <div>
                        <Username key={0} username={activity.username} /> left
                    </div>
                </Notice>
            );
        case 'TOGGLE_LOCK_ROOM':
            if (activity.locked) {
                return (
                    <Notice>
                        <div>
                            <Username key={0} username={activity.username} /> locked the room
                        </div>
                    </Notice>
                );
            } else {
                return (
                    <Notice>
                        <div>
                            <Username key={0} username={activity.username} /> unlocked the room
                        </div>
                    </Notice>
                );
            }
        default:
            return false;
    }
}

export default Activity