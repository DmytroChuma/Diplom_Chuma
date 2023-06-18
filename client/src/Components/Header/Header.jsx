import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import store from "../../Store/Store";
import UserLogin from "../../Store/ActionsCreators/UserLogin";
import userSelect from "../../Store/ActionsCreators/UserSelect";

import logo from './logo.png'

export default function Header (props) {

    const [user, setUser] = useState(typeof store.getState() !== 'undefined' ? store.getState().user : {});
    const [newChat, setNewChat] = useState(false)
    const [newMessage, setNewMessages] = useState(false)

    const navigate = useNavigate();

    store.subscribe(() => {
        setUser(store.getState().user)
    })

      const logoutHandler = () => {
        fetch('https://diplomchuma-production.up.railway.app/logout');
        localStorage.setItem('select', '[]')
        store.dispatch(UserLogin({}));
        store.dispatch(userSelect([]));
        navigate('/')
      }

      useEffect(()=>{
        if (store.getState())
            fetch('https://diplomchuma-production.up.railway.app/new_chat').then((res)=>res.json()).then((data)=>{
                if (data.length > 0) {
                    setNewChat(true)
                    if (props.newChatHandler)
                        props.newChatHandler(true)
                }
            })
            fetch('https://diplomchuma-production.up.railway.app/new_messages').then((res)=>res.json())
                .then((data)=>{
                    if (data.length > 0) {
                        setNewMessages(true)
                        if (props.newMessageHandler)
                            props.newMessageHandler(true)
                    }
                })
      }, [user])

    return (
        <div className="navArea">
            <div className="btnContainer">
                <Link className="logo" to='/'><img src={logo} alt=''/></Link>
                <Link className="headerNavBtn" to='/search?advertisement=Продаж&realty=Вся%20нерухомість&sort=Спочатку%20нові&page=1'>Купити</Link>
                <Link className="headerNavBtn" to='/search?advertisement=Оренда&realty=Вся%20нерухомість&sort=Спочатку%20нові&page=1'>Орендувати</Link>
            </div>
            <div className="btnContainer">
                <Link className="headerNavBtn addAdvertisement" to='/add-new-advertisement'>Додати оголошення</Link>
                {user.name ? 
                 <div className="drop-down">
                    <div className="drop-down-user-info">
                        <div className="user-header-avatar">
                            <img className="avatar-header" src={user.avatar === '' ? `https://diplomchuma-production.up.railway.app/users/avatar.png` : `https://diplomchuma-production.up.railway.app/users/${user.avatar}`} alt=''/>
                        </div>
                        <span>{user.name}</span>
                        </div>
                    <div className="drop-down-container">
                        <Link className="drop-down-item personally" to='/user/cabinet'>Особистий кабінет</Link>
                        {user.permission > 0 &&
                            <Link className="drop-down-item agency" to={`/agency/${user.agency}/agency`}>Агентство</Link>
                        }
                        <Link className="drop-down-item my-advertisements" to='/user/cabinet/advertisements'>Мої оголошення</Link>
                        <Link className="drop-down-item archive" to='/user/cabinet/archive'>Архів</Link>
                        <Link className="drop-down-item messages" to='/user/cabinet/messages'>Повідомлення{newMessage ? <div className="newMessage">!</div> : ''}</Link>
                        <Link className="drop-down-item chat" to='/user/chat'>Спілкування{newChat ? <div className="newMessage">!</div> : ''}</Link>
                        <Link className="drop-down-item settings" to='/user/cabinet/settings'>Налаштування</Link>
                        <div className="drop-down-item exit" onClick={logoutHandler} >Вихід</div>
                    </div>
                 </div>
                 :
                <Link className="headerBtn signIn" to='/auth/login'>Вхід</Link>
                }
            </div>
        </div>
    );
}