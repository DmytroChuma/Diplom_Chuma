import React, { Component } from "react";
import { Link } from "react-router-dom";

import Input from "../../Components/Inputs/Input";
import Checkbox from "../../Components/Inputs/Checkbox";

export default class Login extends Component {
    render () {
        return (
            <div className="authContainer">
                <form className="auth">
                    <Input type='text' placeholder="Телефон або Email" />
                    <Input type='password' placeholder="Пароль" />
                    <Checkbox name='remember' class="checkmark" text="Запам'ятати"/>
                    <button className="btn log" type='submit'>Увійти</button>
                </form>
                <Link className="linkAuth" to='/auth/registration'>Зареєструватись</Link>
            </div>
        )
    }
}