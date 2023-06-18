import React, {useState, useEffect} from "react";
 
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Checkbox from "../Inputs/Checkbox";

export default function Area(props) {

    const [soil, setSoil] = useState('');
    const [relief, setRelief] = useState('');

    useEffect(() => {
        fetch('https://diplomchuma-production.up.railway.app/area')
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
                    <Input handleChange={props.general_square.set} name='square' type='text' value={props.general_square.value} number={true}/>
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Ділянка</label>
                <div className="input-row inputs">
                    <div className="input-row">
                        <Select handleData={props.unit.set} class='full' name='unit' list={["Сотка", "Гектар", "м²"]} placeholder='Одиниця виміру' value={props.unit.value}/>
                    </div>
                </div>
            </div>
            <div className="input-row-container">
                <label className="input-label">Рельєф</label>
                <div className="input-row">
                    <Select handleData={props.relief.set} class='full' name='relief' value={props.relief.value} list={relief} placeholder='Рельєф' />
                </div> 
            </div>
            <div className="input-row-container">
                <label className="input-label">Грунт</label>
                <div className="input-row">
                    <Select handleData={props.soil.set} class='full' name='soil' value={props.soil.value} list={soil} placeholder='Грунт' />
                </div> 
            </div>
            <div className="input-row-container full">
                <label className="input-label">Розташування</label>
                <div className="input-row">
                    <Checkbox handleChange={props.river.set} checked={props.river.value === '' ? 0 : 1} name={'river'} class="checkmark" text={'Біля річки'}/>
                    <Checkbox handleChange={props.lake.set} checked={props.lake.value === '' ? 0 : 1} name={'lake'} class="checkmark" text={'Біля озера'}/>
                </div> 
            </div>
        </div>
    );
}