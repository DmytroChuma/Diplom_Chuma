import React from "react";

export default function Date(props){
    return(
        <div className="chat-date">
            <span className="chat-date-span">{props.date}</span>
        </div>
    );
}