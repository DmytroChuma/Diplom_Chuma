import React, {useState, useEffect} from "react";

import Input from "../../Components/Inputs/Input";
import Select from "../../Components/Inputs/Select";
import regions from "../../Utils/Regions";
import store from '../../Store/Store';
import UserLogin from "../../Store/ActionsCreators/UserLogin";
import axiosInstance from "../../Utils/Axios";
import Code from "../../Components/Dialogs/Code";

export default function Settings({dialog}) {

    const [avatar, setAvatar] = useState(null);
    const [url, setURL] = useState('https://diplomchuma-production.up.railway.app/users/avatar.png');
    
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('');
    const [cities, SetCities] = useState("");
    const [region, setRegion] = useState('Не вказано');
    const [city, SetCity] = useState("Не вказано");
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [showBtn, setShowBtn] = useState(false)
    const [showDescription, setShowDescription] = useState(false);
    const [defaultAvatar, setDefault] = useState(false);
    
    const [modal, setModal] = useState('');

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setShowBtn(true);
            setAvatar(e.target.files[0]);
            setURL(URL.createObjectURL(e.target.files[0]))
            setDefault(false);
        }
    }

    useEffect(() => {
        fetch('https://diplomchuma-production.up.railway.app/user_info').then((res) => res.json()).then((data) => {
            setName(data.name)
            setSurname(data.surname)
            setPhone(data.phone);
            setEmail(data.email);
            if (data.permission > 0) {
                setShowDescription(true);
                setDescription(data.description);
            }
            if (data.avatar !== '') {
                setShowBtn(true);
                setURL(`https://diplomchuma-production.up.railway.app/users/${data.avatar}`);
            }
            if (data.region !== '')
                getData(data.region, false)
            if (data.city !== '')
                SetCity(data.city)
        });
        if (store.getState()) {
        
        }
    }, [])

    const getData = (data, city) => {
        setRegion(data);
        fetch('https://diplomchuma-production.up.railway.app/region/:'+data).then((res) => res.json()).then((data) => {
          SetCities(data.cities);
          if (city)
            SetCity("Не вказано");
        });
    }

    const getCity = (data) => {
        SetCity(data);
    }

    const validate = () => {
        if (name.trim() === '') {
            dialog('Помилка', "Введіть ім'я")
            return false;
        }
        if (surname.trim() === '') {
            dialog('Помилка', "Введіть прізвище")
            return false;
        }
        if (phone.trim() === '') {
            dialog('Помилка', "Введіть телефон")
            return false;
        }
        if (phone.trim().length < 10) {
            dialog('Помилка', "Неправильний формат номеру телефона")
            return false;
        }
        if (email.trim() === '') {
            dialog('Помилка', "Введіть Email")
            return false;
        }
        const pattern = /^\S+@\S+\.\S+$/;
            if (!pattern.test(email)) {
                dialog('Помилка', "Неправильний формат Email");
                return false;
            }
        return true;
    }

    const handleSubmit = async () => {

        if(validate()) {
            let file = '';
            let formData = new FormData();
            formData.append('file', avatar)
            await axiosInstance.post("/upload_file", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                }
            }).then((res) => {
                if (res.data.status !== 'error'){
                    let path = res.data.path.split('\\');
                    path.shift();
                    file = path.join('/');
                }
            })

            await axiosInstance.post("/update_user", {
                id: store.getState().user.id,
                name: name,
                surname: surname,
                region: region === 'Не вказано' ? '' : region ,
                city: city === 'Не вказано' ? '' : city ,
                phone: phone,
                email: email,
                avatar: file,
                description: description,
                oldAvatar: defaultAvatar ? store.getState().user.avatar : '' ,
                defaultAvatar: defaultAvatar
            }).then((res) => {
                if (res.data.success === 1){
                    let user = store.getState().user;
                    user.name = `${name} ${surname}`;
                    user.avatar = file === '' ? user.avatar : file.split('/')[1];
                    if (defaultAvatar) {
                        user.avatar = ''
                    }
                    store.dispatch(UserLogin(user));
                    dialog('Успіх','Дані збережено',1)
                }
            })
        }
    }

    document.title = 'Налаштування';
    
    return (
        <div className="cabinet-container user">
            {modal}
            <div className="user-form">
                <div className="user-avatar-input-cont">
                    <div className="image-user">
                        {showBtn && <div className="avatar-delete" onClick={() => {setShowBtn(false); setAvatar(null); setURL('https://diplomchuma-production.up.railway.app/users/avatar.png'); setDefault(true)}}></div>}
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
                    <Select handleData={getData} class='full-user' placeholder="Оберіть область" name='region' list={regions} value={region} />
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Місто</span>
                    <Select handleData={getCity} class='full-user' placeholder="Оберіть місто" name='city' list={cities} value={city}/>
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Телефон</span>
                    <Input handleChange={setPhone} phone={true} type='text' name='phone' placeholder="Телефон" class='' value={phone}/>
                </div>
                <div className="input-row-user">
                    <span className="user-form-input-text">Email</span>
                    <Input handleChange={setEmail} type='text' name='email' placeholder="Email" class='' value={email}/>
                </div>
                {showDescription && 
                    <div className="user-form-input textarea">
                        <span className="user-form-input-text-t">Короткий опис про себе</span>
                        <textarea onChange={(e) => setDescription(e.target.value)} className="user-textarea" value={description}></textarea>
                    </div>
                }
                <div className="pass-change">
                    <button className="pass-btn" onClick={() => {setModal(<Code dialog={dialog} email={email} modalHandle={setModal}/>)}}>Змінити пароль</button>
                </div>
                <button className="btn" onClick={handleSubmit}>Зберегти</button>
            </div>
        </div>
    );
}