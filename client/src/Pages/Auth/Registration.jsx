import React, { Component } from "react";

import Input from "../../Components/Inputs/Input";

export default class Registration extends Component {
    render () {
        return (
            <div className="authContainer"> 
                <form className="auth">
                    <Input type='text' placeholder="Ім'я" />
                    <Input type='text' placeholder="Прізвище" />
                    <Input type='text' placeholder="Телефон" hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>} />
                    <Input type='text' placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>}/>
                    <Input type='password' placeholder="Пароль" hint={<div>Пароль повинен бути не менше 6 символів.</div>}/>
                    <Input type='password' placeholder="Повторіть пароль" />
                    <button className="btn reg" type='submit'>Зареєструвати</button>
                </form>
            </div>
        )   
    }
}