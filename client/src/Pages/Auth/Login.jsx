import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../Components/Inputs/Input";
import Checkbox from "../../Components/Inputs/Checkbox";
import Background from "./Background";
import Loading from "../../Components/Dialogs/Loading";
 

import store from "../../Store/Store";
import UserLogin from "../../Store/ActionsCreators/UserLogin";
import userSelect from "../../Store/ActionsCreators/UserSelect";

import Header from "../../Components/Header/Header";

export default function Login (props) {

    const [remember, setRemember] = useState('');
    const [login, setLogin] = useState("");
    const [password,setPassword] = useState("");
    const [dialog, setDialog] = useState('');

    const navigate = useNavigate(); 

    document.title = 'Вхід';

    const formValidation = () => {
        if (login === '') {
            props.dialog('Помилка', 'Введіть логін!', 0);
            return false;
        }
        if (password === '') {
            props.dialog('Помилка', 'Введіть пароль!', 0);
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValidation()) {
            return false;
        }
        
        setDialog(<Loading text='' />);
        try{
        fetch('/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify({login: login,
                                password: password,
                                remember: remember
                                })
          }).then(response => {
            if (response.status !== 200) {
                setDialog('')
                props.dialog('Помилка авторизації', 'Спробуйте пізніше')
            }
            response.json().then(json => {
                setDialog(''); 
                if (json.status === 0) {
                    props.dialog('Помилка авторизації', 'Неправильний логін або пароль!')
                    return;
                }
                let user = {id: json.user.id, name: json.user.name, avatar: json.user.avatar, permission: json.user.permission, agency: json.user.agency}
                store.dispatch(UserLogin(user));
                store.dispatch(userSelect(json.select))
                props.socket.emit("join_room", json.user.id);
                if (json.user.agency !== 0)
                    props.socket.emit("join_room", json.user.agency);
                navigate('/');
            });
        });
    }catch(err) {setDialog('')}
         
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
                        <Input type='text' handleChange={setLogin}  placeholder="Телефон або Email" value='' />
                        <Input type='password' handleChange={setPassword    }  placeholder="Пароль" value=''/>
                    </div>
                    <Checkbox handleChange={setRemember} checked={0}  name='remember' class="checkmark" text="Запам'ятати"/>
                    <div className="auth-btn-cont">
                    <Link className="linkAuth" to='/auth/forget'>Забули пароль?</Link>
                    <button className="btn log" type='submit'>Увійти</button>
                    </div>
                    <div className="separator"></div>
                    <Link className="linkAuth btn" to='/auth/registration'>Зареєструватись</Link>
                </form>
            </div>
        </div>
    )
}