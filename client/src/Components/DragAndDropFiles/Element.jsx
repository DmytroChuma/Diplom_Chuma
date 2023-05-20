import React from 'react';



export default function Element(props){

    const handleClick = (e) => {
        props.deleteHandler(props.path);
        fetch('/delete_file', {
            method: 'POST',
            mode: 'cors',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({file: props.path})
          })
    }
    return(
        <div className='uploaded-element'>
            {props.path !== undefined && 
            <img alt='' src={"http://192.168.0.105:3001/" + props.path} className='element-img'/>}
            {props.text !== undefined && 
            <div className='element-name'>{props.text}</div>}
            <div className={'delete-element ' + (props.path !== undefined ? "element-img-del" : '' )} onClick={handleClick}></div>
        </div>
    );
}
