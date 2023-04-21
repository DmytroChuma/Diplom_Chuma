import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {io} from 'socket.io-client'

import "./App.css";
import "./font-awesome.css";
import Dialog from "./Components/Dialogs/Dialog";
 
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Registration from "./Pages/Auth/Registration";
import Search from "./Pages/Search";
import NotFoundPage from "./Pages/NotFoundPage";
import Advertisement from "./Pages/Advertisement";
import NewAdvertisement from "./Pages/NewAdvertisement";
import Forget from "./Pages/Auth/Forget";
import Cabinet from "./Pages/User/Cabinet";
import Chat from "./Pages/User/Chat";
import Select from "./Pages/Select";
import Realtor from './Pages/Realtor/Realtor';

import store from "./Store/Store";
import UserLogin from "./Store/ActionsCreators/UserLogin";
import userSelect from "./Store/ActionsCreators/UserSelect";
import Agency from "./Pages/Agency/Agency";
import Message from "./Message";
import Forbidden from "./Pages/Forbidden";

const socket = io('http://localhost:3001')

function App() {
  
  const [dialog, setDialog] = useState('')
  const [message, setMessage] = useState('')
  const [user,setUser] = useState({})

  let timeOut;
  let timeMessage;

  if (!localStorage.getItem('card'))
    localStorage.setItem('card', 0);
    if (!localStorage.getItem('select'))
      localStorage.setItem('select', "[]")

      useEffect(()=>{
        //socket.on('connect', ()=>console.log(socket.id))
        socket.on('connect_error', ()=>{
          setTimeout(()=>socket.connect(),3000) 
        })
        
        socket.on('message_body', (data) => {
          setMessage(
          <div className="messages-time-container" >
              <Message text={data.text} />
          </div>)
          clearTimeout( timeMessage );
          timeMessage = setTimeout(() => {
            setMessage('');
          }, 5000);  
        })

        socket.on('leave_agency', (data) => {
          socket.emit("leave_room", data);
          let user = store.getState().user
          user.permission = 0
          user.agency = 0
          store.dispatch(UserLogin(user));
        })
      })

    useEffect(() => {
      const authUser = async () => {
        await fetch('/auth').then((res) => res.json()).then((data) => {
          let user = {id: data.id, name: data.name, avatar: data.avatar, permission: data.permission, agency: data.agency}
          store.dispatch(UserLogin(user));
          store.dispatch(userSelect(data.select))
          socket.emit("join_room", data.id);
          if (data.agency !== 0)
            socket.emit("join_room", data.agency);
        });

      }
      authUser();
    }, [])


  function clearDialog(){
    setDialog('');
    clearTimeout( timeOut );
}

const handleDialog = (title, text, type=0) => {
    setDialog(<Dialog clickHandler={clearDialog} title={title} text={text} type={type} />);
    clearTimeout( timeOut );
    timeOut = setTimeout(() => {
        setDialog('');
    }, 5000);  
  }

  return (
    <div className="app">
      <Router>
        {dialog}
        {message}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/auth/login" element={<Login dialog={handleDialog} socket={socket}/>} />
            <Route exact path="/auth/forget" element={<Forget dialog={handleDialog}/>} />
            <Route exact path="/auth/registration" element={<Registration dialog={handleDialog}/>} />
            <Route exact path="/search" element={<Search />}></Route>
            <Route exact path="/select" element={<Select />}></Route>
            <Route exact path="/search/:params" element={<Search />}></Route>
            <Route exact path="/advertisement/:slug" element={<Advertisement dialog={handleDialog}/>}></Route>
            <Route exact path="/add-new-advertisement" element={<NewAdvertisement user={user} dialog={handleDialog} />}></Route>
            <Route exact path="/edit-advertisement/:slug" element={<NewAdvertisement user={user} dialog={handleDialog} />}></Route>
            <Route exact path="/user/cabinet" element={<Cabinet dialog={handleDialog} socket={socket}/>}></Route>
            <Route exact path="/user/cabinet/:slug" element={<Cabinet dialog={handleDialog} socket={socket}/>}></Route>
            <Route exact path="/agency/:id/:slug" element={<Agency dialog={handleDialog} socket={socket}/>}></Route>
            <Route exact path="/realtor/:id/:slug" element={<Realtor />}></Route>
            <Route exact path="/user/chat" element={<Chat socket={socket} />}></Route>
            <Route exact path="/403" element={<Forbidden />}></Route>
            <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;