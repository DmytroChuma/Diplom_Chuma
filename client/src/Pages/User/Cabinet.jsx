import React from 'react';
import { Link, useLocation } from "react-router-dom";

import Header from '../../Components/Header/Header';
import Archive from './Archive';
import Messages from './Messages';
import MyAdvertisements from './MyAdvertisements';
import Settings from './Settings';
import InfoUser from './InfoUser';

export default function Cabinet () {

    const location = useLocation();
    let slug = location.pathname.split('/');
    slug = slug[slug.length - 1];

    let page; 
    switch(slug) {
        case 'advertisements':
            page = <MyAdvertisements/>
            break;
        case 'archive':
            page = <Archive/>
            break;
        case 'messages':
            page = <Messages />
            break;
        case 'settings':
            page = <Settings />
            break;
        default:
            page = <InfoUser />
            break;    
    }

    return (
        <div className="app-screen">
            <Header />
            <div className='container cabinet'>
                <div className='cabinet-menu'>
                    <Link className={'cabinet-item personally ' + (slug === 'cabinet' ? 'active-i-c' : '')}  to='/user/cabinet'>
                        Особистий кабінет
                    </Link>
                    <Link className={'cabinet-item my-advertisements ' + (slug === 'advertisements' ? 'active-i-c' : '')} to='/user/cabinet/advertisements'>
                        Мої оголошення
                    </Link>
                    <Link className={'cabinet-item archive ' + (slug === 'archive' ? 'active-i-c' : '')} to='/user/cabinet/archive'>
                        Архів
                    </Link>
                    <Link className={'cabinet-item messages ' + (slug === 'messages' ? 'active-i-c' : '')} to='/user/cabinet/messages'>
                        Повідомлення
                    </Link>
                    <Link className='cabinet-item chat' to='/user/chat'>
                        Спілкування
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