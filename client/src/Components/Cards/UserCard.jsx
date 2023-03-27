import React from 'react';

export default function UserCard(props) {
    console.log(props.user)
    return(
        <div className='user-card'>
            <span className='user-card-text'>Контактні дані продавця</span>
            <div className='user-card-info'>
                <img className='user-avatar-card' src={'http://localhost:3001/users/' + (props.user.avatar !== '' ? props.user.avatar : 'avatar.png')} alt=''/>
                {//<img className='user-avatar-card' src={'http://localhost:3001/users/' + (props.user.avatar != '') ? 'avatar.png' : 'avatar.png'} alt=''/>
                }
                <div className='user-info-container'>
                    <span className='userName'>{`${props.user.firstName} ${props.user.lastName}`}</span>
                </div>
            </div>
            <div className='separator'></div>
            <button className='btn'>{props.user.phone}</button>
            <button className='btn'>Написати</button>
        </div>
    );
}