import React, { useState, useEffect } from 'react';

function PageButton(props) {

    const clickHandler = () =>{
        if (typeof props.handler === 'function') {
            props.handler(props.text);
        }
    }

    return(
        <button onClick={clickHandler} className={'page-button ' + props.class}>{props.text}</button>
    );
}

export default function Pages(props) {
    
    const [buttons, setButtons] = useState('');
    const [active, setActive] = useState(props.activePage);

    const toggleActive = (index) => {
        let buttons = document.getElementsByClassName('page-button');
        for (let i = 0 ; i < buttons.length; i++) {
            buttons[i].classList.remove("active-page");
            if (buttons[i].innerHTML === index) {
                buttons[index].classList.add("active-page");
            }
        }
    } 

    const clickHandler = (page) => {
        setActive(page);
        props.pageHandle(page);
        toggleActive(page);
    }

    function createButton (start, end) {
        let buttons = [];

        for (let i = start; i <= end; i++) {
            buttons.push(<PageButton handler={clickHandler} key={i} class={i === parseInt(active) ? 'active-page' : ''} text={i}/>);
        }
        return buttons;
    }

    const backHandler = () => {
       if (active-1 < 1) return;
       setActive((active-1));
       props.pageHandle(active-1);
    }

    const nextHandler = () => {
        if (active+1 > props.pages) return;
        setActive((active+1));
        props.pageHandle(active+1);
    }

    useEffect( () => {
        let buttons = [];
         
        buttons.push(<PageButton handler={backHandler} key='back' text='&#60;'/>);
        if (props.pages <= 10) {
            buttons.push(createButton(1,props.pages));
        }
        else if (props.pages > 10 && active < 5){
            buttons.push(createButton(1,6));

            buttons.push(<PageButton class='other' key='...' text='...'/>);
            buttons.push(<PageButton handler={clickHandler} key={props.pages} class={props.pages === parseInt(active) ? 'active-page' : ''} text={props.pages}/>);
        }
        else if (active >= 5 && active + 3 != props.pages && active + 3 < props.pages) {
            buttons.push(<PageButton handler={clickHandler} key={1} class={1 === parseInt(active) ? 'active-page' : ''} text={1}/>);
            buttons.push(<PageButton class='other' key='other' text='...'/>);
            buttons.push(createButton(active -2,active+2));
            buttons.push(<PageButton class='other' key='...' text='...'/>);
            buttons.push(<PageButton handler={clickHandler} key={props.pages} class={props.pages === parseInt(active) ? 'active-page' : ''} text={props.pages}/>);
        }
        else if (active + 3 >= props.pages) {
            buttons.push(<PageButton handler={clickHandler} key={1} class={1 === parseInt(active) ? 'active-page' : ''} text={1}/>);
            buttons.push(<PageButton class='other' key='other' text='...'/>);
            buttons.push(createButton(active === parseInt(props.pages) ? active - 3 : active - 2,props.pages));
        }
        buttons.push(<PageButton handler={nextHandler} key='next' text='&#62;'/>);
        setButtons(buttons);
    }, [props, active])  

    return (
        <div className="pages-container">
            {buttons}
        </div>
    );
}