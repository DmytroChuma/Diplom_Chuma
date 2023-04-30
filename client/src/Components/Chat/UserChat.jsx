import React, { useEffect, useState } from "react";

import { useNavigate, useLocation } from 'react-router-dom';

 function UserChat ({socket, ...props}) {
    let mess = props.user.message.split(',')

    const [message, setMessage] = useState(mess[0])
    const [date, setDate] = useState(mess[1])
    const [file, setFile] = useState(mess[2] === '""' ? '' : mess[2])
    const [newMessages, setNewMessages] = useState(props.newMessages ? true : false)

    useEffect(() => {
 
        socket.on(`inbox_${props.user.inbox_id}`, (data) => {
            setMessage(data.message)
            setDate(data.date ? data.date : date)
            setFile('')
            location.hash.replace('#', '') === props.user.inbox_id ? setNewMessages(false) : setNewMessages(true)
        });
    })

    const navigate = useNavigate();
    const location = useLocation();

    function isToday(date) {
        const today = new Date();
        return today.toDateString() === date.toDateString() ? true : false;
      }

    const clickHandler = (e) => {
        if (location.hash !== '') socket.emit("leave_room", location.hash.replace('#', ''));
        socket.emit("join_room", props.user.inbox_id);
        navigate(`/user/chat/?#${props.user.inbox_id}`);
        let elements = document.getElementsByClassName("user-chat-card");
        for (let element of elements){
           element.classList.remove("active");
        }
        e.target.classList.add("active");
        fetch('/set_read', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({inbox: props.user.inbox_id})
          })
          setNewMessages(false)
    }
    return (
        <div className={"user-chat-card " + (props.active ? 'active' : '')} onClick={clickHandler}>
            <div className="user-chat-image">
                <img className="user-chat-avatar" src={'http://localhost:3001/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt='' />
            </div>
            <div className="user-chat-info">
                <div className="chat-u-c">
                    <span className="user-chat-name">{`${props.user.first_name} ${props.user.last_name}`}</span>
                    {(newMessages) && <div className="newMessage">!</div>}
                </div>
                <div className="user-chat-message-info">
                    <span className="user-chat-last">{file === '' ? message.length > 25 ? message.replace(/(<([^>]+)>)/gi, "").substring(0, 25) + '...' : message : (message === '' && !file) ? '' : 'Файлове повідомлення'}</span>
                    <span className="user-chat-time">{date ? isToday(new Date(Date.parse(date))) ? new Date(Date.parse(date)).toLocaleTimeString().substring(0, 5) : new Date(Date.parse(date)).toLocaleDateString() : ''}</span>
                </div>
            </div>
        </div>
    );
}

export default UserChat