import React, { useState } from "react";
import Input from "../Inputs/Input";

export default function Password ({dialog, cancel, modalHandle, forget, email = ''}) {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clickHandle = () => {
        modalHandle('')
        cancel();
    }

    const validate = () => {
        if (password.length < 6) {
            dialog('Помилка', 'Пароль повинен бути щонайменше 6 символів');
            return false;
        }
        if (password !== confirmPassword) {
            dialog('Помилка', "Паролі не співпадають")
            return false;
        }
        return true;
    }

    const sendHandle = () => {
        if (validate()){
            fetch('https://house-f621.onrender.com/change_password', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials : "include",
                mode: 'cors',
                body: forget ? JSON.stringify({password: password, email: email}) : JSON.stringify({password: password})
            }).then(res => res.json()).then(data => {
                if (data.success === 1) {
                    modalHandle('')
                    dialog('Успіх', 'Пароль змінено',1)
                }
                else {
                    dialog('Помилка', 'Пароль не змінено')
                }
            })
        }
    }

    return (
        <div className="modal-window">
            <div className="modal-panel">
                <button className="exit-btn" onClick={clickHandle}></button>
                <Input handleChange={setPassword} type='password' value='' placeholder='Пароль'/>
                <Input handleChange={setConfirmPassword} type='password' value='' placeholder='Повторіть пароль'/>
                <button className="btn" onClick={sendHandle}>Зберегти</button>
            </div>
        </div>
    )
}