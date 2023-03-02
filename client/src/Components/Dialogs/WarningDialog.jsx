import React from 'react';

export default function WarningDialog(props){
    return(
        <div className='warning-panel'>
            <div className='warning-text' >{props.text}</div>
        </div>
    );
}