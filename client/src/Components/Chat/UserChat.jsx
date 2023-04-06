import React from "react";

import { useNavigate, useLocation } from 'react-router-dom';

export default function UserChat(props) {

    const navigate = useNavigate();
    const location = useLocation();

    const clickHandler = (e) => {
        if (location.hash !== '') props.socket.emit("leave_room", location.hash.replace('#', ''));
        props.socket.emit("join_room", props.user.inbox_id);
        navigate(`/user/chat/?#${props.user.inbox_id}`);
        let elements = document.getElementsByClassName("user-chat-card");
        for (let element of elements){
           element.classList.remove("active");
        }
        e.target.classList.add("active");;
    }

    return (
        <div className="user-chat-card" onClick={clickHandler}>
            <div className="user-chat-image">
                <img className="user-chat-avatar" src={'http://localhost:3001/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt='' />
            </div>
            <div className="user-chat-info">
                <span className="user-chat-name">{`${props.user.first_name} ${props.user.last_name}`}</span>
                <div className="user-chat-message-info">
                    <span className="user-chat-last">{props.last}</span>
                    <span className="user-chat-time">{props.time}</span>
                </div>
            </div>
        </div>
    );
}