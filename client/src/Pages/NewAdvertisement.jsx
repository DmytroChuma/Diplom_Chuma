import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Title from "../Components/Title";
import Input from "../Components/Inputs/Input";
import Select from "../Components/Inputs/Select";
import Radiobutton from "../Components/Inputs/Radiobutton";
import MapElement from "../Components/Map/MapElement";
import House from "../Components/Editor/House";
import Flat from "../Components/Editor/Flat";
import Garage from "../Components/Editor/Garage";
import Area from "../Components/Editor/Area";
import DragAndDropFile from "../Components/DragAndDropFiles/DragAndDropFile";
import Header from "../Components/Header/Header";
import regions from "../Utils/Regions";

import store from "../Store/Store";
import Registration from "../Components/Dialogs/Registration";

export default function NewAdvertisement ({dialog}) {

    const location = useLocation();
    const navigate = useNavigate()
    let slug = location.pathname.split('/');
    slug = slug[slug.length - 1];

    const [user, setUser] = useState({});
    store.subscribe(() => setUser(store.getState().user))
    useEffect(()=>{
        if (store.getState()) {
            setUser(store.getState().user)
        }
    }, [user])

    const[load,setLoad] = useState(slug === 'add-new-advertisement' ? false : true)

    const [modal, setModal] = useState('')

    const [cities, SetCities] = useState("");

    const [region, setRegion] = useState("");
    const [city, SetCity] = useState("");
    const [district, setDistrict] = useState("");
    const [street, setStreet] = useState("");
    const [position, setPosition] = useState([50.44351305245807, 30.520019531250004]);
    const [map, setMap] = useState(false)

    const [number, setNumber] = useState("");

    const [realtyType, setRealtyType] = useState("Будинок");
    const [advertisementType, setAdvertisementType] = useState("Продаж");
    

    //house or flat
    const [house_type, setHouseType] = useState("Окремий будинок");
    const [dwelling_type, setDwellingType] = useState("Новобудова");
    const [rooms_count, setRoomsCount] = useState("1");
    const [floor_count, setFloorCount] = useState("1");
    const [mansard, setMansard] = useState('');
    const [basement, setBasement] = useState('');
    const [wall, setWall] = useState('');
    const [heating, setHeating] = useState('Централізоване')
    const [plan, setPlan] = useState('');
    const [furniture, setFurniture] = useState('З меблями');
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
    const [type, setType] = useState('Окремий гараж')
    const [garageType, setGarageType] = useState('Під легкове авто');
    const [floor, setFloor] = useState('Не вказано');
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


    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0');
    const [currency, setCurrency] = useState('$');
    const [auction, setAuction] = useState('Ні');
    const [proposition, setProposition] = useState('Від власника');
    const [files, setFiles] = useState([]);
    const [loadedFiles, setLoadedFiles] = useState([])

    const [parameters, setParameters] = useState('');

    document.title = 'Додати оголошення';

    useEffect(()=>{ 
        const unloadCallback = () => {
            for (let file of files) {
                fetch('https://diplomchuma-production.up.railway.app/delete_file', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({file: file})
                  })
            }
          };
  
          window.addEventListener("beforeunload", unloadCallback);
            return () => {
              window.removeEventListener('beforeunload', unloadCallback)
            }
    }, [files])

    useEffect(() => {
        
        if (!load) {
            getRealtyType(realtyType)
        }
        if (slug !== 'add-new-advertisement' && load) {

            fetch(`https://diplomchuma-production.up.railway.app/editor/${slug}`)
            .then((res) => {
                if (res.status === 403) 
                    {navigate('/403')
                } 
                if (res.status === 404) {
                    navigate('/404')
                } 
                return res.json()})
            .then((data) => {
                setRealtyType(data.realtyType)
                switch(data.realtyType){
                    case 'Будинок':
                    case 'Дача':
                    case 'Частина будинку':
                        setHouseType(data.parameters.house_type)
                        setDwellingType(data.parameters.dwelling_type)
                        setRoomsCount(data.parameters.rooms_count.toString())
                        setFloorCount(data.parameters.floor_count.toString())
                        setMansard(data.parameters.mansard ? 1 : '')
                        setBasement(data.parameters.basement ? 1 : '')
                        setWall(data.parameters.wall)
                        setHeating(data.parameters.heating)
                        setPlan(data.parameters.plan ? 1 : '')
                        setFurniture(data.parameters.furniture)
                        setSquare(data.parameters.general_square.toString())
                        setLSquare(data.parameters.living_square.toString())
                        setArea(data.parameters.area === 0 ? '' : data.parameters.area.toString())
                        setUnit(data.parameters.unit)
                        setGarage(data.parameters.garage ? 1 : '')
                        setBalcony(data.parameters.balcony ? 1 : '')
                        setFireplace(data.parameters.fireplace ? 1 : '')
                        setGarden(data.parameters.garden ? 1 : '')
                        setState(data.parameters.state)
                        setRoof(data.parameters.roof)
                        setElectricity(data.parameters.electricity)
                        setGas(data.parameters.gas)
                        setWater(data.parameters.water)
                        break;
                    case 'Квартира':
                        setDwellingType(data.parameters.type)
                        setRoomsCount(data.parameters.rooms_count.toString())
                        setFloorCount(data.parameters.floor_count.toString())
                        setWall(data.parameters.wall)
                        setHeating(data.parameters.heating)
                        setPlan(data.parameters.plan ? 1 : '')
                        setFurnitureFlat(data.parameters.furniture ? 1 : '')
                        setMulti(data.parameters.multi ? 1 : '')
                        setMansard(data.parameters.mansard ? 1 : '')
                        setSquare(data.parameters.general_square.toString())
                        setLSquare(data.parameters.living_square.toString())
                        setState(data.parameters.state)
                        setElectricity(data.parameters.electricity)
                        setGas(data.parameters.gas)
                        setWater(data.parameters.water)
                        break;
                    case 'Гараж':
                        setType(data.parameters.type)
                        setGarageType(data.parameters.garageType)
                        setRoomsCount(data.parameters.car.toString())
                        setWall(data.parameters.wall)
                        setRoof(data.parameters.roof)
                        setFloor(data.parameters.floor)
                        setSquare(data.parameters.square.toString())
                        setWidth(data.parameters.width.toString())
                        setLength(data.parameters.length.toString())
                        setGateWidth(data.parameters.gateWidth.toString())
                        setHeight(data.parameters.height.toString())
                        setPit(data.parameters.pit ? 1 : '')
                        setBasement(data.parameters.basement ? 1 : '')
                        setResidential(data.parameters.residential ? 1 : '')
                        setSectional(data.parameters.sectional ? 1 : '')
                        setState(data.parameters.state)
                        setElectricity(data.parameters.electricity)
                        break;
                    case 'Ділянка':
                        setSquare(data.parameters.square.toString())
                        setUnit(data.parameters.unit)
                        setRelief(data.parameters.relief)
                        setSoil(data.parameters.soil)
                        setRiver(data.parameters.river ? 1 : '')
                        setLake(data.parameters.lake ? 1 : '')
                        break;
                }
                setAdvertisementType(data.advertisementType)
                getData(data.region)
                getArea(data.city)
                setDistrict(data.district)
                setStreet(data.street)
                if (data.position) {
                    setPosition(data.position.split(',').map(coord => {return parseFloat(coord)}))
                    setMap(true)
                }
                setDescription(data.description)
                setPrice(data.price.toString())
                setCurrency(data.currency)
                setAuction(data.auction === 1 ? 'Так' : 'Ні')
                setLoadedFiles(data.images)
                setLoad(false) 
            })
        }

      }, [load, realtyType]);

    const getData = (data) => {
        setRegion(data);
        fetch('https://diplomchuma-production.up.railway.app/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          if (slug === 'add-new-advertisement')
            SetCity("");
        });
      }

      
      const getArea = (data) => {
        SetCity(data);
      }

      const clearState = () => {
        setSquare('')
        setLSquare('')
        setUnit('')
        setRelief('Не вказано')
        setSoil('Не вказано')
        setRiver('')
        setLake('')
        setType('Окремий гараж')
        setGarageType('Під легкове авто')
        setRoomsCount('1')
        setFloorCount('1')
        setFloor('Не вказано')
        setWall('')
        setRoof('Не вказано')
        setWidth('')
        setLength('')
        setHeight('')
        setGateWidth('')
        setPit('')
        setBasement('')
        setResidential('')
        setSectional('')
        setDwellingType('Новобудова')
        setHeating('Централізоване')
        setPlan('')
        setFurniture('З меблями')
        setFurnitureFlat('')
        setMansard('')
        setMulti('')
        setGarage('')
        setGarden('')
        setFireplace('')
        setBalcony('')
        setArea('')
        setState('Не вказано')
        setElectricity('Не вказано')
        setGas('Не вказано')
        setWater('Не вказано')
      }

      const getRealtyType = (data) => {
        if (slug === 'add-new-advertisement') clearState()
        setParameters(() => '');
        setRealtyType(data);
        switch(data){
            case 'Будинок':
            case 'Дача':
            case 'Частина будинку':
                setParameters(<House 
                    type={{value: house_type, 'set': setHouseType}} 
                    dwelling={{value: dwelling_type, 'set': setDwellingType}} 
                    rooms={{value: rooms_count, 'set': setRoomsCount}} 
                    floors={{value: floor_count, 'set': setFloorCount}} 
                    mansard={{value: mansard, 'set': setMansard}} 
                    basement={{value: basement, 'set': setBasement}}
                    wall={{value: wall, 'set': setWall}}
                    heating={{value: heating, 'set': setHeating}}
                    plan={{value: plan, 'set': setPlan}}
                    furniture={{value: furniture, 'set': setFurniture}}
                    general_square={{value: general_square, 'set': setSquare}}
                    living_square={{value: living_square, 'set': setLSquare}}
                    area={{value: area, 'set': setArea}}
                    unit={{value: unit, 'set': setUnit}}
                    garage={{value: garage, 'set': setGarage}}
                    fireplace={{value: fireplace, 'set': setFireplace}}
                    balcony={{value: balcony, 'set': setBalcony}}
                    garden={{value: garden, 'set': setGarden}}
                    state={{value: state, 'set': setState}}
                    roof={{value: roof, 'set': setRoof}}
                    electricity={{value: electricity, 'set': setElectricity}}
                    gas={{value: gas, 'set': setGas}}
                    water={{value: water, 'set': setWater}}
                />);
                break;
            case 'Квартира':
                setParameters(<Flat 
                    dwelling={{value: dwelling_type, 'set': setDwellingType}} 
                    rooms={{value: rooms_count, 'set': setRoomsCount}} 
                    floors={{value: floor_count, 'set': setFloorCount}}
                    wall={{value: wall, 'set': setWall}}
                    heating={{value: heating, 'set': setHeating}}
                    plan={{value: plan, 'set': setPlan}}
                    furniture={{value: furnitureFlat, 'set': setFurnitureFlat}}
                    mansard={{value: mansard, 'set': setMansard}}
                    multi={{value: multi, 'set': setMulti}}
                    general_square={{value: general_square, 'set': setSquare}}
                    living_square={{value: living_square, 'set': setLSquare}}
                    state={{value: state, 'set': setState}}
                    electricity={{value: electricity, 'set': setElectricity}}
                    gas={{value: gas, 'set': setGas}}
                    water={{value: water, 'set': setWater}}
                    />);
                break;
            case 'Гараж':
                setParameters(<Garage
                    type={{value: type, 'set': setType}}
                    garageType={{value: garageType, 'set': setGarageType}}
                    car={{value: rooms_count, 'set': setRoomsCount}}
                    wall={{value: wall, 'set': setWall}}
                    roof={{value: roof, 'set': setRoof}}
                    floor={{value: floor, 'set': setFloor}}
                    square={{value: general_square, 'set': setSquare}}
                    width={{value: width, 'set': setWidth}}
                    length={{value: length, 'set': setLength}}
                    gateWidth={{value: gateWidth, 'set': setGateWidth}}
                    height={{value: height, 'set': setHeight}}
                    pit={{value: pit, 'set': setPit}}
                    basement={{value: basement, 'set': setBasement}}
                    residential={{value: residential, 'set': setResidential}}
                    sectional={{value: sectional, 'set': setSectional}}
                    state={{value: state, 'set': setState}}
                    electricity={{value: electricity, 'set': setElectricity}}
                />);
                break;
            case 'Ділянка':
                setParameters(<Area
                    general_square={{value: general_square,'set': setSquare}}
                    unit={{value: unit,'set': setUnit}}
                    relief={{value: relief,'set': setRelief}}
                    soil={{value: soil,'set': setSoil}}
                    river={{value: river,'set': setRiver}}
                    lake={{value: lake,'set': setLake}}
                    />);
                break;
            default:
                break;
        }
        
      }

      const modalHandle = () =>{
        document.documentElement.className = '';
        setModal('')
      }

      const blurHandler = (phone) => {
        let phoneNumber = '';
        phoneNumber = phone ? phone : number.substring(0,10)
        if (phoneNumber.length < 10) return
        fetch('https://diplomchuma-production.up.railway.app/find_user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({phone: phoneNumber})  
        } ).then(res=>res.json()).then(data=>{
            if (data.length > 0) {
                user.id = data[0].id
            }
            else {
                document.documentElement.className = 'no-scroll';
                setModal(<Registration dialog={dialog} modalHandle={modalHandle} phone={phoneNumber} user={user}/>)
            }
        })
      }

      const formValidation = () => {
        if(number.trim() === '' && !user.id) {
            dialog('Помилка', 'Введіть номер телефону!');
            return false;
        }
        if (number.length < 10 && !user.id) {
            dialog('Помилка', 'Неправильний формат номеру телефона!');
            return false;
        }
        if (!user.id) {
            dialog('Помилка', 'Потрібно зареєструватись!');
            return false;
        }
        if (region === '') {
            dialog('Помилка', 'Потрібно обрати область!');
            return false;
        }
        if (city === '') {
            dialog('Помилка', 'Потрібно обрати місто!');
            return false;
        }
        if (district === '') {
            dialog('Помилка', 'Потрібно вказати район!');
            return false;
        }
        if (street === '') {
            dialog('Помилка', 'Потрібно вказати вулицю!');
            return false;
        }
        switch(realtyType){
            case 'Квартира':
                if (wall === '') {
                    dialog('Помилка', 'Оберіть тип стіни!');
                    return false;
                }
                if (general_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть площу квартири!');
                    return false;
                }
                if (living_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть житлову площу квартири!');
                    return false;
                }
                break;
            case 'Гараж':
                if (wall === '') {
                    dialog('Помилка', 'Оберіть тип стіни!');
                    return false;
                }
                if (general_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть площу гаража!');
                    return false;
                }
                if (width.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть ширину гаража!');
                    return false;
                }
                if (length.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть довжину гаража!');
                    return false;
                }
                if (gateWidth.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть ширину воріт!');
                    return false;
                }
                if (height.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть висоту воріт!');
                    return false;
                }
                break;
            case 'Ділянка':
                if (general_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть площу ділянки!');
                    return false;
                }
                if (unit === ''){
                    dialog('Помилка', 'Оберіть одиницю виміру!');
                    return false;
                }
                break;
            default:
                if (wall === '') {
                    dialog('Помилка', 'Оберіть тип стіни!');
                    return false;
                }
                if (general_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть площу будинку!');
                    return false;
                }
                if (living_square.toString().trim() === '')
                {
                    dialog('Помилка', 'Введіть житлову площу будинку!');
                    return false;
                }
                if (area.toString().trim() !== '') {
                    if (unit === '') {
                        dialog('Помилка', 'Оберіть одиницю виміру!');
                    return false;
                    }
                }
                break;
        }
        if (description === '') {
            dialog('Помилка', 'Додайте короткий опис!');
            return false;
        }
        if (price === '' || price === '0') {
            dialog('Помилка', 'Введіть вартість!');
            return false;
        }
        if ((files.length === 0 || files === undefined) && loadedFiles === '') {
            dialog('Помилка', 'Потрібно прикріпити фото!');
            return false;
        }

        if (files.length < 3 && loadedFiles.length === 0) {
            dialog('Помилка', 'Прикрипіть щонайменше 3 фото!');
            return false;
        }
        if(files.length + loadedFiles.length < 3){
            dialog('Помилка', 'Прикрипіть щонайменше 3 фото!');
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
        data.number = number;
        formData.append('number', number);
        formData.append('realtyType', realtyType);
        formData.append('advertisementType', advertisementType);
        formData.append('region', region);
        formData.append('city', city);
        formData.append('district', district);
        formData.append('street', street);
        formData.append('position', map ? position : '');
        switch (realtyType) {
            case 'Будинок':
            case 'Дача':
            case 'Частина будинку':
                formData.append('house_type', house_type);
                formData.append('dwelling_type', dwelling_type);
                formData.append('rooms_count', rooms_count);
                formData.append('floor_count', floor_count);
                formData.append('mansard', mansard);
                formData.append('basement', basement);
                formData.append('wall', wall);
                formData.append('heating', heating);
                formData.append('plan', plan);
                formData.append('furniture', furniture);
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
                formData.append('dwelling_type', dwelling_type);
                formData.append('rooms_count', rooms_count);
                formData.append('floor_count', floor_count);
                formData.append('wall', wall);
                formData.append('heating', heating);
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
                formData.append('type', type);
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

        formData.append('description', description);
        formData.append('price', price);
        formData.append('currency', currency);
        formData.append('auction', auction);
        formData.append('proposition', proposition);
        formData.append('files', JSON.stringify(files));

        if (slug !== 'add-new-advertisement'){
            formData.append('slug', slug)
            fetch('https://diplomchuma-production.up.railway.app/update_advertisement', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(Object.fromEntries(formData))
            }).then(response => {
                response.json().then(data => {
                    if (data.success === 1){
                        dialog('Успіх','Оголошення змінено',1)
                    }
                    else {
                        dialog('Помилка','Оголошення не змінено')
                    }
                });
            });
            return
        }

        formData.append('user', user.id);

        fetch('https://diplomchuma-production.up.railway.app/save_advertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(Object.fromEntries(formData))
          }).then(response => {
            response.json().then(data => {
                if (data.success === 1){
                    dialog('Успіх','Оголошення створено',1)
                    navigate(`/advertisement/${data.slug}`)
                }
                else {
                    dialog('Помилка','Оголошення не створено')
                }
            });
          });

      }

        return (
            <div className="app-screen">
                {modal}
                <Header />
                <div className="container">
                    <form className="new" onSubmit={handleSubmit}>
                        {slug === 'add-new-advertisement' &&
                            <div className="new">
                                {!user.name && 
                                    <div className="content-container">
                                        <Title type='contact' text='Контактні дані' />
                                        <span className="info-for-users">Надайте ваші контактні дані для того, щоб покупці знали, як з Вами можна зв'язатись.</span>
                                        <div className="inputs-container">
                                            <div className="input-row-container">
                                                <label className="input-label">Номер телефону</label>
                                                <Input 
                                                    handleChange={setNumber}
                                                    blurHandler={blurHandler}
                                                    type='text'
                                                    name='phone'
                                                    phone={true}
                                                    hint={<div><b>Формат номера телефону:</b><br></br>Код оператора + номер телефону<br></br>Наприклад: 000 0000000</div>}
                                                    value=''
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            
                                <div className="content-container">
                                    <Title type='realty' text='Основна інформація про нерухомість та тип оголошення' />
                                    <span className="info-for-users">Уважно вкажіть інформацію про вашу нерухомість. При редагуванні змінити тип нерухомості та оголошення буде неможливо.</span>
                                    <div className="inputs-container">
                                        <div className="input-row-container">
                                            <label className="input-label">Тип нерухомості</label>
                                            <div className="input-row">
                                                <Select class={"full"} handleData={getRealtyType} value={realtyType} placeholder="Тип нерухомості" name='realty' list={["Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}  />
                                            </div>
                                        </div>  
                                        <div className="input-row-container full">
                                            <label className="input-label">Тип оголошення</label>
                                            <div className="input-row">
                                                <Radiobutton changeHandler={setAdvertisementType} checked='checked' class='radiomark' name={"advertisement_type"} text='Продаж' />
                                                <Radiobutton changeHandler={setAdvertisementType} checked='' class='radiomark' name={"advertisement_type"} text='Оренда' />
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="content-container">
                            <Title type='location' text="Розташування об'єкту" />
                            <span className="info-for-users">Вкажіть розташування вашого об'єкту.</span>
                            <div className="input-row-container">
                                <label className="input-label">Оберіть область</label>
                                <div className="input-row">
                                    <Select handleData={getData} class={"full"} placeholder="Оберіть область" name='region' list={regions} value={region}/>
                                </div>
                            </div>  
                            <div className="input-row-container">
                                <label className="input-label">Оберіть місто</label>
                                <div className="input-row">
                                    <Select handleData={getArea} class={"full"} placeholder="Оберіть місто" name='sity' list={cities} value={city} />
                                </div>
                            </div>  
                            <div className="input-row-container">
                                <label className="input-label">Введіть район</label>
                                <div className="input-row">
                                    <Input handleChange={setDistrict} type='text' name='district' placeholder='Район' value={district}/>
                                </div>
                            </div>
                            <div className="input-row-container">
                                <label className="input-label">Введіть вулицю</label>
                                <div className="input-row">
                                    <Input handleChange={setStreet} type='text' name='street' placeholder='Вулиця' value={street}/>
                                </div>
                            </div>  
                            <span className="info-for-users">Вкажіть розташування вашого об'єкту на карті.</span>
                            <MapElement center={[48.9, 30.0]} position={position} zoom={6} mapHandler={setMap} handlePosition={setPosition} marker={true}/>
                        </div>

                        <div className="content-container">
                            <Title type='realty' text="Параметри нерухомості" />
                            <span className="info-for-users">Вкажіть основні параметри вашої нерухомості.</span>
                            {parameters}
                        </div>

                        <div className="content-container">
                            <Title type='description' text="Опис нерухомості" />
                            <span className="info-for-users">Додайте опис об'єкту. Контактні дані дублювати не потрібно.</span>
                            <textarea onChange={(e) => setDescription(e.target.value)} name='description' placeholder="Додайте короткий опис нерухомості" value={description}></textarea>
                        </div>

                        <div className="content-container">
                            <Title type='price' text="Вартість" />
                            <span className="info-for-users">Вкажіть вартість вашої нерухомості.</span>
                            <div className="input-row-container">
                                <label className="input-label">{advertisementType === 'Оренда' ? 'Вартість за добу' : 'Вартість нерухомості'}</label>
                                <div className="input-row">
                                    <Input handleChange={setPrice} type='text' value={price} name='price' price={true}/>
                                    <Select handleData={setCurrency} class={"full currency"} value={currency} name='currency' list={['$', 'грн']} />
                                </div>
                            </div>
                            <div className="input-row-container full">
                                <label className="input-label">Можливість торгу</label>
                                <div className="input-row">
                                    <Radiobutton changeHandler={setAuction} checked={auction === 'Так' ? 'checked' : ''} class='radiomark' name={"auction"} text='Так' />
                                    <Radiobutton changeHandler={setAuction} checked={auction === 'Ні' ? 'checked' : ''} class='radiomark' name={"auction"} text='Ні' />
                                </div>
                            </div>
                            {slug === 'add-new-advertisement' && <div className="input-row-container full">
                                <label className="input-label">Тип пропозиції</label>
                                <div className="input-row">
                                    <Radiobutton changeHandler={setProposition} checked={proposition === 'Від власника' ? 'checked' : ''} class='radiomark' name={"proposition"} text='Від власника' />
                                    <Radiobutton changeHandler={setProposition} checked={proposition === 'Від посередника' ? 'checked' : ''} class='radiomark' name={"proposition"} text='Від посередника' />
                                </div>
                            </div>}
                        </div>

                        <div className="content-container">
                            <Title type='photo' text="Фото" />
                            <span className="info-for-users">Додайте фото вашої нерухомості. Намагайтесь завантажити як можна більше фотографій та підібрати вдалий ракурс.</span>
                            <DragAndDropFile handleChange={setFiles} slug={slug} handleLoaded={setLoadedFiles} loadedFiles={loadedFiles} warning={dialog} type='img' filter={['.jpg', '.JPG', '.jpeg', '.png']} />
                        </div>
                        <div className="edit-btn-cont">
                            <button className='btn edit-f' type='submit'>Зберегти</button>
                        </div>
                    </form>
                </div>
            </div>
        )
}