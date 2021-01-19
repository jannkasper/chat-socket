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
        default:
            return false;
    }
}

export default Activity