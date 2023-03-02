import React, { useState } from "react";

export default function Radiobutton (props) {
        const [value] = useState(props.text);
 
        return (
            <label className="radiobutton" >{props.text}
                <input type='radio' {...props.hook_input} name={props.name} value={value} defaultChecked={props.checked} />
                <span className={props.class}></span>
            </label>
        )
}