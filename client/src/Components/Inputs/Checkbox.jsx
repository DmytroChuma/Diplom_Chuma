import React, { useState } from "react";

export default function CheckBox (props) {
    const [value, setValue] = useState(props.checked === 0 ? '' : props.text);
    const [check, setCheck] = useState(props.checked);

    React.useEffect(() => {
        if (typeof props.handleChange === 'function') {
            props.handleChange(value);
        }
      }, [check, value, props]);

    const handleChange = () => {
        if (check === 1) {
            setCheck(0);
            setValue('');
        }
        else {
            setCheck(1);
            setValue(props.text);
        }
        if (typeof props.dataHandler === 'function') {
            props.dataHandler(props.name, props.value);
        }
        if (typeof props.checkHandler === 'function') {
            props.checkHandler(props.value);
        }
    }
 

    return (
        <label className={"checkbox " + props.labelClass}>{props.text}
            <input onChange={handleChange} type='checkbox' value={props.text} name={props.name} defaultChecked={check}/>
            <span className={props.class}></span>
        </label>
    )
}
