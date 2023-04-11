import React, { useState } from "react";

import Input from "../../Components/Inputs/Input";
import Background from "./Background";
import Header from "../../Components/Header/Header";

export default function Registration (props){

        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [number, setNumber] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirm] = useState('');
        const [dialog, setDialog] = useState('');

        document.title = 'Реєстрація';

        function formValidation() {
            if (firstName.value.trim() === '') {
                props.dialog('Помилка', "Введіть ім'я");
                return false;
            }
            if (lastName.value.trim() === '') {
                props.dialog('Помилка', "Введіть прізвище");
                return false;
            }
            if (number.value.trim() === '') {
                props.dialog('Помилка', "Введіть номер телефону");
                return false;
            }
            
            if (email.value.trim() === '') {
                props.dialog('Помилка', "Введіть email");
                return false;
            }
            const pattern = /^\S+@\S+\.\S+$/;
            if (!pattern.test(email.value)) {
                props.dialog('Помилка', "Неправильний формат email");
                return false;
            }
            if (password.value.trim() === '') {
                props.dialog('Помилка', "Введіть пароль");
                return false;
            }
            if (confirmPassword.value.trim() === '') {
                props.dialog('Помилка', "Підтвердіть пароль");
                return false;
            }
            if (password.value !== confirmPassword.value) {
                props.dialog('Помилка', "Паролі не співпадають");
                return false;
            }

            return true;
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formValidation()) {
                return false;
            }

            fetch('/add_user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({firstName: firstName,
                                    lastName: lastName,
                                    number: number,
                                    email: email,
                                    password: password})
              }).then(response => {
                response.json().then(json => {

                    console.log(JSON.stringify(json))
                });
            });

          
            return true;
        }

        return (
            <div className="app-screen">
                <Header />
                <div className="container-auth"> 
                {dialog}
                    <div className='auth-icon'>
                        <Background />
                    </div>
                    <form className="auth" onSubmit={handleSubmit}>
                        <div className="auth-input-container">
                            <Input type='text' handleChange={setFirstName} placeholder="Ім'я" value='' />
                            <Input type='text' handleChange={setLastName} placeholder="Прізвище" value=''  />
                            <Input type='text' handleChange={setNumber} placeholder="Телефон" hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>} value=''  />
                            <Input type='text' handleChange={setEmail} placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>} value='' />
                            <Input type='password' handleChange={setPassword} placeholder="Пароль" value=''  />
                            <Input type='password' handleChange={setConfirm} placeholder="Повторіть пароль" value=''  />
                        </div>
                        <button className="btn reg" type='submit'>Зареєструвати</button>
                    </form>
                </div>
            </div>
        )   
}