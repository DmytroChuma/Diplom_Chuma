import React from 'react';

export default function Dialog(props){

    const clickHandler = () => {
        if (typeof props.clickHandler === 'function') {
            props.clickHandler();
        }
    }

    return(
        <div className={props.type===1 ? 'succes-screen' : 'warning-screen'}>
            <div className={props.type===1 ? 'succes-panel' : 'warning-panel'} onClick={clickHandler}>
                <div className={props.type===1 ? 'succes-icon' : 'warning-icon'} ></div>
                <div className='warning-title' >{props.title}</div>
                <div className='warning-text' >{props.text}</div>
            </div>
        </div>
    );
}