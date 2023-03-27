import React from 'react';

export default function Loading(props){
    return(
        <div className='loading-screen'>
            <div className="loading">
                <div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>
                {props.text}
            </div>
        </div>
    );
}