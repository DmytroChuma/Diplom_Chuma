import React, { useState } from "react";

import Checkbox from "./Checkbox";
import Radiobutton from "./Radiobutton";

export default function Select (props)  {

    const [isOpen, SetIsOpen] = useState(false);
    
    //let isOpen = false;
   //if (!props.options.options) {return};

    let items = [];
    for (let i = 0 ; i < props.options.length; i++) {
        let options = [];
        for (let o = 0; o < props.options[i].options.length; o++) {
            if (props.options[i].type === 1) {
                options.push(
                    <Checkbox key={o} name={props.options[i].name +"[]"} class="checkmark checkmark-filter" text={props.options[i].options[o]}/>
                );
            }
            else {
                options.push(
                    <Radiobutton key={o} checked={o === 0 ? "checked" : ""} class='radiomark radiomark-filter' name={props.options[i].name +"[]"} text={props.options[i].options[o]} />
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
        //console.log(props.options[i].options.length);
    }

    return (
        <div className="filter-container">
            <div className="filter-button-container"  onClick={() => SetIsOpen(prev => !prev)}>
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
}