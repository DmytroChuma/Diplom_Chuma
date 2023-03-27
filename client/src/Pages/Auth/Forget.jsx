import React, { useState } from "react";


import Input from "../../Components/Inputs/Input";
import useInput from "../../Hook/useInput";
import Background from "./Background";
import Dialog from "../../Components/Dialogs/Dialog";
import Header from "../../Components/Header/Header";

export default function Forget () {
    const email = useInput('');
    const [dialog, setDialog] = useState('');

    document.title = 'Відновлення паролю';
    let timeOut;

    function formValidation() {
        if (email.value.trim() === '') {
            handleDialog('Помилка', "Введіть email");
            return false;
        }
        const pattern = /^\S+@\S+\.\S+$/;
        if (!pattern.test(email.value)) {
            handleDialog('Помилка', "Неправильний формат email");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValidation()) {
            return false;
        }

        fetch('/email', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({to: email.value,
                                subject: 'Відновлення паролю',
                                text: 'Відновлення паролю'})
          }).then(response => {
            response.json().then(json => {
                if (json.status) {
                    handleDialog('Успіх', 'Листа успішно надіслано', 1)
                }
                else {
                    handleDialog('Помилка', 'Листа не надіслано', 0)
                }
            });
        });

      
        return true;
    }

    function clearDialog(){
        setDialog('');
        clearTimeout( timeOut );
    }
    
    const handleDialog = (title, text, type=0) => {
        setDialog(<Dialog clickHandler={clearDialog} title={title} text={text} type={type} />);
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
                    <div className='text-auth-info'>
                        Для відновлення паролю введіть Email, на нього буде надіслано листа з інструкцією
                    </div>
                    <div className="auth-input-container">
                        <Input type='text' hook_input={email} placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>}/>
                    </div>
                    <button className="btn log" type='submit'>Надіслати</button>
                </form>
            </div>
        </div>
    )
}
