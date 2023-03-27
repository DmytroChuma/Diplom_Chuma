import React, {useState} from "react";
import Radiobutton from "../Inputs/Radiobutton";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";

export default function Garage(props) {

    const [walls, setWalls] = useState('');
    const [realtyState, setRealtyState] = useState('');
    const [roof, setRoof] = useState('');
    const [floor, setFloor] = useState('');
    const [garage, setGarageType] = useState('');
    const [communication, setCommunication] = useState('');

    React.useEffect(() => {
        fetch('/garage')
          .then((res) => res.json())
          .then((data) => {
                data = JSON.parse(data);
                setWalls(data.wall);
                setRealtyState(data.state);
                setGarageType(data.type);
                setCommunication(data.comm);
                setFloor(data.floor);
                setRoof(data.roof);
            });
      }, []);

    return (
        <div className="inputs-container"> 
            <div className="input-row-container full">
                <label className="input-label">Тип гаража</label>
                <div className="input-row">
                    <Radiobutton hook_input={props.type} checked='checked' class='radiomark' name={"garage_type"} text='Окремий гараж' />
                    <Radiobutton hook_input={props.type} checked='' class='radiomark' name={"garage_type"} text='Місце в гаражному кооперативі' />
                </div> 
            </div>
             <div className="input-row-container">
                <label className="input-label">Призначення</label>
                <div className="input-row">
                    <Select handleData={props.garageType} class='full' name='appointment' value='Під легкове авто' readonly={true} list={garage} placeholder='Призначення' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Машиномісць</label>
                <div className="input-row">
                    <Input handleChange={props.car} name='car_count' type='text' min='1' max='10' value='1' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Тип стін</label>
                <div className="input-row">
                    <Select handleData={props.wall} class='full' name='wall' value='' readonly={true} list={walls} placeholder='Тип стін' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Дах</label>
                <div className="input-row">
                    <Select handleData={props.roof} class='full' name='roof' value='' readonly={true} list={roof} placeholder='Дах' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Підлога</label>
                <div className="input-row">
                    <Select handleData={props.floor} class='full' name='floor' value='' readonly={true} list={floor} placeholder='Підлога' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.square} name='general_square' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ширина гаража, м</label>
                <div className="input-row">
                    <Input handleChange={props.width} name='garage_width' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Довжина гаража, м</label>
                <div className="input-row">
                    <Input handleChange={props.length} name='garage_length' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ширина воріт, м</label>
                <div className="input-row">
                    <Input handleChange={props.gateWidth} name='garage_gate_width' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Висота воріт, м</label>
                <div className="input-row">
                    <Input handleChange={props.height} name='garage_gate_height' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Інші переваги</label>
                <div className="input-row">
                    <Checkbox handleChange={props.pit} class="checkmark" checked={0} name={"pit"} text='Оглядова яма' />
                    <Checkbox handleChange={props.basement} class='checkmark' checked={0} name={"basement"} text='Підвал' />
                    <Checkbox handleChange={props.residential} class='checkmark' checked={0} name={"residential"} text='Житловий' />
                    <Checkbox handleChange={props.sectional} class='checkmark' checked={0} name={"sectional"} text='Розбірний' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан гаража</label>
                <div className="input-row">
                    <Select handleData={props.state} class='full' name='realty_state' value='Не вказано' readonly={true} list={realtyState} placeholder='Стан будинку' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Електрика</label>
                <div className="input-row">
                    <Select handleData={props.electricity} class='full' name='electricity' value='Не вказано' readonly={true} list={communication} placeholder='Електрика' />
                </div> 
            </div>
            
        </div>
    );
}