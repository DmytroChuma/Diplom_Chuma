import React, {useState, useEffect} from "react";

import Input from "../../Components/Inputs/Input";
import Select from "../../Components/Inputs/Select";
import regions from "../../Utils/Regions";
import store from '../../Store/Store';

export default function Settings() {

    const [avatar, setAvatar] = useState(null);
    const [url, setURL] = useState('http://localhost:3001/users/avatar.png');
    
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('');
    const [cities, SetCities] = useState("");
    const [region, setRegion] = useState('Не вказано');
    const [city, SetCity] = useState("Не вказано");
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setAvatar(e.target.files[0]);
            setURL(URL.createObjectURL(e.target.files[0]))
        }
    }

    useEffect(() => {
        fetch('/user_info').then((res) => res.json()).then((data) => {
            console.log(data)
            setName(data.name)
            setSurname(data.surname)
            setPhone(data.phone);
            setEmail(data.email);
            if (data.avatar !== '') {
                setURL(`http://localhost:3001/users/${data.avatar}`);
            }
            if (data.region !== '')
                setRegion(data.region)
            if (data.city !== '')
                SetCity(data.city)
        });
        if (store.getState()) {
        
        }
    }, [])

    const getData = (data) => {
        setRegion(data);
        fetch('/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          SetCity("Не вказано");
        });
    }

    const getCity = (data) => {
        SetCity(data);
    }

    const handleSubmit = () => {
        console.log(name)
        console.log(test)
    }

    const handleChange = (value, name) => {
       //setUser({...user, name: value})
        console.log(name)
        console.log(value)

    //    setUser({...obj})
    }

    return (
        <div className="cabinet-container user">
            <div className="user-form">
                <div className="user-avatar-input-cont">
                    <div className="image-user">
                        <input type='file' accept='image/*' id='user-avatar' style={{display: 'none'}} onChange={handleImage}/>
                        <label htmlFor='user-avatar' className="user-form-img-container">
                            <img className="user-form-img" src={url} alt=''/>
                        </label>
                    </div>
                    <div className="user-name-cont">
                        <div className="input-row-user">
                            <span className="user-form-input-text">Ім'я</span>
                            <Input handleChange={setName} type='text' name='name' placeholder="Ім'я" class='' value={name}/>
                        </div>
                        <div className="input-row-user">
                            <span className="user-form-input-text">Прізвище</span>
                            <Input handleChange={setSurname} type='text' name='surname' placeholder="Прізвище" class='' value={surname}/>
                        </div>
                    </div>
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Область</span>
                    <Select handleData={getData} class='full-user' placeholder="Оберіть область" name='region' readonly={false} list={regions} value={region} />
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Місто</span>
                    <Select handleData={getCity} class='full-user' placeholder="Оберіть місто" name='city' readonly={false} list={cities} value={city}/>
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Телефон</span>
                    <Input handleChange={setPhone} type='text' name='phone' placeholder="Телефон" class='' value={phone}/>
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Email</span>
                    <Input handleChange={setEmail} type='text' name='email' placeholder="Email" class='' value={email}/>
                </div>
                <button className="btn" onClick={handleSubmit}>Зберегти</button>
            </div>
        </div>
    );
}