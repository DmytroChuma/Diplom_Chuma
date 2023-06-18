import React, {useState, useEffect} from "react";
import Radiobutton from "../Inputs/Radiobutton";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";
 
 
export default function House(props) {

    const [walls, setWalls] = useState('');
    const [realtyState, setRealtyState] = useState('');
    const [roof, setRoof] = useState('');
    const [communication, setCommunication] = useState('');
    
     

    useEffect(() => {
        fetch('https://house-f621.onrender.com/house')
          .then((res) => res.json())
          .then((data) => {
                data = JSON.parse(data);
                setWalls(data.wall);
                setRealtyState(data.state);
                setRoof(data.roof);
                setCommunication(data.comm);
            });
      }, []);

    return (
        <div className="inputs-container"> 
            <div className="input-row-container full">
                <label className="input-label">Тип будинку</label>
                <div className="input-row">
                    <Radiobutton changeHandler={props.type.set} checked={props.type.value === 'Окремий будинок' ? 'checked' : ''} class='radiomark' name={"realty_type"} text='Окремий будинок' />
                    <Radiobutton changeHandler={props.type.set} checked={props.type.value === 'Дуплекс' ? 'checked' : ''} class='radiomark' name={"realty_type"} text='Дуплекс' />
                    <Radiobutton changeHandler={props.type.set} checked={props.type.value === 'Таунхаус' ? 'checked' : ''} class='radiomark' name={"realty_type"} text='Таунхаус' />
                </div> 
            </div>
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
                    <Input handleChange={props.rooms.set} name='rooms' value={props.rooms.value} type='text' min='1' max='100'/>
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Кількість поверхів</label>
                <div className="input-row inputs">
                    <div className="input-row nfull">
                        <Input handleChange={props.floors.set}  name='floors' type='text' min='1' max='100' value={props.floors.value}/>
                    </div> 
                    <div className="input-row full">
                        <Checkbox handleChange={props.mansard.set} checked={props.mansard.value === '' ? 0 : 1} name={'additional_floor[]'} class="checkmark" text={'Мансардний поверх'}/>
                        <Checkbox handleChange={props.basement.set} checked={props.basement.value === '' ? 0 : 1} name={'additional_floor[]'} class="checkmark" text={'Підвальний поверх'}/>
                    </div>
                </div>
            </div>
            <div className="input-row-container">
                <label className="input-label">Тип стін</label>
                <div className="input-row">
                    <Select handleData={props.wall.set} value={props.wall.value} class='full' name='wall' list={walls} placeholder='Тип стіни' />
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
                    <Radiobutton changeHandler={props.furniture.set} checked={props.furniture.value === 'З меблями' ? 'checked' : ''} class='radiomark' name={"furniture"} text='З меблями' />
                    <Radiobutton changeHandler={props.furniture.set} checked={props.furniture.value === 'Без меблів' ? 'checked' : ''} class='radiomark' name={"furniture"} text='Без меблів' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.general_square.set} name='general_square' value={props.general_square.value} type='text' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Житлова площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.living_square.set} name='dwelling_place' type='text' value={props.living_square.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ділянка</label>
                <div className="input-row inputs">
                    <div className="input-row nfull">
                        <Input handleChange={props.area.set} name='area' value={props.area.value} type='text' hint='Якщо немає ділянки, то залиште це поле пустим' number={true}/>
                    </div> 
                    <div className="input-row full">
                        <Select handleData={props.unit.set} value={props.unit.value} class='full' name='unit' list={["Сотка", "Гектар", "м²"]} placeholder='Одиниця виміру'/>
                    </div>
                </div>
            </div>
            <div className="input-row-container full">
                <label className="input-label">Додаткові переваги</label>
                <div className="input-row">
                    <Checkbox handleChange={props.garage.set} checked={props.garage.value === '' ? 0 : 1} name={'advantage[]'} class="checkmark" text={'Гараж'}/>
                    <Checkbox handleChange={props.fireplace.set} checked={props.fireplace.value === '' ? 0 : 1} name={'advantage[]'} class="checkmark" text={'Камін'}/>
                    <Checkbox handleChange={props.balcony.set} checked={props.balcony.value === '' ? 0 : 1} name={'advantage[]'} class="checkmark" text={'Балкон'}/>
                    <Checkbox handleChange={props.garden.set} checked={props.garden.value === '' ? 0 : 1} name={'advantage[]'} class="checkmark" text={'Сад'}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан будинку</label>
                <div className="input-row">
                    <Select handleData={props.state.set} class='full' name='realty_state' value={props.state.value} list={realtyState} placeholder='Стан будинку' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Дах</label>
                <div className="input-row">
                    <Select handleData={props.roof.set} class='full' name='roof' value={props.roof.value} list={roof} placeholder='Дах' />
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
    )
}