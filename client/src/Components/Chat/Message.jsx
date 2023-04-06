import React from "react";

export default function Message(props) {

    return(
        <div className="message-chat">
             {(props.avatar || props.avatar === '') &&
                <div className="avatar-container-message">
                    <img className="user-avatar-message" src={'http://localhost:3001/users/' + (props.avatar !== '' ? props.avatar : 'avatar.png')} alt=''/>
                </div>
            }
            <div className={"message " + props.class} onClick={(e) => props.handleClick(e, props.class)}>
                {props.text}
                <span className="message-chat-date">{new Date(Date.parse(props.date)).toLocaleTimeString().substring(0, 5)}</span>
            </div>
        </div>
    );
}