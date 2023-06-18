import React, { useEffect, useState } from "react";
import Input from "../Inputs/Input";
import Password from "./Password";

export default function Code ({dialog, modalHandle, email, forget = false}) {

    const [code, setCode] = useState('');

    useEffect(() => {
        fetch('https://diplomchuma-production.up.railway.app/send_code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({email: email})
        }).then((res) => res.json()).then((data) => {
            if (!data.success) {
                dialog('Помилка', "Не вдалось надіслати листа");
                modalHandle('');
            }

        })
    }, [])

    const clickHandle = () => {
        modalHandle('')
        cancel()    
    }

    const cancel = () => {
        fetch('https://diplomchuma-production.up.railway.app/cancel', {credentials : "include"}).then((res) => res.json()).then((data)=>{
            if (data.success === 1) {
                dialog('Відміна', 'Операцію відмінено', 1)
            }
        })
    }

    const sendHandle = () => {
        fetch('https://diplomchuma-production.up.railway.app/check_code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({code: code})
        }).then((res)=> res.json()).then((data) => {
            if (data.success){
                modalHandle(<Password modalHandle={modalHandle} dialog={dialog} cancel={cancel} forget={forget} email={forget ? email : ''}/>)
            }
            else {
                dialog('Помилка', 'Неправильний код')
            }
        })
    }

    return(
        <div className="modal-window">
            <div className="modal-panel">
                <button className="exit-btn" onClick={clickHandle}></button>
                <span className="modal-text">На ваш Email було надіслано листа з кодом підтвердження</span>
                <div className="modal-container">
                    <Input handleChange={setCode} code={true} value=''/>
                    <button className="btn" onClick={sendHandle}>Підтвердити</button>
                </div>
            </div>
        </div>
    )
}