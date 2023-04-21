import React, {useState, useEffect} from "react";
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

    useEffect(() => {
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
                    <Radiobutton changeHandler={props.type.set} checked={props.type.value === 'Окремий гараж' ? 'checked' : ''} class='radiomark' name={"garage_type"} text='Окремий гараж' />
                    <Radiobutton changeHandler={props.type.set} checked={props.type.value === 'Місце в кооперативі' ? 'checked' : ''} class='radiomark' name={"garage_type"} text='Місце в кооперативі' />
                </div> 
            </div>
             <div className="input-row-container">
                <label className="input-label">Призначення</label>
                <div className="input-row">
                    <Select handleData={props.garageType.set} class='full' name='appointment' value={props.garageType.value} list={garage} placeholder='Призначення' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Машиномісць</label>
                <div className="input-row">
                    <Input handleChange={props.car.set} name='car_count' type='text' min='1' max='10' value={props.car.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Тип стін</label>
                <div className="input-row">
                    <Select handleData={props.wall.set} class='full' name='wall' value={props.wall.value} list={walls} placeholder='Тип стін' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Дах</label>
                <div className="input-row">
                    <Select handleData={props.roof.set} class='full' name='roof' value={props.roof.value} list={roof} placeholder='Дах' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Підлога</label>
                <div className="input-row">
                    <Select handleData={props.floor.set} class='full' name='floor' value={props.floor.value} list={floor} placeholder='Підлога' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.square.set} name='general_square' type='text' value={props.square.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ширина гаража, м</label>
                <div className="input-row">
                    <Input handleChange={props.width.set} name='garage_width' type='text' value={props.width.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Довжина гаража, м</label>
                <div className="input-row">
                    <Input handleChange={props.length.set} name='garage_length' type='text' value={props.length.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ширина воріт, м</label>
                <div className="input-row">
                    <Input handleChange={props.gateWidth.set} name='garage_gate_width' type='text' value={props.gateWidth.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Висота воріт, м</label>
                <div className="input-row">
                    <Input handleChange={props.height.set} name='garage_gate_height' type='text' value={props.height.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Інші переваги</label>
                <div className="input-row">
                    <Checkbox handleChange={props.pit.set} class="checkmark" checked={props.pit.value === '' ? 0 : 1} name={"pit"} text='Оглядова яма' />
                    <Checkbox handleChange={props.basement.set} class='checkmark' checked={props.basement.value === '' ? 0 : 1} name={"basement"} text='Підвал' />
                    <Checkbox handleChange={props.residential.set} class='checkmark' checked={props.residential.value === '' ? 0 : 1} name={"residential"} text='Житловий' />
                    <Checkbox handleChange={props.sectional.set} class='checkmark' checked={props.sectional.value === '' ? 0 : 1} name={"sectional"} text='Розбірний' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан гаража</label>
                <div className="input-row">
                    <Select handleData={props.state.set} class='full' name='realty_state' value={props.state.value} list={realtyState} placeholder='Стан будинку' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Електрика</label>
                <div className="input-row">
                    <Select handleData={props.electricity.set} class='full' name='electricity' value={props.electricity.value} list={communication} placeholder='Електрика' />
                </div> 
            </div>
            
        </div>
    );
}