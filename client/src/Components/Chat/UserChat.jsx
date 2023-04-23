import React, { forwardRef, useEffect, useState } from "react";

import { useNavigate, useLocation } from 'react-router-dom';

 const UserChat = forwardRef((props, ref) => {
    let mess = props.user.message.split(',')
    const [message, setMessage] = useState({
        message: mess[0],
        date: mess[1],
        file: mess[2] === '""' ? '' : mess[2]
    })

    useEffect(() => {
        props.socket.on(props.user.inbox_id, (data) => setMessage({message: data.message, date: data.date === null ? message.date : data.date, file: ''}));
    })

    const navigate = useNavigate();
    const location = useLocation();

    function isToday(date) {
        const today = new Date();
        return today.toDateString() === date.toDateString() ? true : false;
      }

    const clickHandler = (e) => {
        if (location.hash !== '') props.socket.emit("leave_room", location.hash.replace('#', ''));
        props.socket.emit("join_room", props.user.inbox_id);
        navigate(`/user/chat/?#${props.user.inbox_id}`);
        let elements = document.getElementsByClassName("user-chat-card");
        for (let element of elements){
           element.classList.remove("active");
        }
        e.target.classList.add("active");
    }

    return (
        <div ref={ref} className={"user-chat-card " + (props.active ? 'active' : '')} onClick={clickHandler}>
            <div className="user-chat-image">
                <img className="user-chat-avatar" src={'http://localhost:3001/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt='' />
            </div>
            <div className="user-chat-info">
                <span className="user-chat-name">{`${props.user.first_name} ${props.user.last_name}`}</span>
                <div className="user-chat-message-info">
                    <span className="user-chat-last">{message.file === '' ? message.message.length > 25 ? message.message.substring(0, 25) + '...' : message.message : 'Файлове повідомлення'}</span>
                    <span className="user-chat-time">{message.date ? isToday(new Date(Date.parse(message.date))) ? new Date(Date.parse(message.date)).toLocaleTimeString().substring(0, 5) : new Date(Date.parse(message.date)).toLocaleDateString() : ''}</span>
                </div>
            </div>
        </div>
    );
})

export default UserChat