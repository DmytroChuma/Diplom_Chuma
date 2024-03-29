import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function UserCard(props) {
    let phone = `(${props.user.phone.substring(0,3)}) ${props.user.phone.substring(3,6)} ${props.user.phone.substring(6)}`
    let hidenPhone = `(${props.user.phone.substring(0,3)}) XXX XXXX`
    const [phoneShow, setPhoneShow] = useState(hidenPhone);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate()

    const clickhandler = () => {
        setPhoneShow(phone)
        if (!open) {
            fetch('https://house-f621.onrender.com/add_phone',
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

    const writeHandler = () => {
        fetch('https://house-f621.onrender.com/create_inbox',
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({id: props.user.id})
        }).then(res=>res.json()).then(data=>{
            navigate(`/user/chat/#${data.inbox}`)
        })
    }

    return(
        <div className='user-card'>
            <span className='user-card-text'>Контактні дані продавця</span>
            <div className='user-card-info'>
                <img className='user-avatar-card' src={'https://house-f621.onrender.com/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt=''/>
                <div className='user-info-container'>
                    {props.user.type === 'Рієлтор' ? <Link className='userName' to={`/realtor/${props.user.id}/realtor`}>{`${props.user.firstName} ${props.user.lastName}`}</Link> : <span className='userName'>{`${props.user.firstName} ${props.user.lastName}`}</span>}
                    <span className='userType'>{props.user.type}</span>
                </div>
            </div>
            <div className='separator'></div>
            <button className='btn' onClick={clickhandler}>{phoneShow}</button>
            {props.show &&<button className='btn' onClick={writeHandler}>Написати</button>}
        </div>
    );
}