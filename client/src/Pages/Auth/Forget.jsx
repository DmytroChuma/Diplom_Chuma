import React, { useState } from "react";

import Input from "../../Components/Inputs/Input";
import Background from "./Background";
import Header from "../../Components/Header/Header";
import Code from "../../Components/Dialogs/Code";

export default function Forget ({dialog}) {
    const [email, setEmail] = useState('');
    const [modal, setModal] = useState('')

    document.title = 'Відновлення паролю';

    function formValidation() {
        if (email.trim() === '') {
            dialog('Помилка', "Введіть email");
            return false;
        }
        const pattern = /^\S+@\S+\.\S+$/;
        if (!pattern.test(email)) {
            dialog('Помилка', "Неправильний формат email");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValidation()) {
            return false;
        }

        setModal(<Code dialog={dialog} modalHandle={setModal} email={email} forget={true}/>)
    }
    
    return (
        <div className="app-screen">
            {modal}
            <Header />
            <div className="container-auth">
                <div className='auth-icon'>
                    <Background />
                </div>
                <form className="auth" onSubmit={handleSubmit}>
                    <div className='text-auth-info'>
                        Для відновлення паролю введіть Email, на нього буде надіслано листа з інструкцією
                    </div>
                    <div className="auth-input-container">
                        <Input type='text' handleChange={setEmail} value='' placeholder="Email" hint={<div><b>Формат електронної пошти:</b><br></br>example@gmail.com</div>}/>
                    </div>
                    <button className="btn log" type='submit'>Надіслати</button>
                </form>
            </div>
        </div>
    )
}
