import React, {useState} from "react";

import Input from "../Inputs/Input";

export default function Registration ({dialog, modalHandle, phone, user}) {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clickHandle = () => {
        modalHandle('')
    }

    const validate = () => {
        if (name.trim() === '') {
            dialog('Помилка', "Введіть ім'я")
            return false;
        }
        if (surname.trim() === '') {
            dialog('Помилка', "Введіть прізвище")
            return false;
        }
        if (email.trim() === '') {
            dialog('Помилка', "Введіть Email")
            return false;
        }
        const pattern = /^\S+@\S+\.\S+$/;
        if (!pattern.test(email)) {
            dialog('Помилка', "Неправильний формат Email");
            return false;
        }
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
            fetch('https://house-f621.onrender.com/add_user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({firstName: name,
                                    lastName: surname,
                                    number: phone,
                                    email: email,
                                    password: password})
              }).then(res => res.json()).then(data=>{
                user.id = data.id
                dialog('Успіх', 'Зареєстровано', 1)
                modalHandle('')
              })
        }
    }

    return (
        <div className="modal-window">
            <div className="modal-panel">
                <button className="exit-btn" onClick={clickHandle}></button>
                <span className="modal-text">Такий номер не зареєстровано. Для того щоб продовжити необхідно пройти реєстрацію</span>
                <Input handleChange={setName} type='text' value='' placeholder="Ім'я"/>
                <Input handleChange={setSurname} type='text' value='' placeholder='Прізвище'/>
                <Input handleChange={setEmail} type='email' value='' placeholder='Email'/>
                <Input handleChange={setPassword} type='password' value='' placeholder='Пароль'/>
                <Input handleChange={setConfirmPassword} type='password' value='' placeholder='Повторіть пароль'/>
                <button className="btn" onClick={sendHandle}>Зареєструватись</button>
            </div>
        </div>
    )
}