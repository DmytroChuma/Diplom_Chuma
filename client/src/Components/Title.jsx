import React from "react";

export default function Title(props) {
    return (
        <div className="title-container">
            <span className={"title-text " + props.type}>{props.text}</span>
        </div>
    )
}