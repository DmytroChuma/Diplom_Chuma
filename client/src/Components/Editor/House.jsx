import React, {useState} from "react";
import Radiobutton from "../Inputs/Radiobutton";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";
 
 
export default function House(props) {

    const [walls, setWalls] = useState('');
    const [realtyState, setRealtyState] = useState('');
    const [roof, setRoof] = useState('');
    const [communication, setCommunication] = useState('');
    
     

    React.useEffect(() => {
        fetch('/house')
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
                    <Radiobutton hook_input={props.type} checked='checked' class='radiomark' name={"realty_type"} text='Окремий будинок' />
                    <Radiobutton hook_input={props.type} checked='' class='radiomark' name={"realty_type"} text='Дуплекс' />
                    <Radiobutton hook_input={props.type} checked='' class='radiomark' name={"realty_type"} text='Таунхаус' />
                </div> 
            </div>
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
                    <Input handleChange={props.rooms} name='rooms' value='1' type='text' min='1' max='100'/>
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Кількість поверхів</label>
                <div className="input-row inputs">
                    <div className="input-row nfull">
                        <Input handleChange={props.floors}  name='floors' type='text' min='1' max='100' value='1'/>
                    </div> 
                    <div className="input-row full">
                        <Checkbox handleChange={props.mansard} checked={0} name={'additional_floor[]'} class="checkmark" text={'Мансардний поверх'}/>
                        <Checkbox handleChange={props.basement} checked={0} name={'additional_floor[]'} class="checkmark" text={'Підвальний поверх'}/>
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
                    <Radiobutton hook_input={props.furniture} checked='checked' class='radiomark' name={"furniture"} text='З меблями' />
                    <Radiobutton hook_input={props.furniture} checked='' class='radiomark' name={"furniture"} text='Без меблів' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Загальна площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.general_square} name='general_square' value='' type='text' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Житлова площа, м²</label>
                <div className="input-row">
                    <Input handleChange={props.living_square} name='dwelling_place' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ділянка</label>
                <div className="input-row inputs">
                    <div className="input-row nfull">
                        <Input handleChange={props.area} name='area' value='' type='text' hint='Якщо немає ділянки, то залиште це поле пустим' number={true}/>
                    </div> 
                    <div className="input-row full">
                        <Select handleData={props.unit} class='full' name='unit' readonly={true} list={["Сотка", "Гектар", "м²"]} placeholder='Одиниця виміру'/>
                    </div>
                </div>
            </div>
            <div className="input-row-container full">
                <label className="input-label">Додаткові переваги</label>
                <div className="input-row">
                    <Checkbox handleChange={props.garage} checked={0} name={'advantage[]'} class="checkmark" text={'Гараж'}/>
                    <Checkbox handleChange={props.fireplace} checked={0} name={'advantage[]'} class="checkmark" text={'Камін'}/>
                    <Checkbox handleChange={props.balcony} checked={0} name={'advantage[]'} class="checkmark" text={'Балкон'}/>
                    <Checkbox handleChange={props.garden} checked={0} name={'advantage[]'} class="checkmark" text={'Сад'}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Стан будинку</label>
                <div className="input-row">
                    <Select handleData={props.state} class='full' name='realty_state' value='Не вказано' readonly={true} list={realtyState} placeholder='Стан будинку' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Дах</label>
                <div className="input-row">
                    <Select handleData={props.roof} class='full' name='roof' value='Не вказано' readonly={true} list={roof} placeholder='Дах' />
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
    )
}