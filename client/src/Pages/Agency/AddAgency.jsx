import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from "../../Components/Inputs/Select";
import Input from "../../Components/Inputs/Input";
import regions from "../../Utils/Regions";
import axiosInstance from "../../Utils/Axios";
import store from "../../Store/Store";
import UserLogin from "../../Store/ActionsCreators/UserLogin";

export default function AddAgency({dialog, text, id, data, dataHandler}) {

    const [phones, setPhones] = useState([{phone: ''}]);
    const [email, setEmail] = useState([{email: ''}]);
    const [logo, setLogo] = useState(null);
    const [url, setURL] = useState('https://house-f621.onrender.com/images/default.png');
    const [cities, SetCities] = useState("");
    const [region, setRegion] = useState('');
    const [city, SetCity] = useState("");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!text) {
            if (!store.getState()) {
                navigate(`/`);
                return;
            }
            if (store.getState().user.permission === 2 || store.getState().user.permission === 1) {
                navigate(`/user/cabinet`);
                return;
            }
        }

        if (text) {
            if (!store.getState()) {
                navigate(`/agency/${id}/agency`);
                return;
            }
            if (store.getState().user.permission !== 2 && store.getState().user.agency !== id) {
                navigate(`/agency/${id}/agency`);
                return;
            }
            getData(data.region)
            SetCity(data.city)
            setName(data.name)
            setDescription(data.description)
            setPhones(data.phones.split(',').map((element) => {return {phone: element}}))
            setEmail(data.emails.split(',').map((element) => {return {email: element}}))
            setURL(data.logo === '' ? 'https://house-f621.onrender.com/images/default.png' : `https://house-f621.onrender.com/images/agency/${data.logo}`)
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

    const getData = (data, city) => {
        setRegion(data);
        fetch('https://house-f621.onrender.com/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          if (city)
            SetCity("");
        });
    }

    const getCity = (data) => {
        SetCity(data);
    }

    const validate = () => {
        if(name.trim() === '') {
            dialog('Помилка', 'Введіть назву агентства')
            return false
        }
        if (region === '') {
            dialog('Помилка', 'Оберіть регіон')
            return false
        }
        if (city === '') {
            dialog('Помилка', 'Оберіть місто')
            return false
        }
        if (description.trim() === '') {
            dialog('Помилка', 'Введіть опис агентства')
            return false
        }
        for (let phone of phones) {
            if (phone.phone.length !== 10) {
                dialog('Помилка', 'Неправильний формат телефону')
                return false
            }
        }
        for (let mail of email) {
            if (mail.email.trim() === '') {
                dialog('Помилка', 'Заповніть всі поля для електронних пошт агентства')
                return false
            }
            const pattern = /^\S+@\S+\.\S+$/;
            if (!pattern.test(mail.email)) {
                dialog('Помилка', "Неправильний формат Email");
                return false;
            }
        }
        return true
    }

    const submitHandle = async () => {
        if(validate()) {
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
                }
            });
            formData = new FormData();
            formData.append('file', path);
            formData.append('name', name);
            formData.append('region', region)
            formData.append('city', city)
            formData.append('description', description)
            formData.append('phones', JSON.stringify(phones))
            formData.append('emails', JSON.stringify(email))
            formData.append('user', store.getState().user.id)

            if (text) {

                await axiosInstance.post("/update_agency", {
                    id: id,
                    name: name,
                    file: path,
                    region: region,
                    city: city,
                    description: description,
                    phones: JSON.stringify(phones),
                    emails: JSON.stringify(email),
                    oldLogo: logo ? data.logo : ''
                }).then((res) => {
                    if (res.data.success === 1) {
                        let phonesArr = [];
                        for (let phone of phones) {
                            phonesArr.push(phone.phone)
                        }

                        let emailsArr = [];
                        for (let element of email) {
                            emailsArr.push(element.email)
                        }
                        dialog("Успіх", "Інформацію оновлено", 1)
                        dataHandler({
                            name: name,
                            logo: path !== '' ? path.split('/')[1] : data.logo,
                            description: description,
                            region: region,
                            city: city,
                            phones:phonesArr.join(','),
                            emails: emailsArr.join(',')
                        })
                    }
                })
            }
            else {
                await axiosInstance.post("/create_agency", formData, {
                        headers: {
                        "Content-Type": "multipart/form-data",
                        }
                }).then((res) => {
                    if (res.data.success === 1) {
                        dialog("Успіх", "Агентство створено успішно", 1)
                        fetch('https://house-f621.onrender.com/permission', {
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
                        fetch('https://house-f621.onrender.com/delete_file', {
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
        }
    }

    document.title = 'Додати агентство';
    if(text) document.title = "Налаштування";

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
                        <Select handleData={getData} class='' placeholder="Оберіть область" name='region' list={regions} value={region}/>
                    </div>
                </div>
                <div className="agency-form-input">
                    <span className="agency-form-input-text">Місто</span>
                    <div className="input-row">
                        <Select handleData={getCity} class='' placeholder="Оберіть місто" name='city' list={cities} value={city}/>
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
                    <textarea onChange={(e) => setDescription(e.target.value)} value={(description)} className="agency-textarea"></textarea>
                </div>
                <button className="btn" onClick={submitHandle}>{text ? 'Змінити' : 'Створити'}</button>
            </div>
        </div>
        
    )
}