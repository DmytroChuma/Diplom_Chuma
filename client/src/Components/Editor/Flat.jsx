import React, {useState} from "react";
import Radiobutton from "../Inputs/Radiobutton";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";

export default function Flat(props) {

    const [walls, setWalls] = useState('');
    const [realtyState, setRealtyState] = useState('');
    const [communication, setCommunication] = useState('');

    React.useEffect(() => {
        fetch('/house')
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
                    <Radiobutton hook_input={props.dwelling} checked='checked' class='radiomark' name={"dwelling"} text='Новобудова' />
                    <Radiobutton hook_input={props.dwelling} checked='' class='radiomark' name={"dwelling"} text='Вторинне' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Кількість кімнат</label>
                <div className="input-row">
                    <Input handleChange={props.rooms} name='rooms' type='text' min='1' max='100' value='1'/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Поверховість</label>
                <div className="input-row">
                    <div className="input-row">
                        <Input handleChange={props.floors} name='floors' type='text' min='1' max='100' value='1'/>
                    </div> 
                </div>
            </div>
            <div className="input-row-container">
                <label className="input-label">Тип стін</label>
                <div className="input-row">
                    <Select handleData={props.wall} class='full' name='wall' readonly={true} list={walls} placeholder='Тип стіни' />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Тип опалення</label>
                <div className="input-row">
                    <Radiobutton hook_input={props.heating} checked='checked' class='radiomark' name={"heating"} text='Централізоване' />
                    <Radiobutton hook_input={props.heating} checked='' class='radiomark' name={"heating"} text='Індивідуальне' />
                    <Radiobutton hook_input={props.heating} checked='' class='radiomark' name={"heating"} text='Комбіноване' />
                    <Radiobutton hook_input={props.heating} checked='' class='radiomark' name={"heating"} text='Без опалення' />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Планування</label>
                <div className="input-row">
                    <Checkbox handleChange={props.plan} checked={0} name={'plaster'} class="checkmark" text={'Чорнова штукатурка'}/>
                    <Checkbox handleChange={props.multi} checked={0} name={'multi-level'} class="checkmark" text={'Багаторівнева'}/>
                    <Checkbox handleChange={props.furniture} checked={0} name={'furniture'} class="checkmark" text={'Без меблів'}/>
                    <Checkbox handleChange={props.mansard} checked={0} name={'mansard'} class="checkmark" text={'З мансардою'}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.general_square} name='general_square' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Житлова площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.living_square} name='dwelling_place' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан будинку</label>
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
            <div className="input-row-container">
                <label className="input-label">Газ</label>
                <div className="input-row">
                    <Select handleData={props.gas} class='full' name='gas' value='Не вказано' readonly={true} list={communication} placeholder='Газ' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Вода</label>
                <div className="input-row">
                    <Select handleData={props.water} class='full' name='water' value='Не вказано' readonly={true} list={communication} placeholder='Вода' />
                </div> 
            </div>
        </div>
    );
}