import React, {useState,useEffect, useCallback} from "react";

import store from '../../Store/Store';
import MessageCard from "../../Components/Cards/MessageCard";
import NoResult from "../../Components/NoResult";

export default function Messages({dialog, socket, ...props}) {

    const [load, setLoad] = useState(true)
    const [messages, setMessages] = useState([])
    const [user,setUser] = useState({});
    store.subscribe(() => setUser(store.getState().user))


    const loadMessages = useCallback(() => {
        fetch('/get_user_messages',{credentials : "include"}).then((res) => res.json()).then((data) => {
            setMessages(data)
            setLoad(false)
        })
    }, [])

    useEffect(()=>{
        props.newMessageHandler(false)
        fetch('/set_messages_read')
        let item = document.getElementsByClassName('drop-down-item messages')
        let newMess = item[0].getElementsByClassName('newMessage')
        if (newMess.length !== 0) newMess[0].remove();
        
    }, [props])

    useEffect(()=>{
        if (store.getState())
            setUser(store.getState().user)
            setLoad(true)
            setMessages([])
            loadMessages()

    }, [user, loadMessages])

    document.title = 'Повідомлення';

    if(!user) return

    return (
        <div className="cabinet-container">
            {load &&
                <div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>
            }
            {(messages.length === 0 && !load) && 
                <NoResult text='Повідомлень не знайдено' messages={true}/>
            }
            {messages.map((element, index) => {
                return(
                    <MessageCard key={index} dialog={dialog} user={user.name} socket={socket} load={loadMessages} text={element.text} accepted={element.accepted} date={element.date} agency={element.agency} id={element.id}/>
                )
            })}
        </div>
    );
}