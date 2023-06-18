import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import Select from "../Components/Inputs/Select";

import regions from "../Utils/Regions";
import { useNavigate } from "react-router";
import TableCard from "../Components/Cards/TableCard";
import AgencySmallCard from "../Components/Cards/AgencySmallCard";
import { Link } from "react-router-dom";

export default function Home () {

    const navigate = useNavigate()

    const [cities, SetCities] = useState("");
    const [city, SetCity] = useState("");
    const [region, setRegion] = useState("");
    const [realty, setRealty] = useState('')
    const [advertisement, setAdvertisement] = useState('')
    const [data, setData] = useState([])
    const [agencies, setAgencies] = useState([])
    const [count, setCount] = useState('')

    document.title = 'Головна'

    const regionHandler = (data) => {
        setRegion(data);
        fetch('https://diplomchuma-production.up.railway.app/region/:'+data).then((res) => res.json()).then((data) => {
            SetCities(data.cities);
            SetCity("");
        });
      }

    useEffect(() => {
        fetch('https://diplomchuma-production.up.railway.app/search?realty=Вся нерухомість&advertisement=Всі оголошення&proposition=Всі варіанти&map=Всі варіанти&auction=Всі варіанти&sort=Спочатку нові&count=4&top=1').then(res=>res.json()).then(data=>{
            setData(data.realty)
            setCount(data.count)
        })
        fetch('https://diplomchuma-production.up.railway.app/getAgencies').then(res=>res.json()).then(data=>{
            setAgencies(data)
        })
     }, []) 

        return (
            <div className="app-screen">
                <Header />
                <div className="home-background">
                    <span className="home-title">Всього оголошень на сайті: {count}</span>
                    <div className="container list-home-container">
                        <Select class='home-list' value={region} handleData={regionHandler} placeholder='Область' list={regions}/>
                        <Select class='home-list' value={city} handleData={SetCity} placeholder='Місто' list={cities} />
                        <Select class='home-list' value={realty} handleData={setRealty} placeholder='Нерухомість' list={["Вся нерухомість", "Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}/>
                        <Select class='home-list' value={advertisement} handleData={setAdvertisement} placeholder='Оголошення' list={["Всі оголошення", "Продаж", "Оренда"]}/>
                        <button className="btn home-btn" onClick={() => {
                            navigate(`/search?${region !== '' ? `region=${region}&` : ''}${city !== '' ? `city=${city}&` : ''}${realty === '' ? 'realty=Вся нерухомість' : `realty=${realty}`}${advertisement === '' ? '&advertisement=Всі оголошення' : `&advertisement=${advertisement}`}&proposition=Всі варіанти&map=Всі варіанти&auction=Всі варіанти&sort=Спочатку нові&page=1`)
                        }}></button>
                    </div>
                </div>
                <div className="container home">
                    <span className="home-text">Рекомендовані пропозиції</span>
                    <div className="home-card">
                    {data.map((element, index) => {
                        return (
                            <TableCard  key={index} hideHeart={true} id={element.id} showTags={false} selectHandler={()=>{}} price={element.price} images={element ? element.images : ""}  date={element.date} tags={element.tags} street={element.street} city={element.city} priceinua={element.priceinua} square={element.square} description={element.description} slug={element.slug}/>
                        )
                    })}
                    </div>
                    <span className="home-text">Агентства нерухомості</span>
                    <div className="home-card">
                        {agencies.map((element, index) => {
                            return(
                                <AgencySmallCard key={index} name={element.name} id={element.id} logo={element.logo} />
                            )
                        })}
                    </div>
                    <Link className="agencies" to='/agencies?page=1'>Переглянути всі агентства</Link>
                </div>
            </div>
        )
}