import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../Components/Inputs/Input";
import Checkbox from "../../Components/Inputs/Checkbox";
import Background from "./Background";
import useInput from "../../Hook/useInput";
import Loading from "../../Components/Dialogs/Loading";
import Dialog from "../../Components/Dialogs/Dialog";

import Header from "../../Components/Header/Header";

export default function Login () {

    const [remember, setRemember] = useState('');
    const login = useInput("");
    const password = useInput("");
    const [dialog, setDialog] = useState('');

    const navigate = useNavigate(); 

    let timeOut;

    document.title = 'Вхід';

    const formValidation = () => {
        if (login.value === '') {
            handleWarning('Помилка', 'Введіть логін!');
            return false;
        }
        if (password.value === '') {
            handleWarning('Помилка', 'Введіть пароль!');
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
        fetch('/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({login: login.value,
                                password: password.value,
                                remember: remember
                                })
          }).then(response => {
            response.json().then(json => {
                setDialog(''); 
                if (json.status === 0) {
                    handleWarning('Помилка авторизації', 'Неправильний логін або пароль!')
                    return;
                }
                navigate('/');
            });
        });
         
    }

    function clearWarning(){
        setDialog('');
        clearTimeout( timeOut );
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
                        <Input type='text' hook_input={login}  placeholder="Телефон або Email" />
                        <Input type='password' hook_input={password}  placeholder="Пароль" />
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



/*

 <div className="authContainer">
            <form className="auth">
                <Input type='text' placeholder="Телефон або Email" />
                <Input type='password' placeholder="Пароль" />
                {//<Checkbox name='remember' class="checkmark" text="Запам'ятати"/>
                }
                <button className="btn log" type='submit'>Увійти</button>
                <Link className="linkAuth" to='/auth/registration'>Зареєструватись</Link>
            </form>
            
        </div>

*/