import React from "react";

export default function Confirm ({yesHandler, noHandler, text}) {
    return (
        <div className="modal-window">
            <div className="modal-panel">
                <span className="modal-text">{text}</span>
                <div className="confirm-btn-container">
                    <button className="btn" onClick={yesHandler}>Так</button>
                    <button className="btn" onClick={noHandler}>Ні</button>
                </div>
            </div>
        </div>
    )
}