import React, { useEffect, useState } from "react";

import Title from "../Components/Title";
import Input from "../Components/Inputs/Input";
import Select from "../Components/Inputs/Select";
import Radiobutton from "../Components/Inputs/Radiobutton";
import MapElement from "../Components/Map/MapElement";
import House from "../Components/Editor/House";
import Flat from "../Components/Editor/Flat";
import Garage from "../Components/Editor/Garage";
import Area from "../Components/Editor/Area";
import useInput from "../Hook/useInput";
import DragAndDropFile from "../Components/DragAndDropFiles/DragAndDropFile";
import Dialog from "../Components/Dialogs/Dialog";
import Header from "../Components/Header/Header";
import regions from "../Utils/Regions";

export default function NewAdvertisement () {

    const [cities, SetCities] = useState("");
    const [warning, setWarning] = useState("");

    const [region, setRegion] = useState("");
    const [city, SetCity] = useState("");
    const district = useInput("");
    const street = useInput("");
    const [position, setPosition] = useState("");

    const number = useInput("");
    const name = useInput("");
    const [realtyType, setRealtyType] = useState("Будинок");
    const advertisementType = useInput("Продаж");
    

    //house or flat
    const house_type = useInput("Окремий будинок");
    const dwelling_type = useInput("Первинне");
    const [rooms_count, setRoomsCount] = useState("1");
    const [floor_count, setFloorCount] = useState("1");
    const [mansard, setMansard] = useState('');
    const [basement, setBasement] = useState('');
    const [wall, setWall] = useState('');
    const heating = useInput('Централізоване')
    const [plan, setPlan] = useState('');
    const furniture = useInput('З меблями');
    const [furnitureFlat, setFurnitureFlat] = useState('');
    const [multi, setMulti] = useState("");
    const [general_square, setSquare] = useState('');
    const [living_square, setLSquare] = useState('');
    const [area, setArea] = useState('');
    const [unit, setUnit] = useState('');
    const [garage, setGarage] = useState('');
    const [fireplace, setFireplace] = useState('');
    const [balcony, setBalcony] = useState('');
    const [garden, setGarden] = useState('');
    //garage
    const type = useInput('Окремий гараж')
    const [garageType, setGarageType] = useState('Під легкове авто');
    const [floor, setFloor] = useState('');
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [gateWidth, setGateWidth] = useState('');
    const [height, setHeight] = useState('');
    const [pit, setPit] = useState('');
    const [residential, setResidential] = useState('');
    const [sectional, setSectional] = useState('');
    //area
    const [river, setRiver] = useState('');
    const [lake, setLake] = useState('');
    const [relief, setRelief] = useState('Не вказано');
    const [soil, setSoil] = useState('Не вказано');
    //general
    const [state, setState] = useState('Не вказано');
    const [roof, setRoof] = useState('Не вказано');
    const [electricity, setElectricity] = useState('Не вказано');
    const [gas, setGas] = useState('Не вказано');
    const [water, setWater] = useState('Не вказано');


    const description = useInput('');
    const [price, setPrice] = useState('0');
    const [currency, setCurrency] = useState('$');
    const auction = useInput('Ні');
    const proposition = useInput('Від власника');
    const [files, setFiles] = useState('');

    const [parameters, setParameters] = useState(
        <House 
            type={house_type} 
            dwelling={dwelling_type} 
            rooms={setRoomsCount} 
            floors={setFloorCount} 
            mansard={setMansard} 
            basement={setBasement}
            wall={setWall}
            heating={heating}
            plan={setPlan}
            furniture={furniture}
            general_square={setSquare}
            living_square={setLSquare}
            area={setArea}
            unit={setUnit}
            garage={setGarage}
            fireplace={setFireplace}
            balcony={setBalcony}
            garden={setGarden}
            state={setState}
            roof={setRoof}
            electricity={setElectricity}
            gas={setGas}
            water={setWater}
        />);


    let timeOut;


    useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
          return () => {
            window.removeEventListener('beforeunload', unloadCallback)
          }
      }, []);

    const getData = (data) => {
        setRegion(data);
        fetch('/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          SetCity("");
        });
      }

      
      const getArea = (data) => {
        SetCity(data);
      }

      const getRealtyType = (data) => {
        setParameters(() => '');
        setRealtyType(data);
        switch(data){
            case 'Будинок':
            case 'Дача':
            case 'Частина будинку':
                setParameters(<House 
                    type={house_type} 
                    dwelling={dwelling_type} 
                    rooms={setRoomsCount} 
                    floors={setFloorCount} 
                    mansard={setMansard} 
                    basement={setBasement}
                    wall={setWall}
                    heating={heating}
                    plan={setPlan}
                    furniture={furniture}
                    general_square={setSquare}
                    living_square={setLSquare}
                    area={setArea}
                    unit={setUnit}
                    garage={setGarage}
                    fireplace={setFireplace}
                    balcony={setBalcony}
                    garden={setGarden}
                    state={setState}
                    roof={setRoof}
                    electricity={setElectricity}
                    gas={setGas}
                    water={setWater}
                />);
                break;
            case 'Квартира':
                setParameters(<Flat 
                    dwelling={dwelling_type} 
                    rooms={setRoomsCount} 
                    floors={setFloorCount}
                    wall={setWall}
                    heating={heating}
                    plan={setPlan}
                    furniture={setFurnitureFlat}
                    mansard={setMansard}
                    multi={setMulti}
                    general_square={setSquare}
                    living_square={setLSquare}
                    state={setState}
                    electricity={setElectricity}
                    gas={setGas}
                    water={setWater}
                    />);
                break;
            case 'Гараж':
                setParameters(<Garage
                    type={type}
                    garageType={setGarageType}
                    car={setRoomsCount}
                    wall={setWall}
                    roof={setRoof}
                    floor={setFloor}
                    square={setSquare}
                    width={setWidth}
                    length={setLength}
                    gateWidth={setGateWidth}
                    height={setHeight}
                    pit={setPit}
                    basement={setBasement}
                    residential={setResidential}
                    sectional={setSectional}
                    state={setState}
                    electricity={setElectricity}
                />);
                break;
            case 'Ділянка':
                setParameters(<Area
                    general_square={setSquare}
                    unit={setUnit}
                    relief={setRelief}
                    soil={setSoil}
                    river={setRiver}
                    lake={setLake}
                    />);
                break;
            default:
                break;
        }
        
      }

      const formValidation = () => {
        if (region === '') {
            handleWarning('Потрібно обрати регіон!');
            return false;
        }
        if (city === '') {
            handleWarning('Потрібно обрати місто!');
            return false;
        }
        if (district.value === '') {
            handleWarning('Потрібно вказати район!');
            return false;
        }
        if (street.value === '') {
            handleWarning('Потрібно вказати вулицю!');
            return false;
        }
        if (description.value === '') {
            handleWarning('Додайте короткий опис!');
            return false;
        }
        if (price.value === '' || price === '0') {
            handleWarning('Введіть вартість!');
            return false;
        }
        if (((parseInt(price) < 100 && currency === '$') || (parseInt(price) < 1000 && currency === 'грн')) && advertisementType === 'Продаж') {
            handleWarning('Занадто мала вартість!');
            return false;
        }
        if (files === '' || files === undefined) {
            handleWarning('Потрібно прикріпити фото!');
            return false;
        }

        if (files.length < 3) {
            handleWarning('Прикрипіть щонайменше 3 фото!');
          
            return false;
        }
        return true;
      }

      const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValidation())
            return false;

        let formData = new FormData();
        let data = {};
        data.number = number.value;
        formData.append('number', number.value);
        formData.append('name', name.value);
        formData.append('realtyType', realtyType);
        formData.append('advertisementType', advertisementType.value);
        formData.append('region', region);
        formData.append('city', city);
        formData.append('district', district.value);
        formData.append('street', street.value);
        formData.append('position', position);
        switch (realtyType) {
            case 'Будинок':
            case 'Дача':
            case 'Частина будинку':
                formData.append('house_type', house_type.value);
                formData.append('dwelling_type', dwelling_type.value);
                formData.append('rooms_count', rooms_count);
                formData.append('floor_count', floor_count);
                formData.append('mansard', mansard);
                formData.append('basement', basement);
                formData.append('wall', wall);
                formData.append('heating', heating.value);
                formData.append('plan', plan);
                formData.append('furniture', furniture.value);
                formData.append('general_square', general_square);
                formData.append('living_square', living_square);
                formData.append('area', area);
                formData.append('unit', unit);
                formData.append('garage', garage);
                formData.append('fireplace', fireplace);
                formData.append('balcony', balcony);
                formData.append('garden', garden);
                formData.append('state', state);
                formData.append('roof', roof);
                formData.append('electricity', electricity);
                formData.append('gas', gas);
                formData.append('water', water);
                break;
            case 'Квартира':
                formData.append('dwelling_type', dwelling_type.value);
                formData.append('rooms_count', rooms_count);
                formData.append('floor_count', floor_count);
                formData.append('wall', wall);
                formData.append('heating', heating.value);
                formData.append('plan', plan);
                formData.append('multi', multi);
                formData.append('furniture', furnitureFlat);
                formData.append('mansard', mansard);
                formData.append('general_square', general_square);
                formData.append('living_square', living_square);
                formData.append('state', state);
                formData.append('electricity', electricity);
                formData.append('gas', gas);
                formData.append('water', water);
                break;
            case 'Гараж':
                formData.append('type', type.value);
                formData.append('garageType', garageType);
                formData.append('car', rooms_count);
                formData.append('wall', wall);
                formData.append('roof', roof);
                formData.append('floor', floor);
                formData.append('square', general_square);
                formData.append('width', width);
                formData.append('length', length);
                formData.append('gateWidth', gateWidth);
                formData.append('height', height);
                formData.append('pit', pit);
                formData.append('basement', basement);
                formData.append('residential', residential);
                formData.append('sectional', sectional);
                formData.append('state', state);
                formData.append('electricity', electricity);
                break;
            case 'Ділянка':
                formData.append('square', general_square);
                formData.append('unit', unit);
                formData.append('relief', relief);
                formData.append('soil', soil);
                formData.append('river', river);
                formData.append('lake', lake);
                break;
            default:
                break;
        }

        formData.append('description', description.value);
        formData.append('price', price);
        formData.append('currency', currency);
        formData.append('auction', auction.value);
        formData.append('proposition', proposition.value);
        formData.append('files', JSON.stringify(files));

        fetch('/save_advertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(Object.fromEntries(formData))
          }).then(response => {
            response.json().then(json => {console.log(JSON.stringify(json))});
          });

      }

      const handleWarning = (text) => {
        setWarning(<Dialog text={text} />);
        clearTimeout( timeOut );
        timeOut = setTimeout(() => {
            setWarning('');
        }, 10000);
      }

        return (
            <div className="app-screen">
                <Header />
                <div className="container">
                    
                    {warning}
                    <form className="new" onSubmit={handleSubmit}>
                        <div className="content-container">
                            <Title type='contact' text='Контактні дані' />
                            <span className="info-for-users">Надайте ваші контактні дані для того, щоб покупці знали, як з Вами можна зв'язатись.</span>
                            <div className="inputs-container">
                                <div className="input-row-container">
                                    <label className="input-label">Номер телефону</label>
                                    <Input 
                                        type='text'
                                        name='phone'
                                         
                                        hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>}
                                        value=''
                                    />
                                </div>
                                <div className="input-row-container">
                                    <label className="input-label">Ваше ім'я та прізвище</label>
                                    <Input type='text' label="Ваше ім'я та прізвище" name='name'   value='' />
                                </div>
                            </div>
                        </div>

                        <div className="content-container">
                            <Title type='realty' text='Основна інформація про нерухомість та тип оголошення' />
                            <span className="info-for-users">Уважно вкажіть інформацію про вашу нерухомість. При редагуванні змінити тип нерухомості та оголошення буде неможливо.</span>
                            <div className="inputs-container">
                                <div className="input-row-container">
                                    <label className="input-label">Тип нерухомості</label>
                                    <div className="input-row">
                                        <Select class={"full"} handleData={getRealtyType} value={"Будинок"} placeholder="Тип нерухомості" name='realty' readonly={true} list={["Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}  />
                                    </div>
                                </div>  
                                <div className="input-row-container full">
                                    <label className="input-label">Тип оголошення</label>
                                    <div className="input-row">
                                        <Radiobutton hook_input={advertisementType} checked='checked' class='radiomark' name={"advertisement_type"} text='Продаж' />
                                        <Radiobutton hook_input={advertisementType} checked='' class='radiomark' name={"advertisement_type"} text='Довгострокова оренда' />
                                        <Radiobutton hook_input={advertisementType} checked='' class='radiomark' name={"advertisement_type"} text='Подобова оренда' />
                                    </div>
                                </div> 
                            </div>
                        </div>

                        <div className="content-container">
                            <Title type='location' text="Розташування об'єкту" />
                            <span className="info-for-users">Вкажіть розташування вашого об'єкту.</span>
                            <div className="input-row-container">
                                <label className="input-label">Оберіть область</label>
                                <div className="input-row">
                                    <Select handleData={getData} class={"full"} placeholder="Оберіть область" name='region' readonly={false} list={regions} />
                                </div>
                            </div>  
                            <div className="input-row-container">
                                <label className="input-label">Оберіть місто</label>
                                <div className="input-row">
                                    <Select handleData={getArea} class={"full"} placeholder="Оберіть місто" name='sity' readonly={false} list={cities} value={city} />
                                </div>
                            </div>  
                            <div className="input-row-container">
                                <label className="input-label">Введіть район</label>
                                <div className="input-row">
                                    <Input hook_input={district} type='text' name='district' placeholder='Район'/>
                                </div>
                            </div>
                            <div className="input-row-container">
                                <label className="input-label">Введіть вулицю</label>
                                <div className="input-row">
                                    <Input hook_input={street} type='text' name='street' placeholder='Вулиця'/>
                                </div>
                            </div>  
                            <span className="info-for-users">Вкажіть розташування вашого об'єкту на карті.</span>
                            <MapElement center={[48.9, 30.0]} position={[50.44351305245807, 30.520019531250004]} zoom={6} handlePosition={setPosition} marker={true}/>
                        </div>

                        <div className="content-container">
                            <Title type='realty' text="Параметри нерухомості" />
                            <span className="info-for-users">Вкажіть основні параметри вашої нерухомості.</span>
                            {parameters}
                        </div>

                        <div className="content-container">
                            <Title type='description' text="Опис нерухомості" />
                            <span className="info-for-users">Додайте опис об'єкту. Контактні дані дублювати не потрібно.</span>
                            <textarea {...description} name='description' placeholder="Додайте короткий опис нерухомості"></textarea>
                        </div>

                        <div className="content-container">
                            <Title type='price' text="Вартість" />
                            <span className="info-for-users">Вкажіть вартість вашої нерухомості.</span>
                            <div className="input-row-container">
                                <label className="input-label">Вартість нерухомості</label>
                                <div className="input-row">
                                    <Input handleChange={setPrice} type='text' value='0' name='price'   price={true}/>
                                    <Select handleData={setCurrency} class={"full currency"} value='$' name='currency' readonly={true} list={['$', 'грн']} />
                                </div>
                            </div>
                            <div className="input-row-container full">
                                <label className="input-label">Можливість торгу</label>
                                <div className="input-row">
                                    <Radiobutton hook_input={auction} checked='' class='radiomark' name={"auction"} text='Так' />
                                    <Radiobutton hook_input={auction} checked='checked' class='radiomark' name={"auction"} text='Ні' />
                                </div>
                            </div>
                            <div className="input-row-container full">
                                <label className="input-label">Тип пропозиції</label>
                                <div className="input-row">
                                    <Radiobutton hook_input={proposition} checked='checked' class='radiomark' name={"proposition"} text='Від власника' />
                                    <Radiobutton hook_input={proposition} checked='' class='radiomark' name={"proposition"} text='Від посередника' />
                                </div>
                            </div>
                        </div>

                        <div className="content-container">
                            <Title type='photo' text="Фото" />
                            <span className="info-for-users">Додайте фото вашої нерухомості. Намагайтесь завантажити як можна більше фотографій та підібрати вдалий ракурс.</span>
                            <DragAndDropFile handleChange={setFiles} warning={handleWarning} type='img' filter={['.jpg', '.JPG', '.jpeg', '.png']} />
                        </div>

                        <button className='btn' type='submit'>submit</button>
                    </form>
                </div>
            </div>
        )
}