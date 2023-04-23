import React, { useEffect, useState, useRef } from "react";

export default function Select (props) {
    const name = props.name;
    const placeholder = props.placeholder;
    const list = props.list;

    const [isOpen, SetIsOpen] = useState(false);

    const [select, SetSelect] = useState('');

    const ref = useRef();

    useEffect(() => {
        const closeHandler = (e) => {
                if(e.target !== ref.current){
                SetIsOpen(false);
              }
        }
        document.addEventListener("mouseup",(e) =>  closeHandler(e));
        return () => document.removeEventListener("mouseup",(e) => closeHandler(e));
        
    }, [isOpen]);

    const handleClick = (e) => {
        if (!list) {
            return;
        }
        SetIsOpen((prev) => !prev);
    }

    const itemClickHandle = (e) => {
        
        SetSelect(e.target.innerHTML);
        if (typeof props.handleData === 'function') {
            props.handleData(e.target.innerHTML);
        }

        SetIsOpen(false)
    }
     
    useEffect(() => {
        let value = props.value
        if (!value) {
           value = '';
        }
        SetSelect(value);
      }, [props.value]); 


    let items = [];
    for (let i = 0 ; i < list.length; i++) {
        items.push(<div key={i} onClick={(e) => itemClickHandle(e)} className="select-item">{list[i]}</div>);
    }
     
    return (
        <div className={"list " + props.class}>
            <input autoComplete="off" onClick={handleClick} required={props.required} ref={ref} className="list-input" type='text' value={select}  name={name} placeholder={placeholder} readOnly={true}/>
            <svg className={"arrow " + (isOpen ? "show" : "")}>
               <path d="M0 2 L10 10 L20 2 L18 0 L10 6 L2 0 Z" />
            </svg>
            <div className={"select-list-container " + (isOpen ? "show" : "")}>
                <div className="items-container">
                    {items}
                </div>
            </div>
        </div>
    )

}