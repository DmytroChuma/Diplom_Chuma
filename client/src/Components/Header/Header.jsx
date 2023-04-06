import React, { useState } from "react";
import { Link } from "react-router-dom";

import store from "../../Store/Store";

export default function Header() {

    const [user, setUser] = useState(typeof store.getState() !== 'undefined' ? store.getState().user : {});

    store.subscribe(() => setUser(store.getState().user))

      const clickHandler = () => {

      }

    return (
        <div className="navArea">
            <div className="btnContainer">
                <Link className="logo" to='/'>Logo</Link>
                <Link className="headerNavBtn" to='/search'>Купити</Link>
                <Link className="headerNavBtn" to='/search?advertisement=Оренда&realty=Вся%20нерухомість&sort=Спочатку%20нові&page=1'>Орендувати</Link>
            </div>
            <div className="btnContainer">
                <Link className="headerNavBtn addAdvertisement" to='/add-new-advertisement'>Додати оголошення</Link>
                {user.name ? 
                 <div className="drop-down">
                    <div className="drop-down-user-info">{user.name}</div>
                    <div className="drop-down-container">
                        <Link className="drop-down-item personally" to='/user/cabinet'>Особистий кабінет</Link>
                        <Link className="drop-down-item my-advertisements" to='/user/cabinet/advertisements'>Мої оголошення</Link>
                        <Link className="drop-down-item archive" to='/user/cabinet/archive'>Архів</Link>
                        <Link className="drop-down-item messages" to='/user/cabinet/messages'>Повідомлення</Link>
                        <Link className="drop-down-item chat" to='/user/chat'>Спілкування</Link>
                        <Link className="drop-down-item settings" to='/user/cabinet/settings'>Налаштування</Link>
                        <div className="drop-down-item exit" onClick={clickHandler} >Вихід</div>
                    </div>
                 </div>
                 :
                <Link className="headerBtn signIn" to='/auth/login'>Вхід</Link>
                }
            </div>
        </div>
    );
}