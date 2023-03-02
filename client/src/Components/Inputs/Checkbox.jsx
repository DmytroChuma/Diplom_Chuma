import React, { useState } from "react";

export default function CheckBox (props) {
    const [value, setValue] = useState(props.checked === 0 ? '' : props.text);
    const [check, setCheck] = useState(props.checked);

    React.useEffect(() => {
       // console.log(check);
      //  console.log(value);
        props.handleChange(value);
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

       /* setCheck((prev) => prev === 1 ? 0 : 1);
        setValue((prev) => prev === '' ? '' : props.text);*/
       
    }

    return (
        <label className="checkbox">{props.text}
            <input onClick={handleChange}  type='checkbox' {...props.hook_input} value={value} name={props.name} defaultChecked={check}/>
            <span className={props.class}></span>
        </label>
    )
}
/*export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,
            checked: this.props.checked,
            name: this.props.name,
            class: this.props.class
        };
    }
    render() {
        return (
        <label className="checkbox">{this.state.text}
            <input type='checkbox' {...this.props.hook_input} name={this.state.name} checked={this.state.checked}/>
            <span className={this.state.class}></span>
        </label>
        )
    }
}*/