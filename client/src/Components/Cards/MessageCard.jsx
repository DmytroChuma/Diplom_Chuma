import React, { useState } from "react";

import store from '../../Store/Store';
import UserLogin from "../../Store/ActionsCreators/UserLogin";

export default function MessageCard (props) {

    const [accept, setAccept] = useState(props.accepted)

    const acceptHandler = () => {
        fetch('https://diplomchuma-production.up.railway.app/accept', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({message: props.id, agency: props.agency, name: props.user})
        }).then(res=>res.json()).then(data=>{
            if (data.success === 1){
                props.socket.emit('message_body', {agency: props.agency, text: `Користувач ${props.user} приєднався до агентства`})
                props.socket.emit('join_room', props.agency)
                setAccept(1)
                props.dialog('Успіх','Запрошення прийнято',1)
                let user = store.getState().user
                user.permission = 1
                user.agency = props.agency
                store.dispatch(UserLogin(user))
            }
            else {
                props.dialog('Помилка','Спробуйте пізніше', 0)
            }
        })
    }

    const rejectHandler = () => {
        fetch('https://diplomchuma-production.up.railway.app/reject', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({message: props.id})
        }).then(res=>res.json()).then(data=>{
            if (data.success === 1){
                setAccept(2)
                props.dialog('Успіх','Запрошення відхилено',1)
            }
            else {
                props.dialog('Помилка','Спробуйте пізніше', 0)
            }
        })
    }

    const deleteHandler = () => {
        fetch('https://diplomchuma-production.up.railway.app/delete_message', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({message: props.id})
        }).then(res=>res.json()).then(data=>{
            if(data.success === 1) {
                props.dialog('Успіх','Повідомлення видалено',1)
                props.load()
            }
        })
    }

    return (
        <div className="message-card">
            <div className="message-span-cont">
                <span className="message-span-card-p">{props.text}</span>
                <div className="me-c">
                    <span className="me-d">{`${new Date(Date.parse(props.date)).toLocaleDateString()} ${new Date(Date.parse(props.date)).toLocaleTimeString()}`}</span>
                    <button className="delete-btn" onClick={deleteHandler}></button>
                </div>

            </div>
            
            {props.agency > 0 &&
                <div className="separator"></div>
            }
            {accept === 0 && props.agency > 0 && 
                <div className="message-btn-container">
                    <button className="btn" onClick={acceptHandler}>Прийняти</button>
                    <button className="btn" onClick={rejectHandler}>Відмінити</button>
                </div>
            }
            {accept === 1 &&
                <span className="message-span-card">Ви прийняли запрошення</span>
            }
            {accept === 2 &&
                <span className="message-span-card">Ви відмінили запрошення</span>
            }

        </div>
    )
}