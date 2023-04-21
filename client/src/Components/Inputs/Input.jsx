import React, {useState, useRef, useEffect} from "react";

export default function Input (props) {

    const [value, setValue] = useState(props.value);
    const [formattedValue, setFormattedValue] = useState(props.value);
    const interval = useRef(null);

    const startCounter = (step) => {
        if (interval.current) return;  
         
        interval.current = setInterval(() => {
            setValue((prevValue) => {
                return ((parseInt(prevValue) >= props.max && step === 1) || (parseInt(prevValue) <= props.min && step === -1) ? prevValue : parseInt(prevValue) + step);
            });
        }, 100);
        
      };

      const stopCounter = () => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
        }
      };

      const handleChange = (e) => {
        formatHandler(e.target.value)
    }

    const formatHandler = (value) => {
        if (props.code) {
            let code = value.replace(/[^\d]/g,'');
            setValue(code);
            if (props.handleChange !== undefined) {
                props.handleChange(code);
            }
        }
        else if (props.min !== undefined || props.number) {
            let number = value.replace(/[^\d.]/g,'');
            if (props.min === undefined && !props.int) {
                number = number.replace(/[.%]/g, function(match, offset, all) { 
                    return match === "." ? (all.indexOf(".") === offset ? '.' : '') : ''; 
                })
                if (number.charAt(0) === '.') {
                    number = '0' + number;
                }
            }
            else if (props.int) {
                number = number.replace('.', '');
            }
            else {
                number = number.replace('.', '');
                if (parseInt(number) > props.max) {
                    number = props.max;
                }
                else if (parseInt(number) < props.min) {
                    number = props.min;
                }
            }
            setValue(number);
            if (props.handleChange !== undefined) {
                props.handleChange(number);
            }
        }
        else if (props.price) {
            let number = value.replace(/[^\d]/g,'');
            setValue(number);
            if (number !== '') {
                setFormattedValue(parseInt(number).toLocaleString('ua'));
            }
            else {
                setFormattedValue(number)
            }
            if (props.handleChange !== undefined) {
                props.handleChange(number);
            }
        }
        else if (props.phone) {
            let phone = value.replace(/[^\d]/g,'');
            setValue(phone);
            let format = phone.length < 1 ? `` :
                         phone.length < 4 ? `(${phone.substring(0,3)}` :
                         phone.length < 7 ? `(${phone.substring(0,3)}) ${phone.substring(3,6)}` :
                         phone.length < 11 ? `(${phone.substring(0,3)}) ${phone.substring(3,6)} ${phone.substring(6)}` : `(${phone.substring(0,3)}) ${phone.substring(3,6)} ${phone.substring(6, 10)}`
            setFormattedValue(format)
            if (props.handleChange !== undefined) {
                props.handleChange(phone);
            }
        }
        else {
            setValue(value)

            if (props.handleChange !== undefined) {
                props.handleChange(value);
            }
        }
    }

    const handleBlur = () => {
        if (props.blurHandler !== undefined) {
            props.blurHandler();
        }
    }

    const handleClick = (step) => {
        let number = 0;
        if (step > 0) {
            number = parseInt(value) >= props.max  ? value : parseInt(value) + step;
            setValue(number)
        }
        else {
            number = parseInt(value) <= props.min  ? value : parseInt(value) + step;
            setValue(number)
        }
        if (props.handleChange !== undefined) {
            props.handleChange(number);  
        }
    }

        useEffect(() => {
        let value = props.value
        if (!value) {
           value = '';
        }
        setValue(value);
        formatHandler(value)
      }, [props.value]); 

    return(
        <div className="input-row">
            <div className={"input-field " + props.class}>
                <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={(props.hint !== undefined || props.min !== undefined) ? "input" : "input full"} 
                    type={props.type}
                    min={props.min}
                    max={props.max}
                    placeholder={props.placeholder} 
                    value={props.price ? formattedValue : props.phone ? formattedValue : value}
                    pattern={props.pattern} 
                />
                {props.hint !== undefined &&
                    <div className="hint" >
                        <div className="hintBody">
                            {props.hint} 
                        </div>
                    </div>
                } 
                {props.min !== undefined &&
                    <div className="number-buttons" >
                        <div onMouseLeave={stopCounter} onMouseDown={() => startCounter(1)} onMouseUp={stopCounter} onClick={() => handleClick(1)} className="up-button"></div>
                        <div onMouseLeave={stopCounter} onMouseDown={() => startCounter(-1)} onMouseUp={stopCounter} onClick={() => handleClick(-1)} className="down-button"></div>
                    </div>
                } 
            </div>
        </div>
    );
}