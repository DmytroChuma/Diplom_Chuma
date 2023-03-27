import React, { useState } from "react";

import Input from "../../Components/Inputs/Input";
import Background from "./Background";
import useInput from "../../Hook/useInput";
import Dialog from "../../Components/Dialogs/Dialog";
import Header from "../../Components/Header/Header";

export default function Registration (){

        const firstName = useInput('');
        const lastName = useInput('');
        const number = useInput('');
        const email = useInput('');
        const password = useInput('');
        const confirmPassword = useInput('');
        const [dialog, setDialog] = useState('');

        document.title = 'Реєстрація';
        let timeOut;

        function formValidation() {
            if (firstName.value.trim() === '') {
                handleWarning('Помилка', "Введіть ім'я");
                return false;
            }
            if (lastName.value.trim() === '') {
                handleWarning('Помилка', "Введіть прізвище");
                return false;
            }
            if (number.value.trim() === '') {
                handleWarning('Помилка', "Введіть номер телефону");
                return false;
            }
            
            if (email.value.trim() === '') {
                handleWarning('Помилка', "Введіть email");
                return false;
            }
            const pattern = /^\S+@\S+\.\S+$/;
            if (!pattern.test(email.value)) {
                handleWarning('Помилка', "Неправильний формат email");
                return false;
            }
            if (password.value.trim() === '') {
                handleWarning('Помилка', "Введіть пароль");
                return false;
            }
            if (confirmPassword.value.trim() === '') {
                handleWarning('Помилка', "Підтвердіть пароль");
                return false;
            }
            if (password.value !== confirmPassword.value) {
                handleWarning('Помилка', "Паролі не співпадають");
                return false;
            }

            return true;
        }

        function clearWarning(){
            setDialog('');
            clearTimeout( timeOut );
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
                body: JSON.stringify({firstName: firstName.value,
                                    lastName: lastName.value,
                                    number: number.value,
                                    email: email.value,
                                    password: password.value})
              }).then(response => {
                response.json().then(json => {console.log(JSON.stringify(json))});
            });

          
            return true;
        }

        const handleWarning = (title, text) => {
            setDialog(<Dialog clickHandler={clearWarning} title={title} text={text} />);
            clearTimeout( timeOut );
            timeOut = setTimeout(() => {
                setDialog('');
            }, 10000);  
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
                            <Input type='text' hook_input={firstName} placeholder="Ім'я" />
                            <Input type='text' hook_input={lastName} placeholder="Прізвище" />
                            <Input type='text' hook_input={number} placeholder="Телефон" hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>} />
                            <Input type='text' hook_input={email} placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>}/>
                            <Input type='password' hook_input={password} placeholder="Пароль" />
                            <Input type='password' hook_input={confirmPassword} placeholder="Повторіть пароль" />
                        </div>
                        <button className="btn reg" type='submit'>Зареєструвати</button>
                    </form>
                </div>
            </div>
        )   
}