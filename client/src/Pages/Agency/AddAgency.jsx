import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from "../../Components/Inputs/Select";
import Input from "../../Components/Inputs/Input";
import regions from "../../Utils/Regions";
import axiosInstance from "../../Utils/Axios";
import store from "../../Store/Store";
import UserLogin from "../../Store/ActionsCreators/UserLogin";

export default function AddAgency({dialog, text}) {

    const [phones, setPhones] = useState([{phone: ''}]);
    const [email, setEmail] = useState([{email: ''}]);
    const [logo, setLogo] = useState(null);
    const [url, setURL] = useState('http://localhost:3001/images/default.png');
    const [cities, SetCities] = useState("");
    const [region, setRegion] = useState('');
    const [city, SetCity] = useState("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (text) {
            //check if not owner
            //fetch('')
        }
    }, [])

    const handleChange = (e, i, arr, func) => {
        const {name, value} = e.target;
        const newArr = [...arr];
        newArr[i][name] = value;
        func(newArr); 
    }

    const handleRemove = (arr, i, func) => {
        const newArr = [...arr];
        newArr.splice(i, 1);
        func(newArr);
    }

    const handleAdd = (arr, obj, func) => {
        func([...arr, obj]);
    }   
    
    const handleImage = (e) => {
        if (e.target.files[0]) {
            setLogo(e.target.files[0]);
            setURL(URL.createObjectURL(e.target.files[0]))
        }
    }

    const getData = (data) => {
        setRegion(data);
        fetch('/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          SetCity("");
        });
    }

    const getCity = (data) => {
        SetCity(data);
    }

    const submitHandle = async () => {
        let path = '';
        let formData = new FormData();
        formData.append('file', logo);
        await axiosInstance.post("/upload_file", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        }).then((res) => {
            if (res.data.status !== 'error'){
                path = res.data.path.split('\\');
                path.shift();
                path = path.join('/');
                formData = new FormData();
                formData.append('file', path);
            }
        });
        formData.append('name', name);
        formData.append('region', region)
        formData.append('city', city)
        formData.append('description', description)
        formData.append('phones', JSON.stringify(phones))
        formData.append('emails', JSON.stringify(email))
        formData.append('user', store.getState().user.id)
        await axiosInstance.post("/create_agency", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                }
        }).then((res) => {
            if (res.data.success === 1) {
                dialog("Успіх", "Агентство створено успішно", 1)
                fetch('/permission', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({permission: 2})});
                let user = store.getState().user
                user.permission = 2;
                store.dispatch(UserLogin(user));
                navigate(`/agency/${res.data.id}/agency`);
            }
            else {
                dialog("Помилка", "Не вдалося створити агентство", 1)
                fetch('/delete_file', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({file: path})});
            }
        })

        
    }

    return(
        <div className="agency-container">
            <div className="agency-form">
                <span className="title-agency-form">{text ? text : 'Заповніть форму створення агентства'}</span>
                <div className="separator"></div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Логотип</span>
                    <div className="input-row image">
                        <input type='file' accept='image/*' id='agency-logo' style={{display: 'none'}} onChange={handleImage}/>
                        <label htmlFor='agency-logo' className="agency-form-img-container">
                            <img className="agency-form-img" src={url} alt=''/>
                        </label>
                    </div>
                </div>  
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Назва агентства</span>
                    <Input handleChange={setName} type='text' name='name' placeholder='Назва' class='' value={name}/>
                </div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Область</span>
                    <div className="input-row">
                        <Select handleData={getData} class='' placeholder="Оберіть область" name='region' readonly={false} list={regions} value={region}/>
                    </div>
                </div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Місто</span>
                    <div className="input-row">
                        <Select handleData={getCity} class='' placeholder="Оберіть місто" name='city' readonly={false} list={cities} value={city}/>
                    </div>
                </div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Контактні телефони</span>
                    <div className="input-row column">
                        {phones.map((element, i) => {
                            return(
                                <div key={i} className='dinamyc-input'>
                                    <div className="input-row">
                                        <div className={"input-field "}>
                                            <input className='input full' value={element.phone} name='phone' onChange={(e) =>  handleChange(e, i, phones, setPhones)}/>
                                        </div>
                                    </div>
                                    {i === 0 && 
                                        <button className="add-btn" onClick={() => handleAdd(phones, {phone: ''}, setPhones)}>+</button>
                                    }
                                    {i > 0 &&
                                        <button className="del-btn" onClick={() => handleRemove(phones, i, setPhones)}>-</button>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Email</span> 
                    <div className="input-row column">
                        {email.map((element, i) => {
                            return(
                                <div key={i} className='dinamyc-input'>
                                    <div className="input-row">
                                        <div className={"input-field "}>
                                            <input className='input full' value={element.email} name='email' onChange={(e) =>  handleChange(e, i, email, setEmail)}/>
                                        </div>
                                    </div>
                                    {i === 0 && 
                                        <button className="add-btn" onClick={() => handleAdd(email, {email: ''}, setEmail)}>+</button>
                                    }
                                    {i > 0 &&
                                        <button className="del-btn" onClick={() => handleRemove(email, i, setEmail)}>-</button>
                                    }
                                </div>
                            )
                        })}
                    </div> 
                </div>
                <div className="agency-form-input textarea">
                    <span className="agency-form-input-text">Короткий опис агентства</span>
                    <textarea onChange={(e) => setDescription(e.target.value)} className="agency-textarea"></textarea>
                </div>
                <button className="btn" onClick={submitHandle}>Створити</button>
            </div>
        </div>
        
    )
}