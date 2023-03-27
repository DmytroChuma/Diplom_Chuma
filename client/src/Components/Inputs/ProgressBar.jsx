import React from 'react';

export default function ProgressBar({value, show}){
    return(
        <div className={'progressbar-container ' + (show ? 'show' : '' )}>
            <progress value={value} max='100' />
            <span className='progress-text'>{value}</span>
        </div>
    );
}