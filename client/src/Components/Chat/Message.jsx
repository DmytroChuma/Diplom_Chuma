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
    }, [props])

    return(
        <div className="message-chat">
             {(props.avatar || props.avatar === '') &&
                <div className="avatar-container-message">
                    <img className="user-avatar-message" src={'http://192.168.0.105:3001/users/' + (props.avatar !== '' ? props.avatar : 'avatar.png')} alt=''/>
                </div>
            }
            <div className={"message " + props.class} onContextMenu={(e) => props.handleClick(e, props.class, props.text, (props.file || props.file === '') ? '' : props.file.path, props.id)}>
                {props.answear !== 0 &&
                    <div className="answear">
                        {answear}
                    </div>
                }
                <div className="message-chat-cont">
                    <span>{props.text !== '' ? parse(props.text) : props.file.type.split('/')[0] === 'image' ? <img className="chat-img-message" src={`http://192.168.0.105:3001/files/${props.file.path}`} alt=''/> : <a href={`http://192.168.0.105:3001/files/${props.file.path}`} download className="file-dummy-span">{props.file.path}</a>}</span>
                    <span className="message-chat-date">{new Date(Date.parse(props.date)).toLocaleTimeString().substring(0, 5)}</span>
                </div>
            </div>
        </div>
    );
}