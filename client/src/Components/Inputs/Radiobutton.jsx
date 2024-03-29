import React, { useState } from "react";

export default function Radiobutton (props) {
        const [value] = useState(props.text);
 
        const clickHandler = () => {
            if (typeof props.changeHandler === 'function') {
                props.changeHandler(props.text);
            }
            else if (typeof props.dataHandler === 'function') {
                props.dataHandler(props.name, props.text);
            }
        }

        return (
            <label className={"radiobutton " + props.labelClass} >{props.text}
                <input onClick={clickHandler} type='radio' name={props.name} value={value} defaultChecked={props.checked} />
                <span className={props.class}></span>
            </label>
        )
}