import React, { useState, useEffect, forwardRef } from "react";

import Checkbox from "./Checkbox";
import Radiobutton from "./Radiobutton";

const Filter = forwardRef((props, ref) => {
    const [isOpen, SetIsOpen] = useState(false);
    
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems([]);
        let items = [];
        for (let i = 0 ; i < props.options.length; i++) {
            let options = [];
            for (let o = 0; o < props.options[i].options.length; o++) {
                let checked = 0;
                if (props.parameters[props.options[i].name]) {
                   
                    if (Array.isArray(props.parameters[props.options[i].name])) {
                        if (props.parameters[props.options[i].name].includes(props.options[i].options[o])) {
                            checked = 1
                        }
                        else if (props.options[i].value) {
                            if (props.parameters[props.options[i].name].includes(props.options[i].value[o])) {
                                checked = 1
                            }
                        }
                    }
                    else {
                        if (props.parameters[props.options[i].name] === props.options[i].options[o]) {
                            checked = 1
                        }
                        else if (props.options[i].value) {
                            if (props.parameters[props.options[i].name] === props.options[i].value[o]) {
                                checked = 1
                            }
                        } 
                    }
                }
                if (props.options[i].type === 1) {
                    
                    options.push(
                        <Checkbox key={o} checked={checked} dataHandler={props.dataHandler} name={props.options[i].name +"[]"} value={props.options[i].value ? props.options[i].value[o] : props.options[i].options[o] } labelClass='filter-check' class="checkmark checkmark-filter" text={props.options[i].options[o]}/>
                    );
                     
                }
                else {
                    options.push(
                        <Radiobutton key={o} dataHandler={props.dataHandler} checked={o === 0 && checked === 0 ? "checked" : checked} labelClass='filter-radio' class='radiomark radiomark-filter' name={props.options[i].name} text={props.options[i].options[o]} />
                    ); 
                    
                }
            }
            items.push(
            <div key={i} className="filter-option">
                <span className="filter-option-name">{props.options[i].text}</span>
                <div className="options-container">
                    {options}
                </div>
            
            </div>
             );
        }
        setItems([...items]);

      }, [props]); 

    return (
        <div className="filter-container">
            <div className="filter-button-container" ref={ref} onClick={() => SetIsOpen(prev => !prev)}>
                <span>Фільтр</span>
                <svg className={"arrow white " + (isOpen ? "show" : "")}>
                <path d="M0 2 L10 10 L20 2 L18 0 L10 6 L2 0 Z" />
                </svg>
            </div>
            <div className={"filter " + (isOpen ? "show" : "")}>
                <div className="filter-options-container">
                    {items}
                </div>
            </div>
        </div>
    );
});

export default Filter;