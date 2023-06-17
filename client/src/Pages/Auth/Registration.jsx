import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import store from "../../Store/Store";
import Input from "../../Components/Inputs/Input";
import Background from "./Background";
import Header from "../../Components/Header/Header";

export default function Registration (props){

        const navigate = useNavigate()

        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [number, setNumber] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirm] = useState('');

        document.title = 'Реєстрація';

        const [user, setUser] = useState({});
        store.subscribe(() => setUser(store.getState().user))
        useEffect(()=>{
            if (store.getState()) {
                if (store.getState().user && JSON.stringify(store.getState().user) !== '{}') {
                    navigate(`/`)
                    return
                }
            }
        }, [user])

        function formValidation() {
            if (firstName.trim() === '') {
                props.dialog('Помилка', "Введіть ім'я");
                return false;
            }
            if (lastName.trim() === '') {
                props.dialog('Помилка', "Введіть прізвище");
                return false;
            }
            if (number.trim() === '') {
                props.dialog('Помилка', "Введіть номер телефону");
                return false;
            }
            if (number.length < 10) {
                props.dialog('Помилка', 'Невірний формат номеру телефона')
                return false;
            }
            if (email.trim() === '') {
                props.dialog('Помилка', "Введіть Email");
                return false;
            }
            const pattern = /^\S+@\S+\.\S+$/;
            if (!pattern.test(email)) {
                props.dialog('Помилка', "Неправильний формат Email");
                return false;
            }
            if (password.trim() === '') {
                props.dialog('Помилка', "Введіть пароль");
                return false;
            }
            if (confirmPassword.trim() === '') {
                props.dialog('Помилка', "Підтвердіть пароль");
                return false;
            }
            if (password !== confirmPassword) {
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

            fetch('https://house-f621.onrender.com/add_user', {
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
                response.json().then(data => {
                    if (data.success === 1) {
                        props.dialog('Успіх', 'Зареєстровано', 1)
                        navigate('/auth/login')
                    }
                    else {
                        
                        const pattern = /'(.*?)'/g;
                        const mathces = [...data.error.sqlMessage.matchAll(pattern)];
                        if (mathces[1][1] === 'phone'){
                            props.dialog('Помилка', 'Такий номер телефона вже зареєстрований')
                        }
                        else if (mathces[1][1] === 'email') {
                            props.dialog('Помилка', 'Такий Email вже зареєстрований')
                        }
                        else {
                            props.dialog('Помилка', 'Помилка реєстрації')
                        }   
                    }
                });
            });
        }

        return (
            <div className="app-screen">
                <Header />
                <div className="container-auth"> 
                    <div className='auth-icon'>
                        <Background />
                    </div>
                    <form className="auth" onSubmit={handleSubmit}>
                        <div className="auth-input-container">
                            <Input type='text' handleChange={setFirstName} placeholder="Ім'я" value='' />
                            <Input type='text' handleChange={setLastName} placeholder="Прізвище" value=''  />
                            <Input type='text' handleChange={setNumber} placeholder="Телефон" phone={true} hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>} value=''  />
                            <Input type='text' handleChange={setEmail} placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>} value='' />
                            <Input type='password' handleChange={setPassword} placeholder="Пароль" value='' />
                            <Input type='password' handleChange={setConfirm} placeholder="Повторіть пароль" value=''  />
                        </div>
                        <button className="btn reg" type='submit'>Зареєструвати</button>
                    </form>
                </div>
            </div>
        )   
}