import React, { useState } from 'react';

export default function UserCard(props) {
    let phone = `(${props.user.phone.substring(0,3)}) ${props.user.phone.substring(3,6)} ${props.user.phone.substring(6)}`
    let hidenPhone = `(${props.user.phone.substring(0,3)}) XXX XXXX`
    const [phoneShow, setPhoneShow] = useState(hidenPhone);
    const [open, setOpen] = useState(false);

    const clickhandler = () => {
        setPhoneShow(phone)
        if (!open) {
            fetch('/add_phone',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: JSON.stringify({id: props.id})
                })
        }
        setOpen(true);
    }

    return(
        <div className='user-card'>
            <span className='user-card-text'>Контактні дані продавця</span>
            <div className='user-card-info'>
                <img className='user-avatar-card' src={'http://localhost:3001/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt=''/>
                <div className='user-info-container'>
                    <span className='userName'>{`${props.user.firstName} ${props.user.lastName}`}</span>
                </div>
            </div>
            <div className='separator'></div>
            <button className='btn' onClick={clickhandler}>{phoneShow}</button>
            <button className='btn'>Написати</button>
        </div>
    );
}