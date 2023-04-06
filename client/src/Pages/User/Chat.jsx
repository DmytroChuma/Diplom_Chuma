import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom';
import {io} from 'socket.io-client'

import Header from '../../Components/Header/Header';
import UserChat from '../../Components/Chat/UserChat';
import Message from '../../Components/Chat/Message';
import Input from '../../Components/Inputs/Input';
import store from '../../Store/Store';
import useInput from '../../Hook/useInput';
import DateMessage from '../../Components/Chat/DateMessage';
import MessageMenu from '../../Components/Chat/MessageMenu';

const socket = io('http://localhost:3001')

const createUserCards = (data) => {
  let cards = [];
  for (let card of data) {
    cards.push(<UserChat socket={socket} key={card.inbox_id} user={card}/>);
  }
  return cards;
}

export default function Chat() {

  const [users, setUsers] = useState([]);
  const [message, setMessages] = useState([]);
  const [lastUser, setLastUser] = useState(0);

  const [menu, setMenu] = useState('');
  const messageText = useInput('');
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const location = useLocation(); 

  const messageClick = (e, className) => {
    if (className.includes('my')) {
      setMenu(<MessageMenu cX={e.clientX} cY={e.clientY} socket={socket}/>);
      console.log(`${e.clientX} ${e.clientY}`);
    }
  }

  const createMessages = useCallback((data) => {
    let messages = [];
    let lastUser = 0;
    let date = '';
    for (let message of data) {
      let avatar = false;
      let margin = ' margin';
      let messageDate = new Date(Date.parse(message.date)).toLocaleDateString()
      if (messageDate !== date) {messages.push(<DateMessage key={messageDate} date={messageDate}/>); lastUser = 0;}
      date = messageDate
      if (message.user_id !== store.getState().user.id && message.user_id !== lastUser) {avatar = message.avatar; margin = ''}
      
      lastUser = message.user_id;
      messages.push(<Message key={message.id} handleClick={messageClick} text={message.message} date={message.date} avatar={avatar} class={(message.user_id === store.getState().user.id ? 'my' : '') + margin} />);
    }
    return messages;
  }, []);

  useEffect(()=>{
    fetch('/chat').then((res) => res.json()).then((data) => {
      setUsers(createUserCards(data));
    })
    
  }, [])

  useEffect(()=>{
    if (location.hash === '') return
    fetch('/messages?inbox='+location.hash.replace('#', '')).then((res) => res.json()).then((data) => {
      setMessages(createMessages(data));
    })
  }, [location, createMessages])
  
  useEffect(()=>{
    socket.on('connect', ()=>console.log(socket.id))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect(),3000) 
    })
    
   socket.on('receive_message', (data)=> {
    let avatar = false;
    let margin = ' margin'
    if (data.user_id !== store.getState().user.id && data.user_id !== lastUser ) {avatar = data.avatar; margin = '';}
    setLastUser(data.user_id);
    setMessages([...message, <Message key={message.length+1} handleClick={messageClick} text={data.message} date={data.date} avatar={avatar} class={(data.user_id === store.getState().user.id ? 'my' : '') + margin} />])
  })
  scrollToBottom();
 },[message, lastUser])

 const sendHandler = () => {
    socket.emit('send_message', {message: messageText.value, date: new Date(), user_id: store.getState().user.id, avatar: store.getState().user.avatar, inbox: location.hash.replace('#', '')});
 }
 
 return (
    <div className="app-screen no-scroll">
        {menu}
        <Header />
    <div className="container chat-cont">
      <div className='users-column'>
        <div className='user-cards-container'>
          {users}
        </div>
      </div>
      <div className='messages-column'>
      
          <div className='messages-container'>
            {message}
            <div ref={messagesEnd} />
          </div>
          <div className='chat-input-row'>
            <Input hook_input={messageText} type='text' placeholder='Повідомлення' />
            <button onClick={sendHandler} className='btn'></button>
          </div>
      </div>
    </div>
    </div>
 );
}
 