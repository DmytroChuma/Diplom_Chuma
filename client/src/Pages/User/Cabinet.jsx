import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import Header from '../../Components/Header/Header';
import Archive from './Archive';
import Messages from './Messages';
import MyAdvertisements from './MyAdvertisements';
import Settings from './Settings';
import InfoUser from './InfoUser';
import AddAgency from '../Agency/AddAgency';
import store from '../../Store/Store';

export default function Cabinet ({dialog, socket}) {
    const navigate = useNavigate()
    const location = useLocation();
    let slug = location.pathname.split('/');
    slug = slug[slug.length - 1];
    const [user, setUser] = useState({});
    const [newChat, setNewChat] = useState(false)
    const [newMessage, setNewMessage] = useState(false)
    store.subscribe(() => setUser(store.getState().user))
    useEffect(()=>{
        if (store.getState()) {
            setUser(store.getState().user)
        }
        if (!store.getState()) {
            navigate(`/`);
            return;
        }
    }, [user])

    let page; 
    switch(slug) {
        case 'advertisements':
            page = <MyAdvertisements dialog={dialog}/>
            break;
        case 'archive':
            page = <Archive dialog={dialog}/>
            break;
        case 'messages':
            page = <Messages newMessageHandler={setNewMessage} dialog={dialog} socket={socket}/>
            break;
        case 'settings':
            page = <Settings dialog={dialog}/>
            break;
        case 'add-agency':
            page = <AddAgency dialog={dialog}/>
            break;
        default:
            page = <InfoUser user={user} socket={socket} dialog={dialog}/>
            break;    
    }

    document.title = 'Особистий кабінет';

    return (
        <div className="app-screen">
            <Header newChatHandler={setNewChat} newMessageHandler={setNewMessage}/>
            <div className='container cabinet'>
                <div className='cabinet-menu'>
                    <Link className={'cabinet-item personally ' + (slug === 'cabinet' ? 'active-i-c' : '')}  to='/user/cabinet'>
                        Особистий кабінет
                    </Link>
                    {user.permission > 0 &&
                        <Link className={'cabinet-item agency '} to={`/agency/${user.agency}/agency`}>Агентство</Link>
                    }
                    <Link className={'cabinet-item my-advertisements ' + (slug === 'advertisements' ? 'active-i-c' : '')} to='/user/cabinet/advertisements'>
                        Мої оголошення
                    </Link>
                    <Link className={'cabinet-item archive ' + (slug === 'archive' ? 'active-i-c' : '')} to='/user/cabinet/archive'>
                        Архів
                    </Link>
                    <Link className={'cabinet-item messages ' + (slug === 'messages' ? 'active-i-c' : '')} to='/user/cabinet/messages'>
                        Повідомлення{newMessage && <div className='newMessageCabinet'>!</div>}
                    </Link>
                    <Link className='cabinet-item chat' to='/user/chat'>
                        Спілкування{newChat && <div className='newMessageCabinet'>!</div>}
                    </Link>
                    <Link className={'cabinet-item settings ' + (slug === 'settings' ? 'active-i-c' : '')} to='/user/cabinet/settings'>
                        Налаштування
                    </Link>
                </div>
                <div className='cabinet-info-container'>
                    {page}
                </div>
            </div>
        </div>
    );
}