import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser'

import Header from '../../Components/Header/Header';
import UserChat from '../../Components/Chat/UserChat';
import Message from '../../Components/Chat/Message';
import store from '../../Store/Store';
import DateMessage from '../../Components/Chat/DateMessage';
import MessageMenu from '../../Components/Chat/MessageMenu';
import Files from '../../Components/Dialogs/Files';


export default function Chat({socket}) {

  const [users, setUsers] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
  const [message, setMessages] = useState([]);
  const [lastUser, setLastUser] = useState(0);
  const [lastDate, setLastDate] = useState('');
  const [editText, setEditText] = useState({});
  const [modal, setModal] = useState('')
  const [scroll, setScroll] = useState(false)
  const [menu, setMenu] = useState('');
 
  const messagesEnd = useRef(null);

  document.title = 'Спілкування';

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate()
  const location = useLocation(); 

  const editHandler = (text, id, type) => {
    setEditText({text: text, id: id, type: type});
  }

  const deleteHandler = useCallback((id, file = '') => {
    socket.emit('delete_message', {id: id, inbox: location.hash.replace('#', ''), file: file});
  }, [location, socket])

  const messageClick = useCallback ((e, className, text, file, id) => {
    e.preventDefault()
    let x = e.clientX;
    let y = e.clientY;
    if (y > document.getElementById("messages-container").offsetHeight - 150 && text !== '') {
      y -= 190;
    }
    else if (y > document.getElementById("messages-container").offsetHeight - 150 && file !== ''){
      y -= 50;
    }
    if (y > document.getElementById("messages-container").offsetHeight - 150 && text !== '' && !className.includes('my')) {
      y = e.clientY - 90;
    }
    let menu;
    if (className.includes('my') && text !== '') {
      menu = <MessageMenu cX={x} cY={y} socket={socket} text={text} id={id} menu={setMenu} editHandler={editHandler} full={true} deleteHandler={deleteHandler}/>
    }
    else if (className.includes('my') &&  text === '') {
      menu = <MessageMenu cX={x} cY={y} socket={socket} text={file} id={id} menu={setMenu} file={true} deleteHandler={deleteHandler} editHandler={editHandler}/>
    }
    else if (!className.includes('my') &&  text !== '') {
      menu = <MessageMenu cX={x} cY={y} options socket={socket} text={text} id={id} menu={setMenu} editHandler={editHandler}/>
    }
    setMenu(menu);
  }, [socket, deleteHandler])

  
  const createUserCards = (data, inbox) => {
    if (location.hash === '') {
      setMessages('')
    }
    let cards = [];
    for (let card of data) {
      socket.emit("join_room", `inbox_${card.inbox_id}`)
      let newC = false;
      for (let i of inbox) {
        if (i.inbox === card.inbox_id){
          newC = true;
        }
      }
      if (!card.message) 
        card.message='' 
      cards.push(<UserChat active={location.hash.replace('#', '') === card.inbox_id ? true : false} newMessages={newC} socket={socket} key={card.inbox_id} user={card}/>);

    }
    return cards;
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
      setLastDate(messageDate);
      if (message.user_id !== store.getState().user.id && message.user_id !== lastUser) {avatar = message.avatar; margin = ''}
      
      lastUser = message.user_id;
      messages.push(<Message key={message.id} handleClick={messageClick} id={message.id} text={message.message} file={message.file !== '' ? JSON.parse(message.file) : ''} date={message.date} avatar={avatar} class={(message.user_id === store.getState().user.id ? 'my' : '') + margin} answear={message.answear} amessage={message.answear_message} socket={socket}/>);
    }
    return messages;
  }, [socket, messageClick]);

  useEffect(()=>{
    if (!store.getState()) {
      navigate('/')
      return
    }
    const load = async() => {
      await fetch('/new_chat').then((res)=>res.json()).then((inbox)=>{
        fetch('/chat').then((res) => res.json()).then((data) => {
         let users = createUserCards(data, inbox.length > 0 ? inbox : [])
          setUsers(users.length === 0 ? <div className='user-c-m'>У вас немає повідомлень</div> : users);
        })
      })
    }
    load();
    const closeHandler = (e) => {
      if(!e.target.classList.contains('contex-menu') && !e.target.classList.contains('context-menu-item')){
        setMenu('');
      }
    }

    document.addEventListener("mouseup",(e) =>  closeHandler(e));
      return () => document.removeEventListener("mouseup",(e) => closeHandler(e));
  }, [])

  useEffect(()=>{
    if (location.hash === '') {
      setMessages('')
      let elements = document.getElementsByClassName("user-chat-card");
        for (let element of elements){
           element.classList.remove("active");
        }
        if (Array.isArray(users))
          for(let user of users) {
            socket.emit('leave_room', user.key)
          }
      return
    }
    if (location.hash !== '') {
      let hash = location.hash.replace('#', '')
      socket.emit("join_room", hash);
    }
    fetch('/messages?inbox='+location.hash.replace('#', '')).then((res) => res.json()).then((data) => {
      setMessages(createMessages(data));
    })
  }, [location, createMessages, socket, users])

  useEffect(()=>{
    setScroll(false)
    socket.on('receive_message', (data)=> {
      if (location.hash.replace('#', '') === '') return
      let avatar = false
      let margin = ' margin'
      
      if (data.user_id !== store.getState().user.id && data.user_id !== lastUser ) {avatar = data.avatar; margin = '';}
      setLastUser(data.user_id);
      let messageDate = new Date(Date.parse(data.date)).toLocaleDateString()

      let mess = <Message key={data.id} id={data.id} socket={socket} handleClick={messageClick} text={data.message} file={data.file !== '' ? data.file : ''} date={data.date} avatar={avatar} class={(data.user_id === store.getState().user.id ? 'my' : '') + margin} answear={data.answear} amessage={data.a_message} />
      if (messageDate !== lastDate) 
        setMessages([...message, <DateMessage key={messageDate} date={messageDate}/>, mess]);
      else
        setMessages([...message, mess]);
      if (messageDate !== lastDate)
        setLastDate(messageDate);
        if (data.user_id === store.getState().user.id)  setScroll(true)
  })

  socket.on('edit_message', (data) => {
    let newMessages = [];
    for (let mess of message) {
      if(mess.props.id === data.id){
        newMessages.push(<Message key={data.id} id={data.id} socket={socket} handleClick={mess.props.handleClick} text={data.message} date={mess.props.date} file='' avatar={mess.props.avatar} class={mess.props.class} answear={mess.props.answear} amessage={mess.props.amessage}/>)
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

  if (scroll) scrollToBottom();
 },[message, lastUser, scroll, socket, messageClick, lastDate])

const sendHandler = () => {
  if (document.getElementById("input-div").textContent.trim() === '') {
    return false;
  }
  if (editText.type === 'edit') {
    setEditText({});
    socket.emit('edit_message', {
      message: document.getElementById("input-div").innerHTML, 
      inbox: location.hash.replace('#', ''), 
      id: editText.id, 
      last: message[message.length-1].props.id === editText.id
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
    a_message: editText.type ? editText.text : ''  ,
    file: ''
  });
  document.getElementById("input-div").innerHTML = '';
  setEditText({});
}
 
const attachHandler = (e) => {
  if (e.target.files.length > 0) {
    let files = []
    for (let file of e.target.files){
      files.push(file)
    }
    setModal(<Files modalHandler={setModal} files={files} socket={socket} user={store.getState().user}/>)
  }
}

 return (
    <div className="app-screen no-scroll">
        {modal}
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
          {location.hash !== '' &&  
          <div className='chat-input-row'>
            <div className='input-div-cont'>
              {editText.text && <div className='input-div-edit'>
                <div className={'edit-chat-mess ' + editText.type}>
                    <span className='chat-span'>
                      <span>{editText.type === 'edit' ? 'Редагування' : 'Відповісти' }</span>
                      <span>{parse(editText.text)}</span>
                    </span>
                </div>
                <button className='edit-chat-mess-btn' onClick={() => setEditText({})}></button>
              </div>}
              <div className='input-div-message'>
                <div className='input-div' id='input-div' contentEditable suppressContentEditableWarning={true}>{editText.type === 'edit' ? parse(editText.text) : ''}</div>
                <input type='file' id='file-attach' style={{display: 'none'}} onChange={attachHandler} onClick={(e) => e.target.value = null} multiple/>
                <label htmlFor='file-attach' className="btn btn-chat-attach fa fa-paperclip"></label>
              </div>
            </div>
            <button onClick={sendHandler} className='btn btn-chat fa fa-send'></button>
          </div>
        }
      </div>
    </div>
    </div>
 );
}
 