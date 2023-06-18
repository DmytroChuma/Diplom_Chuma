import React, {useEffect, useState} from "react";
import CabinetCard from "../../Components/Cards/CabinetCard";
import Confirm from "../../Components/Dialogs/Confirm";

import store from '../../Store/Store';
import UserLogin from "../../Store/ActionsCreators/UserLogin";

export default function InfoUser ({userInfo, socket, dialog}) {
    const [user,setUser] = useState(userInfo);
    const [data, setDate] = useState('');
    const [cards, setCards] = useState('')
    const [modal, setModal] = useState('');
    store.subscribe(() => setUser(store.getState().user))

    useEffect(() => {
        if (store.getState())
            setUser(store.getState().user)
        fetch('https://diplomchuma-production.up.railway.app/user_info',{credentials : "include"}).then((res) => res.json()).then((data) => {
            setDate(data)
        })
        fetch('https://diplomchuma-production.up.railway.app/user_cards_info',{credentials : "include"}).then((res) => res.json()).then((data) => {
            setCards(data[0])
        })  
    },[user])

    const cancel = () => {
        setModal('');
    }

    const deleteHandler = () => {
        const yes = () => {
            socket.emit('leave_room', cards.id)
            socket.emit('message_body', {agency: cards.id, text: `Власник видалив агентство`})
            socket.emit('leave_agency', cards.id)
            let userInfo = user
            userInfo.permission = 0
            userInfo.agency = 0
            fetch('https://diplomchuma-production.up.railway.app/delete_agency',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials : "include",
                mode: 'cors',
                body: JSON.stringify({agency: cards.id, name: cards.name})
                
            }).then(res=>res.json()).then(data => {
                if(data.success === 1) {
                    dialog('Успіх', `Ви видалили агентство`, 1)
                }
            })
            store.dispatch(UserLogin(userInfo));
            setModal('')
        }
        setModal(<Confirm text='Ви точно хочете видалити агентство?' noHandler={cancel}  yesHandler={yes}/>)
    }

    const exitHandler = () => {
        const yes = () => {
            socket.emit('leave_room', cards.id)
            socket.emit('message_body', {agency: cards.id, text: `Рієлтор ${user.name}, вийшов з агентства`})
            let userInfo = user
            userInfo.permission = 0
            userInfo.agency = 0
            fetch('https://diplomchuma-production.up.railway.app/leave_agency',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials : "include",
                mode: 'cors',
                body: JSON.stringify({agency: cards.id, name: user.name})}).then(res=>res.json()).then(data => {
                    if(data.success === 1) {
                        dialog('Успіх', `Ви вийшли з агентства "${cards.name}"`, 1)
                    }
                })
            store.dispatch(UserLogin(userInfo));
            setModal('')
        }
        setModal(<Confirm text='Ви точно хочете вийти з агентства?' noHandler={cancel}  yesHandler={yes}/>)
    }

    if(!data) return
    if(!user) return
    if (!cards) return
    
    return(
        <div className="cabinet-container">
            {modal}
            <div className="user-info-card">
                <div className="user-i-n">
                    <div className="user-image-cabinet-container">
                        <img className="user-image-cabinet" src={user.avatar === '' || !user.avatar ? 'https://diplomchuma-production.up.railway.app/users/avatar.png' : `https://diplomchuma-production.up.railway.app/users/${user.avatar}`} alt=''/>
                    </div>
                    <div className="user-cabinet-name">
                        {user.name}
                    </div>
                </div>
                <div className="user-cabinet-info-container">
                    <span className="cabinet-user-info">Область: {data.region}</span>
                    <span className="cabinet-user-info">Місто: {data.city}</span>
                </div>
                <div className="user-cabinet-info-container">
                    <span className="cabinet-user-info">Телефон: {`(${data.phone.substring(0,3)}) ${data.phone.substring(3,6)} ${data.phone.substring(6)}`}</span>
                    <span className="cabinet-user-info">Email: {data.email}</span>
                </div>
            </div>
            <div className="separator"></div>
            <div className="cabinet-cards-container">
                <CabinetCard link='/add-new-advertisement' linkText='Створити нове'>
                    <div className="card-info-user">Всього опубліковано оголошень:<div className="digit">{cards.publicated}</div></div>
                </CabinetCard>
                <CabinetCard link='/user/cabinet/archive' linkText='В архів'>
                    <div className="card-info-user">Оголошень в архіві:<div className="digit">{cards.archivated}</div></div>
                </CabinetCard>
                <CabinetCard link='/select' linkText='Переглянути всі'>
                    <div className="card-info-user">Обрані оголошення:<div className="digit">{JSON.parse(localStorage.getItem('select')).length}</div></div>
                </CabinetCard>
                <CabinetCard link={user.permission > 0 ? '' : '/user/cabinet/add-agency'} clickHandler={user.permission === 1 ? exitHandler : user.permission === 2 ? deleteHandler : () => {}} linkText={user.permission === 1 ? 'Вийти з агентства' : user.permission === 2 ? 'Видалити агентство' : 'Створити агентство'}>
                    <div className="card-info-user">Агентство:
                        {(cards.name && user.permission > 0) && <div className="digit">
                            <div className="cards-logo-agency">
                                <div className="cards-logo-img-container">
                                    <img className="cards-logo-img" src={cards.logo === '' ? 'https://diplomchuma-production.up.railway.app/images/default.png' : `https://diplomchuma-production.up.railway.app/images/agency/${cards.logo}`} alt=''/>
                                </div>
                                <div className="cards-logo-name">
                                    {cards.name}
                                </div>
                            </div>
                        </div>}
                        {user.permission === 0 && 
                            <div className="digit">
                                Немає агентства
                            </div>
                        }
                    </div>
                </CabinetCard>
            </div>
        </div>
    )
}