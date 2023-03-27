import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../Components/Header/Header";
import Title from "../Components/Title";

import PhotoViewer from "../Components/Inputs/PhotoViewer";
import MapElement from "../Components/Map/MapElement";
import UserCard from "../Components/Cards/UserCard";

export default function Advertisement() {

    const [data, setData] = useState("");
    const [advertisementTitle, setTitle] = useState('');
    const [parameters, setParameters] = useState('');

    const location = useLocation();
    
    React.useEffect(() => {
        fetch(location.pathname)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                switch(data.realtyType){
                    case 'Будинок':
                        setTitle(`${data.advertisementType} будинку`)
                        break;
                    case 'Квартира':
                        setTitle(`${data.advertisementType} квартири`)
                        break;
                    case 'Дача':
                        setTitle(`${data.advertisementType} дачі`)
                        break;
                    case 'Ділянка':
                        setTitle(`${data.advertisementType} ділянки`)
                        break;
                    case 'Гараж':
                        setTitle(`${data.advertisementType} гаражу`)
                        break;
                    case 'Частина будинку':
                        setTitle(`${data.advertisementType} частини будинку`)
                        break;
                    default:
                        break;
                }
                switch (data.realtyType) {
                    case 'Будинок':
                    case 'Дача':
                    case 'Частина будинку':
                        setParameters(
                            <div className="advertisement-info-container">
                                <div className="advertisement-title-text common">Загальні параметри</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Тип будинку: {data.parameters.house_type}</div>
                                    <div className="advertisement-info">Тип нерухомості: {data.parameters.dwelling_type}</div>
                                    <div className="advertisement-info">Кількість кімнат: {data.parameters.rooms_count}</div>
                                    <div className="advertisement-info">Кількість поверхів: {data.parameters.floor_count}</div>
                                    <div className="advertisement-info">Стіни: {data.parameters.wall.toLowerCase()}</div>
                                    <div className="advertisement-info">Дах: {data.parameters.roof.toLowerCase()}</div>
                                    <div className="advertisement-info">Опалення: {data.parameters.heating.toLowerCase()}</div>
                                    <div className="advertisement-info">Стан об'єкту: {data.parameters.state.toLowerCase()}</div>
                                </div>
                                <div className="advertisement-title-text size">Розмір</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Загальна площа: {data.parameters.general_square} м²</div>
                                    <div className="advertisement-info">Житлова площа: {data.parameters.living_square} м²</div>
                                    {data.parameters.unit && 
                                        <div className="advertisement-info">Площа ділянки: {data.parameters.area} {data.parameters.unit}</div>
                                    }
                                </div>
                                <div className="advertisement-title-text advantages">Переваги</div>
                                <div className="advertisement-info-params-container">
                                    <div className={'advantages-info ' + (data.parameters.plan ? 'yes' : 'no')}>Чорнова штукатурка</div>
                                    <div className={'advantages-info ' + (data.parameters.furniture !== '' ? 'yes' : 'no')}>З меблями</div>
                                    <div className={'advantages-info ' + (data.parameters.mansard ? 'yes' : 'no')}>Мансардний поверх</div>
                                    <div className={'advantages-info ' + (data.parameters.basement ? 'yes' : 'no')}>Підвальний поверх</div>
                                    <div className={'advantages-info ' + (data.parameters.balcony ? 'yes' : 'no')}>Балкон</div>
                                    <div className={'advantages-info ' + (data.parameters.garage ? 'yes' : 'no')}>Гараж</div>
                                    <div className={'advantages-info ' + (data.parameters.fireplace ? 'yes' : 'no')}>Камін</div>
                                    <div className={'advantages-info ' + (data.parameters.garden ? 'yes' : 'no')}>Сад</div>
                                </div>
                                <div className="advertisement-title-text communication">Комунікації</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Електроенергія: {data.parameters.electricity.toLowerCase()}</div>
                                    <div className="advertisement-info">Газ: {data.parameters.gas.toLowerCase()}</div>
                                    <div className="advertisement-info">Вода: {data.parameters.water.toLowerCase()}</div>
                                </div>
                            </div>
                        );
                        break;
                    case 'Квартира':
                        setParameters(
                            <div className="advertisement-info-container">
                                <div className="advertisement-title-text common">Загальні параметри</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Тип нерухомості: {data.parameters.type.toLowerCase()}</div>
                                    <div className="advertisement-info">Кількість кімнат: {data.parameters.rooms_count}</div>
                                    <div className="advertisement-info">Поверх: {data.parameters.floor_count}</div>
                                    <div className="advertisement-info">Стіни: {data.parameters.wall.toLowerCase()}</div>
                                    <div className="advertisement-info">Опалення: {data.parameters.heating.toLowerCase()}</div>
                                    <div className="advertisement-info">Стан квартири: {data.parameters.state.toLowerCase()}</div>
                                </div>
                                <div className="advertisement-title-text size">Розмір</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Загальна площа: {data.parameters.general_square} м²</div>
                                    <div className="advertisement-info">Житлова площа: {data.parameters.living_square} м²</div>
                                </div>
                                <div className="advertisement-title-text advantages">Переваги</div>
                                <div className="advertisement-info-params-container">
                                    <div className={'advantages-info ' + (data.parameters.plan ? 'yes' : 'no')}>Чорнова штукатурка</div>
                                    <div className={'advantages-info ' + (!data.parameters.furniture ? 'yes' : 'no')}>З меблями</div>
                                    <div className={'advantages-info ' + (data.parameters.multi ? 'yes' : 'no')}>Багаторівнева</div>
                                    <div className={'advantages-info ' + (data.parameters.mansard ? 'yes' : 'no')}>З мансардою</div>
                                </div>
                                <div className="advertisement-title-text communication">Комунікації</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Електроенергія: {data.parameters.electricity.toLowerCase()}</div>
                                    <div className="advertisement-info">Газ: {data.parameters.gas.toLowerCase()}</div>
                                    <div className="advertisement-info">Вода: {data.parameters.water.toLowerCase()}</div>
                                </div>
                            </div>
                        );
                        break;
                    case 'Ділянка':
                        setParameters(
                            <div className="advertisement-info-container">
                                <div className="advertisement-title-text common">Загальні параметри</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Рельєф: {data.parameters.relief.toLowerCase()}</div>
                                    <div className="advertisement-info">Грунт: {data.parameters.soil.toLowerCase()}</div>
                                </div>
                                <div className="advertisement-title-text size">Розмір</div>
                                <div className="advertisement-info">Площа ділянки: {data.parameters.square} {data.parameters.unit.toLowerCase()}</div>
                                <div className="advertisement-title-text advantages">Переваги</div>
                                <div className="advertisement-info-params-container">
                                    <div className={'advantages-info ' + (data.parameters.river ? 'yes' : 'no')}>Неподалік річка</div>
                                    <div className={'advantages-info ' + (data.parameters.lake ? 'yes' : 'no')}>Неподалік озеро</div>
                                </div>
                            </div>
                        );
                        break;
                    case 'Гараж':
                        setParameters(
                            <div className="advertisement-info-container">
                                <div className="advertisement-title-text common">Загальні параметри</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Тип гаража: {data.parameters.type.toLowerCase()}</div>
                                    <div className="advertisement-info">Призначення: {data.parameters.garageType.toLowerCase()}</div>
                                    <div className="advertisement-info">Машиномісць: {data.parameters.car}</div>
                                    <div className="advertisement-info">Стіни: {data.parameters.wall.toLowerCase()}</div>
                                    <div className="advertisement-info">Дах: {data.parameters.roof.toLowerCase()}</div>
                                    <div className="advertisement-info">Підлога: {data.parameters.floor.toLowerCase()}</div>
                                    <div className="advertisement-info">Стан гаражу: {data.parameters.state.toLowerCase()}</div>
                                </div>
                                <div className="advertisement-title-text size">Розмір</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Загальна площа: {data.parameters.square} м²</div>
                                    <div className="advertisement-info">Ширина гаражу: {data.parameters.width} м</div> 
                                    <div className="advertisement-info">Довжина гаражу: {data.parameters.length} м</div>
                                    <div className="advertisement-info">Ширина воріт: {data.parameters.gateWidth} м</div>
                                    <div className="advertisement-info">Висота воріт: {data.parameters.height} м</div>
                                </div>
                                <div className="advertisement-title-text advantages">Переваги</div>
                                <div className="advertisement-info-params-container">
                                    <div className={'advantages-info ' + (data.parameters.pit ? 'yes' : 'no')}>Оглядова яма</div>
                                    <div className={'advantages-info ' + (data.parameters.basement ? 'yes' : 'no')}>Підвал</div>
                                    <div className={'advantages-info ' + (data.parameters.residential ? 'yes' : 'no')}>Житловий</div>
                                    <div className={'advantages-info ' + (data.parameters.sectional ? 'yes' : 'no')}>Розбірний</div>
                                </div>
                                <div className="advertisement-title-text communication">Комунікації</div>
                                <div className="advertisement-info-params-container">
                                    <div className="advertisement-info">Електроенергія: {data.parameters.electricity.toLowerCase()}</div>
                                </div>
                            </div>
                        );
                        break;
                    default:
                        break;
                }
            });
    }, [location.pathname]);

    if (!data) return;

    return (
        <div className="app-screen">
            <Header />
            <div className="container advertisement-viewer">
                <div className="realty-params">
                    <PhotoViewer id={data.slug} images={data.images}/>
                    <div className="realty-advertisement-title">{advertisementTitle}</div>
                    <div className="advertisement-price">
                        Ціна за об'єкт: {data.price.toLocaleString('ua')} $ • {data.priceinuah.toLocaleString('ua')} грн. • {data.realtyType === 'Ділянка' || data.realtyType === 'Гараж' ? Math.ceil(data.price / data.parameters.square).toLocaleString('ua') : Math.ceil(data.price / data.parameters.general_square).toLocaleString('ua')} $ за {data.unit}
                    </div>
                    <div className="advertisement-date">
                        Оголошення опубліковано: {data.date}
                    </div>
                    <Title type='location' text="Розташування об'єкту" />
                    <div className="advertisement-info">Область: {data.region}</div>
                    <div className="advertisement-info">Місто: {data.city}</div>
                    <div className="advertisement-info">Район: {data.district}</div>
                    <div className="advertisement-info">Вулиця: {data.street}</div>
                    {data.position !== '' &&
                        <MapElement center={data.position.split(',')} position={data.position.split(',')} zoom='16' />
                    }
                    <Title type='realty' text="Параметри об'єкту" />
                    {parameters}
                    <div className="advertisement-title-text descr">Опис</div>
                    <div className="advertisement-info">{data.description}</div>
                    <Title type='contact' text="Контактні дані" />
                </div>
                <div className="advertisement-contacts">
                    <div className="user-container-advertisement-side-panel">
                        <UserCard user={data.user}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
