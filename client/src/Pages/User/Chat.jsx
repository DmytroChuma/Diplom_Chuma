import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom';
import {io} from 'socket.io-client'

import Header from '../../Components/Header/Header';
import UserChat from '../../Components/Chat/UserChat';
import Message from '../../Components/Chat/Message';
import store from '../../Store/Store';
import DateMessage from '../../Components/Chat/DateMessage';
import MessageMenu from '../../Components/Chat/MessageMenu';

const socket = io('http://localhost:3001')

export default function Chat() {

  const [users, setUsers] = useState([]);
  const [message, setMessages] = useState([]);
  const [lastUser, setLastUser] = useState(0);
  const [lastDate, setLastDate] = useState('');
  const [editText, setEditText] = useState({});

  //const itemsRef = useRef([]);
  //const [active, setActive] = useState('');

  const [menu, setMenu] = useState('');
  const messagesEnd = useRef(null);
 
  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const location = useLocation(); 

  const editHandler = (text, id, type) => {
    setEditText({text: text, id: id, type: type});
  }

  const deleteHandler = (id) => {
    socket.emit('delete_message', {id: id, inbox: location.hash.replace('#', '')});
  }

  const messageClick = (e, className, text, id) => {
    let x = e.clientX;
    let y = e.clientY;
    if (y > document.getElementById("messages-container").offsetHeight - 150) {
      y -= 190;
    }
    let menu;
    if (className.includes('my')) {
      menu = <MessageMenu cX={x} cY={y} socket={socket} text={text} id={id} menu={setMenu} editHandler={editHandler} full={true} deleteHandler={deleteHandler}/>
    }
    else {
      menu = <MessageMenu cX={x} cY={y} socket={socket} text={text} id={id} menu={setMenu} editHandler={editHandler}/>
    }
    setMenu(menu);
  }

  
  const createUserCards = useCallback((data) => {
    let cards = [];
  //  for (let i = 0 ; i < data.length; i++) {
    //  cards.push(<UserChat ref={el => itemsRef.current[index] = el} active={location.hash.replace('#', '') === data[i].inbox_id ? true : false} socket={socket} key={data[i].inbox_id} user={data[0]}/>);
     // console.log(data[i]);
   // }
    for (let card of data) {
      cards.push(<UserChat active={location.hash.replace('#', '') === card.inbox_id ? true : false} socket={socket} key={card.inbox_id} user={card}/>);
    }
    return cards;
  }, [location])

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
      setLastDate(messageDate);
      if (message.user_id !== store.getState().user.id && message.user_id !== lastUser) {avatar = message.avatar; margin = ''}
      
      lastUser = message.user_id;
      messages.push(<Message key={message.id} handleClick={messageClick} id={message.id} text={message.message} date={message.date} avatar={avatar} class={(message.user_id === store.getState().user.id ? 'my' : '') + margin} answear={message.answear} amessage={message.answear_message} socket={socket}/>);
    }
    return messages;
  }, []);

  useEffect(()=>{
    
    fetch('/chat').then((res) => res.json()).then((data) => {
      setUsers(createUserCards(data));
    })
    const closeHandler = (e) => {
      if(!e.target.classList.contains('contex-menu') && !e.target.classList.contains('context-menu-item')){
        setMenu('');
      }
    }

    document.addEventListener("mouseup",(e) =>  closeHandler(e));
      return () => document.removeEventListener("mouseup",(e) => closeHandler(e));
  }, [createUserCards])

  useEffect(()=>{
    if (location.hash === '') return
    if (location.hash !== '') {
      let hash = location.hash.replace('#', '')
      socket.emit("join_room", hash);

      //  itemsRef.current[0].click();
    /*  if (itemsRef.current.length > 0 && active === '') {
        itemsRef.current[0].click();
        setActive('1');
      }*/

     /* for (let element of users) {
        if (element.key === hash){
          console.log(element);
        }
      }*/
    }
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
    let messageDate = new Date(Date.parse(data.date)).toLocaleDateString()
    let mess = <Message key={data.id} id={data.id} handleClick={messageClick} text={data.message} date={data.date} avatar={avatar} class={(data.user_id === store.getState().user.id ? 'my' : '') + margin} answear={data.answear} amessage={data.a_message} />
    if (messageDate !== lastDate) 
      setMessages([...message, <DateMessage key={messageDate} date={messageDate}/>, mess]);
    else
      setMessages([...message, mess]);
    if (messageDate !== lastDate)
      setLastDate(messageDate);
  })

  socket.on('edit_message', (data) => {
    let newMessages = [];
    for (let mess of message) {
      if(mess.props.id === data.id){
        newMessages.push(<Message key={data.id} id={data.id} handleClick={mess.props.handleClick} text={data.message} date={mess.props.date} avatar={mess.props.avatar} class={mess.props.class} answear={mess.props.answear} amessage={mess.props.amessage}/>)
        continue;
      }
      newMessages.push(mess);
    }
    setMessages(newMessages);
  })

  socket.on('delete_message', (data) => {
    let items = [];
    let last;
    for (let element of message){
      if (element.key !== data.id.toString() && !Array.isArray(element)) {
        items.push(element);
        if (element.props.id) {
          last = element;
        }
      }
    }
    setMessages(items);
 
    if (last !== undefined) {
      if (last.props.id) {
        socket.emit('last_mess', {inbox: data.inbox, message: last.props.text, date: last.props.date})
      }
    }
  })

  scrollToBottom();
 },[message, lastUser])

const sendHandler = () => {
  if (editText.type === 'edit') {
    setEditText({});
    socket.emit('edit_message', {
      message: document.getElementById("input-div").innerHTML, 
      inbox: location.hash.replace('#', ''), 
      id: editText.id, 
      last: message[message.length-1].props.id == editText.id
    })
    document.getElementById("input-div").innerHTML = '';
    return;
  }
  socket.emit('send_message', 
  {
    message: document.getElementById("input-div").innerHTML, 
    date: new Date(), 
    user_id: store.getState().user.id, 
    avatar: store.getState().user.avatar, 
    inbox: location.hash.replace('#', ''), 
    answear: editText.type ? editText.id : 0,
    a_message: editText.type ? editText.text : ''  
  });
  document.getElementById("input-div").innerHTML = '';
  setEditText({});
}
 
const attachHandler = () => {
  
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
      
          <div className='messages-container' id='messages-container'>
            {message}
            <div ref={messagesEnd} />
          </div>
          <div className='chat-input-row'>
            <div className='input-div-cont'>
              {editText.text && <div className='input-div-edit'>
                <div className={'edit-chat-mess ' + editText.type}>
                    <span className='chat-span'>
                      <span>{editText.type === 'edit' ? 'Редагування' : 'Відповісти' }</span>
                      <span>{editText.text}</span>
                    </span>
                </div>
                <button className='edit-chat-mess-btn' onClick={() => setEditText({})}></button>
              </div>}
              <div className='input-div-message'>
                <div className='input-div' id='input-div' contentEditable suppressContentEditableWarning={true}>{editText.type === 'edit' ? editText.text : ''}</div>
                <button onClick={attachHandler} className='btn btn-chat-attach fa fa-paperclip'></button>
              </div>
            </div>
            <button onClick={sendHandler} className='btn btn-chat fa fa-send'></button>
          </div>
      </div>
    </div>
    </div>
 );
}
 