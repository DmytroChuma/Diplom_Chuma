import React, { useState } from "react";

import Input from "../Inputs/Input";

export default function Invite ({dialog, modalHandle, agency, name, socket}) {

    const [userData, setUserData] = useState('')

    const clickHandle = () => {
        modalHandle('')
    }

    const sendHandle = () => {
        fetch('/invite', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({user: userData, agency: agency, name: name})
        }).then(res=>res.json()).then(data=>{
            if (data.success === 0) {
                if (data.text === '') {
                    dialog('Помилка', "Такий користувач не зареєстрований")
                }
                else {
                    dialog('Помилка', data.text)
                }
            }
            else {
                socket.emit('invite', {id: data.id, text: `Запрошення до агентства: "${name}"`})
                dialog('Успіх','Запрошення надіслано',1)
                modalHandle('')
            }
        })
    }

    return (
        <div className="modal-window">
            <div className="modal-panel">
                <button className="exit-btn" onClick={clickHandle}></button>
                <span className="modal-text">Введіть номер телефону або Email користувача, якому бажаєте надіслати запрошення</span>
                <div className="modal-container">
                    <Input handleChange={setUserData} value=''/>
                    <button className="btn" onClick={sendHandle}>Надіслати</button>
                </div>
            </div>
        </div>
    )
}