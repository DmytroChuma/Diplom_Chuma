import React, {useState, useEffect} from "react";
import Radiobutton from "../Inputs/Radiobutton";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";

export default function Flat(props) {

    const [walls, setWalls] = useState('');
    const [realtyState, setRealtyState] = useState('');
    const [communication, setCommunication] = useState('');

    useEffect(() => {
        fetch('https://diplomchuma-production.up.railway.app/house')
          .then((res) => res.json())
          .then((data) => {
                data = JSON.parse(data);
                setWalls(data.wall);
                setRealtyState(data.state);
                setCommunication(data.comm);
            });
      }, []);

    return (
        <div className="inputs-container"> 
            <div className="input-row-container full">
                <label className="input-label">Тип житла</label>
                <div className="input-row">
                    <Radiobutton changeHandler={props.dwelling.set} checked={props.dwelling.value === 'Новобудова' ? 'checked' : ''} class='radiomark' name={"dwelling"} text='Новобудова' />
                    <Radiobutton changeHandler={props.dwelling.set} checked={props.dwelling.value === 'Вторинне' ? 'checked' : ''} class='radiomark' name={"dwelling"} text='Вторинне' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Кількість кімнат</label>
                <div className="input-row">
                    <Input handleChange={props.rooms.set} name='rooms' type='text' min='1' max='100' value={props.rooms.value}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Поверховість</label>
                <div className="input-row">
                    <div className="input-row">
                        <Input handleChange={props.floors.set} name='floors' type='text' min='1' max='100' value={props.rooms.value}/>
                    </div> 
                </div>
            </div>
            <div className="input-row-container">
                <label className="input-label">Тип стін</label>
                <div className="input-row">
                    <Select handleData={props.wall.set} class='full' name='wall' list={walls} placeholder='Тип стіни' value={props.wall.value} />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Тип опалення</label>
                <div className="input-row">
                    <Radiobutton changeHandler={props.heating.set} checked={props.heating.value === 'Централізоване' ? 'checked' : ''} class='radiomark' name={"heating"} text='Централізоване' />
                    <Radiobutton changeHandler={props.heating.set} checked={props.heating.value === 'Індивідуальне' ? 'checked' : ''} class='radiomark' name={"heating"} text='Індивідуальне' />
                    <Radiobutton changeHandler={props.heating.set} checked={props.heating.value === 'Комбіноване' ? 'checked' : ''} class='radiomark' name={"heating"} text='Комбіноване' />
                    <Radiobutton changeHandler={props.heating.set} checked={props.heating.value === 'Без опалення' ? 'checked' : ''} class='radiomark' name={"heating"} text='Без опалення' />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Планування</label>
                <div className="input-row">
                    <Checkbox handleChange={props.plan.set} checked={props.plan.value === '' ? 0 : 1} name={'plaster'} class="checkmark" text={'Чорнова штукатурка'}/>
                    <Checkbox handleChange={props.multi.set} checked={props.multi.value === '' ? 0 : 1} name={'multi-level'} class="checkmark" text={'Багаторівнева'}/>
                    <Checkbox handleChange={props.furniture.set} checked={props.furniture.value === '' ? 0 : 1} name={'furniture'} class="checkmark" text={'Без меблів'}/>
                    <Checkbox handleChange={props.mansard.set} checked={props.mansard.value === '' ? 0 : 1} name={'mansard'} class="checkmark" text={'З мансардою'}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.general_square.set} name='general_square' type='text' value={props.general_square.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Житлова площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.living_square.set} name='dwelling_place' type='text' value={props.living_square.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан будинку</label>
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
            <div className="input-row-container">
                <label className="input-label">Газ</label>
                <div className="input-row">
                    <Select handleData={props.gas.set} class='full' name='gas' value={props.gas.value} list={communication} placeholder='Газ' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Вода</label>
                <div className="input-row">
                    <Select handleData={props.water.set} class='full' name='water' value={props.water.value} list={communication} placeholder='Вода' />
                </div> 
            </div>
        </div>
    );
}