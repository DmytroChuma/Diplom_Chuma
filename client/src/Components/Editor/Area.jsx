import React, {useState} from "react";
 
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";

export default function Area(props) {

    const [soil, setSoil] = useState('');
    const [relief, setRelief] = useState('');

    React.useEffect(() => {
        fetch('/area')
          .then((res) => res.json())
          .then((data) => {
                data = JSON.parse(data);
                setSoil(data.soil);
                setRelief(data.relief);
            });
      }, []);

    return (
        <div className="inputs-container"> 
            <div className="input-row-container">
                <label className="input-label">Площа</label>
                <div className="input-row">
                    <Input handleChange={props.general_square} name='square' type='text' value='' number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ділянка</label>
                <div className="input-row inputs">
                    <div className="input-row">
                        <Select handleData={props.unit} class='full' name='unit' readonly={true} list={["Сотка", "Гектар", "м²"]} placeholder='Одиниця виміру'/>
                    </div>
                </div>
            </div>
            <div className="input-row-container">
                <label className="input-label">Рельєф</label>
                <div className="input-row">
                    <Select handleData={props.relief} class='full' name='relief' value='Не вказано' readonly={true} list={relief} placeholder='Рельєф' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Грунт</label>
                <div className="input-row">
                    <Select handleData={props.soil} class='full' name='soil' value='Не вказано' readonly={true} list={soil} placeholder='Грунт' />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Розташування</label>
                <div className="input-row">
                    <Checkbox handleChange={props.river} checked={0} name={'river'} class="checkmark" text={'Біля річки'}/>
                    <Checkbox handleChange={props.lake} checked={0} name={'lake'} class="checkmark" text={'Біля озера'}/>
                </div> 
            </div>
        </div>
    );
}