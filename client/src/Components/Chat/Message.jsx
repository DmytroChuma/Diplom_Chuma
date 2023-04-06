import React, { useEffect, useState } from "react";
import parse from 'html-react-parser'

export default function Message(props) {

    const [answear, setAnswear] = useState(props.amessage);

    useEffect(()=>{
        if (props.answear){
            props.socket.on('edit_message', (data) => {
                if(data.id === props.answear) {
                    setAnswear(data.message);
                }
            })
        }
    }, [])

    return(
        <div className="message-chat">
             {(props.avatar || props.avatar === '') &&
                <div className="avatar-container-message">
                    <img className="user-avatar-message" src={'http://localhost:3001/users/' + (props.avatar !== '' ? props.avatar : 'avatar.png')} alt=''/>
                </div>
            }
            <div className={"message " + props.class} onClick={(e) => props.handleClick(e, props.class, props.text, props.id)}>
                {props.answear !== 0 &&
                    <div className="answear">
                        {answear}
                    </div>
                }
                <div className="message-chat-cont">
                    <span>{parse(props.text)}</span>
                    <span className="message-chat-date">{new Date(Date.parse(props.date)).toLocaleTimeString().substring(0, 5)}</span>
                </div>
            </div>
        </div>
    );
}