import React, {useState, useRef} from "react";

export default function Input (props) {

    const [value, setValue] = useState(props.value);
    const [price, setPrice] = useState(props.value);
    const interval = useRef(null);


    const startCounter = (step) => {
        if (interval.current) return;  
         
        interval.current = setInterval(() => {
            setValue((prevValue) => {
                return ((prevValue >= props.max && step === 1) || (prevValue <= props.min && step === -1) ? prevValue : parseInt(prevValue) + step);
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
        
        if (props.min !== undefined || props.number) {
            let number = e.target.value.replace(/[^\d.]/g,'');
            if (props.min === undefined) {
                number = number.replace(/[.%]/g, function(match, offset, all) { 
                    return match === "." ? (all.indexOf(".") === offset ? '.' : '') : ''; 
                })
                if (number.charAt(0) === '.') {
                    number = '0' + number;
                }
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
           /* if (props.handleChange !== undefined) {
                props.handleChange(number);
            }*/
        }
        else if (props.price) {
            let number = e.target.value.replace(/[^\d]/g,'');
            setValue(number);
            number = number === '' ? 0 : number;
            setPrice(parseInt(number).toLocaleString('ua'));
        }
        else {
            setValue(e.target.value)
        }
    }

    const handleValidate = (e) => {
       /* if (props.min !== undefined) {
            if (value > props.max) {
                setValue(props.max);
            }
            else if (value < props.min) {
                setValue(props.min);
            }
        }*/
    } 

    const handleClick = (step) => {
        
        if (step > 0)
            setValue((prev) => {
                let number = prev >= props.max  ? prev : parseInt(prev) + step;
               /* if (props.handleChange !== undefined) {
                    props.handleChange(number);  
                }*/
               return number;
            });
        else 
            setValue((prev) => {
                let number = prev <= props.min  ? prev : parseInt(prev) + step;
                /*if (props.handleChange !== undefined) {
                    props.handleChange(number);  
                }*/
            return number;
            });
    }

    React.useEffect(() => {
        if (props.handleChange !== undefined) {
            props.handleChange(value);  
        }
      }, [props, value]);

    return(
        <div className="input-row">
            <div className={"input-field " + props.class}>
                <input
                    onChange={handleChange}
                    onBlur={handleValidate}
                    className={(props.hint !== undefined || props.min !== undefined) ? "input" : "input full"} 
                    {...props.hook_input} 
                    type={props.type}
                    min={props.min}
                    max={props.max}
                    placeholder={props.placeholder} 
                    value={props.price ? price : value} 
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


/*export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            label: this.props.label,
            placeholder: this.props.placeholder,
            type: this.props.type,
            pattern: this.props.pattern,
            hint: this.props.hint,
            show: false,
            hook: this.props.hook
        };
    }

    render() {*/

      /*  const mouseEnterHint = (e) => {
            this.setState({show: true});
        }

        const mouseLeaveHint = (e) => {
            this.setState({show: false});
        }*/

        //onMouseEnter={mouseEnterHint} onMouseLeave={mouseLeaveHint}

       /* return (
            <div className="input-row">
                <div className="input-field">
                    <input className={this.state.hint !== undefined ? "input" : "input full"} {...this.state.hook} onChange={(e) => this.setState({value: e.target.value})} type={this.state.type} placeholder={this.state.placeholder} value={this.state.value} pattern={this.state.pattern} />
                    {this.state.hint !== undefined &&
                        <div className="hint" >
                            <div className={this.state.show ? "hintBody show" : "hintBody"}>
                                {this.state.hint} 
                            </div>
                        </div>
                    } 
                </div>
            </div>
        )
    }
        
}*/