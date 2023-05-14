import React, { useEffect } from "react";

export default function Message({text}){
    useEffect(()=>{
        let item = document.getElementsByClassName('drop-down-item messages')
        if (item[0].getElementsByClassName('newMessage').length !== 0) return
        item[0].innerHTML = item[0].innerHTML + '<div class="newMessage">!</div>'
    },[])
    return (
        <div className="message-body">
            {text}
        </div>
    )
}