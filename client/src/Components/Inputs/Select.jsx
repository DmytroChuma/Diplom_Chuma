//import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";

 
export default function Select (props) {
    const name = props.name;
    const placeholder = props.placeholder;
    const readonly = props.readonly;
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
        if(!readonly && isOpen){
            SetIsOpen(true);
        }
    }

    const itemClickHandle = (e) => {
        SetSelect(e.target.innerHTML);
        if (typeof props.handleData === 'function') {
            props.handleData(e.target.innerHTML);
        }
        
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
            <input autoComplete="off" required={props.required} ref={ref} onChange={e => SetSelect(e.target.value)} onClick={handleClick} className="list-input" type='text' value={select}  name={name} placeholder={placeholder} readOnly={readonly}/>
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


/*export default class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,
            isOpen: false,
            selected: 0
        };
    }
    render() {

        const handleClick = (e) => {
            e.target.parentElement.getElementsByClassName("arrow")[0].classList.add('show');
            e.target.parentElement.getElementsByClassName("select-list-container")[0].classList.add('show');
        }

        return (
            <div className="list" onClick={(e) => handleClick(e)}>
                <input className="list-input" type='text' name={this.props.name} placeholder={this.props.placeholder} />
                <svg className="arrow">
                   <path d="M0 2 L10 10 L20 2 L18 0 L10 6 L2 0 Z" />
                </svg>
                {this.state.list}
            </div>
        )
    }
}

 */