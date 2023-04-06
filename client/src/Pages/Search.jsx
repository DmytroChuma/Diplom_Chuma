import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import queryString from 'query-string'

import ListCard from "../Components/Cards/ListCard";
import TableCard from "../Components/Cards/TableCard";
import Select from "../Components/Inputs/Select";
import Filter from "../Components/Inputs/Filter";
import Header from "../Components/Header/Header";
import NoResult from "../Components/NoResult";
import Pages from "../Components/Pages";
import Input from "../Components/Inputs/Input";
import useInput from "../Hook/useInput";
import handleSelect from "../Utils/HandleSelect";

import store from "../Store/Store";
import userSelect from "../Store/ActionsCreators/UserSelect";

export default function Search (){

        const generalFilterProperties = [
          {
            name: "proposition",
            text: "Пропозиція",
            type: 0,
            options: ["Всі варіанти", "Від власника", "Від посередника"]
          },
          {
            name: "map",
            text: "Позначено на мапі",
            type: 0,
            options: ["Всі варіанти", "Так", "Ні"]
          },
          {
            name: "auction",
            text: "Торг",
            type: 0,
            options: ["Всі варіанти", "Торг можливий", "Торг не можливий"]
          }
        ];

        const navigate = useNavigate();

        const location = useLocation();
    
        let [filter, setFilter] = useState({
          proposition: 'Всі варіанти',
          map: 'Всі варіанти',
          auction: 'Всі варіанти'
        });

        const [filterValue, setFilterValue] = useState('');

        const [filterOptions, setFilterOptions] = useState(generalFilterProperties);

        const [filterParams, setFilterParams] = useState({});

        const [realty, setRealty] = useState('Вся нерухомість');

        const [data, setData] = useState("");

        const [items, setItems] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);

        const [page, setPage] = useState(1);

        const [showPages, setShowPages] = useState(false);

        const [activePage, setActivePage] = useState(1);

        const [cities, SetCities] = useState("");

        const [city, SetCity] = useState("");

        const [region, setRegion] = useState("");

        const street = useInput('');

        const [sortType, SetSort] = useState("Спочатку нові");

        const [advertisement, setAdvertisement] = useState('Всі оголошення');

        const filterRef = React.useRef()

        const regions = ["Вінницька область", "Волинська область", "Дніпропетровська область", 
        "Донецька область", "Житомирська область", "Закарпатська область", "Запорізька область", 
        "Івано-Франківська область", "Київська область", "Кіровоградська область", "Луганська область", 
        "Львівська область", "Миколаївська область", "Одеська область", "Полтавська область", 
        "Рівненська область", "Сумська область", "Тернопільська область", "Харківська область", 
        "Херсонська область", "Хмельницька область", "Черкаська область", "Чернівецька область", 
        "Чернігівська область", "АР Крим"];

        document.title = 'Пошук нерухомості';

        const selectHandler = (id) => {
          handleSelect(id);
        }
        
        const getSelectHeart = (id) => {
          if (JSON.parse(localStorage.getItem('select')).includes(id)) {
            return true;
          }
          return false;
        }
        
        const createItems = (data, type) => {
          if(data.length === 0) {
            return(<NoResult/>);
          }
          localStorage.setItem('card', type);
          if (type === "0") {
            let list = [];
            for (let i = 0 ; i < data.length; i++) {
              list.push(<ListCard key={i} id={data[i].id} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug} />);
            }
            return(<div className="list-cards-container">
              {list}
              </div>);
          }
          else {
            let table = [];
            for (let i = 0 ; i < data.length; i++) {
              table.push(<TableCard key={i} id={data[i].id} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)}  date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug}/>);
            }
            return(<div className="table-cards-container">
              {table}
            </div>);
          }
        }

  
          useEffect(() => {
            let params = queryString.parse(location.search);
            if (params.page) {
              setActivePage(params.page)
            }
            setFilterParams(params);
            if (params.realty) {
              if (sortType !== params.sort) {
                SetSort(params.sort); 
              }
              if (advertisement !== params.advertisement) {
                setAdvertisement(params.advertisement);
              }
              if (realty !== params.realty) {
                realtySelectHandler(params.realty, params); 
              }
              delete params.sort;
              delete params.advertisement;
              delete params.realty;
              delete params.page;
              for (let parameter of Object.keys(params)) {
                filterDataHandler(parameter, params[parameter]);
              }
            }

            setItems(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
            setShowPages(false);
              fetch(location.pathname+location.search).then((res) => res.json()).then((data) => {
              setData(data.realty);
              setPage(Math.ceil(data.count / 5));
              if(data.length === 0) {
                setItems(<NoResult/>);
              }
              else {
                setItems(createItems(data.realty, localStorage.getItem('card')));
                setShowPages(true);
              }
            });
          }, [location]); 

          const toggleClass = (e) => {
            if(e.target.classList.contains("activate")) return;
            let buttons = document.getElementsByClassName('btn-check');
            for (let btn of buttons) {
              if (btn.classList.contains("activate")) {
                btn.classList.remove("activate");
              }
              else {
                btn.classList.add("activate");
              }
            }
          } 

        

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

          const createFilterLink = () => {
            let properies = [];
            for(let name in filter) {
              let value = filter[name];
              if (value === '') continue;
              value = Array.isArray(value) ? value.join(`&${name}=`) : value;
              properies.push(`${name}=${value}`);
            }

            let value = properies.join('&');
            setActivePage(1);
            navigate(`/search?advertisement=${advertisement}&realty=${realty}&${value}${value !== ''? "&" : ''}sort=${sortType}&page=${1}`);
            setFilterValue(value);
            return value;
          }

          const sort = (sort) => {
            SetSort(sort);
            setActivePage(1);
            navigate(`/search?advertisement=${advertisement}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sort}&page=${1}`);
          }

          async function fetchHandler (path) {
            let data;
            await fetch(path)
              .then((res) => res.json())
              .then((res) => {
                    data = JSON.parse(res);
              });
            return data;
          }

          const realtySelectHandler = async (type, params = '') =>{
            if (params === '' && type !== realty) setFilter({});
            if (params === '' && type !== realty) setFilterOptions([]);
           // let filterValue = createFilterLink(true);
            let data;
            /*let filterVal = filterValue;
            if (realty !== type) {
              filterVal = '';
            }*/
            setRealty(type);
            setActivePage(1);
            if (params === '') {
              navigate(`/search?advertisement=${advertisement}&realty=${type}&sort=${sortType}&page=${1}`);
            }
            
            switch(type){
              case 'Будинок':
              case 'Дача':
              case 'Частина будинку':
                data = await fetchHandler('/house');
                setFilterOptions([
                  {
                    name: 'type',
                    text: 'Тип житла',
                    type: 0,
                    options: ['Новобудова', 'Вторинне']
                  },
                  {
                    name: 'houseType',
                    text: 'Тип будинку',
                    type: 1,
                    options: ['Окремий будинок', 'Дуплекс', 'Таунхаус']
                  },
                  {
                    name: 'wall',
                    text: 'Стіни',
                    type: 1,
                    options: [...data.wall]
                  },
                  {
                    name: 'roof',
                    text: 'Дах',
                    type: 1,
                    options: [...data.roof.splice(1)]
                  },
                  {
                    name: 'heating',
                    text: 'Опалення',
                    type: 1,
                    options: ['Централізоване', 'Індивідуальне', 'Комбіноване', 'Без опалення']
                  },
                  {
                    name: 'plan',
                    text: 'Планування',
                    type: 1,
                    options: ['Чорнова штукатурка', 'Без меблів'],
                    value: ['plan', 'furniture']
                  },
                  {
                    name: 'advantages',
                    text: 'Переваги',
                    type: 1,
                    options: ['Мансардний поверх', 'Підвальний поверх', 'Гараж', 'Камін', 'Балкон', 'Сад'],
                    value: ['mansard', 'basement', 'garage', 'fireplace', 'balcony', 'garden']
                  },
                  {
                    name: 'state',
                    text: 'Стан будинку',
                    type: 1,
                    options: [...data.state.splice(1)]
                  },
                  {
                    name: 'electricity',
                    text: 'Електроенергія',
                    type: 1,
                    options: [...data.comm].splice(1),
                    value: ['2', '3', '4']
                  },
                  {
                    name: 'gas',
                    text: 'Газ',
                    type: 1,
                    options: [...data.comm].splice(1),
                    value: ['2', '3', '4']
                  },
                  {
                    name: 'water',
                    text: 'Вода',
                    type: 1,
                    options: [...data.comm].splice(1),
                    value: ['2', '3', '4']
                  },
                  ...generalFilterProperties])
                  filterDataHandler('type', 'Новобудова');
                  filterDataHandler('proposition', 'Всі варіанти');
                  filterDataHandler('map', 'Всі варіанти');
                  filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Квартира':
                data = await fetchHandler('/house');
                setFilterOptions([
                {
                  name: 'type',
                  text: 'Тип житла',
                  type: 0,
                  options: ['Новобудова', 'Вторинне']
                },
                {
                  name: 'wall',
                  text: 'Стіни',
                  type: 1,
                  options: [...data.wall.splice(1)]
                },
                {
                  name: 'heating',
                  text: 'Опалення',
                  type: 1,
                  options: ['Централізоване', 'Індивідуальне', 'Комбіноване', 'Без опалення']
                },
                {
                  name: 'plan',
                  text: 'Планування',
                  type: 1,
                  options: ['Чорнова штукатурка', 'Без меблів'],
                  value: ['plan', 'furniture']
                },
                {
                  name: 'advantages',
                  text: 'Переваги',
                  type: 1,
                  options: ['Мансардний поверх', 'Багаторівнева'],
                  value: ['mansard', 'multi']
                },
                {
                  name: 'state',
                  text: 'Стан квартири',
                  type: 1,
                  options: [...data.state.splice(1)]
                },
                {
                  name: 'electricity',
                  text: 'Електроенергія',
                  type: 1,
                  options: [...data.comm].splice(1),
                  value: ['2', '3', '4']
                },
                {
                  name: 'gas',
                  text: 'Газ',
                  type: 1,
                  options: [...data.comm].splice(1),
                  value: ['2', '3', '4']
                },
                {
                  name: 'water',
                  text: 'Вода',
                  type: 1,
                  options: [...data.comm].splice(1),
                  value: ['2', '3', '4']
                },
                ...generalFilterProperties])
                filterDataHandler('type', 'Новобудова');
                filterDataHandler('proposition', 'Всі варіанти');
                filterDataHandler('map', 'Всі варіанти');
                filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Гараж':
                data = await fetchHandler('/garage');
                setFilterOptions([
                  {
                    name: 'type',
                    text: 'Тип гаража',
                    type: 0,
                    options: ['Окремий гараж', 'Місце в кооперативі']
                  },
                  {
                    name: 'garageType',
                    text: 'Призначення',
                    type: 1,
                    options: [...data.type]
                  },
                  {
                    name: 'wall',
                    text: 'Стіни',
                    type: 1,
                    options: [...data.wall]
                  },
                  {
                    name: 'roof',
                    text: 'Дах',
                    type: 1,
                    options: [...data.roof.splice(1)]
                  },
                  {
                    name: 'floor',
                    text: 'Підлога',
                    type: 1,
                    options: [...data.floor.splice(1)]
                  },
                  {
                    name: 'advantages',
                    text: 'Переваги',
                    type: 1,
                    options: ['Оглядова яма', 'Підвал', 'Розбірний', 'Житловий'],
                    value: ['pit', 'basement', 'sectional', 'residential']
                  },
                  {
                    name: 'state',
                    text: 'Стан',
                    type: 1,
                    options: [...data.state.splice(1)]
                  },
                  {
                    name: 'electricity',
                    text: 'Електроенергія',
                    type: 1,
                    options: [...data.comm.splice(1)],
                    value: ['2', '3', '4']
                  },
                  ...generalFilterProperties])
                  filterDataHandler('type', 'Окремий гараж');
                  filterDataHandler('proposition', 'Всі варіанти');
                  filterDataHandler('map', 'Всі варіанти');
                  filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Ділянка':
                data = await fetchHandler('/area');
                setFilterOptions([
                  {
                    name: 'relief',
                    text: 'Рельєф',
                    type: 1,
                    options: [...data.relief.splice(1)]
                  },
                  {
                    name: 'soil',
                    text: 'Грунт',
                    type: 1,
                    options: [...data.soil.splice(1)]
                  },
                  {
                    name: "location",
                    text: "Розташування",
                    type: 1,
                    options: ["Біля річки", "Біля озера"],
                    value: ['river', 'lake']
                  },
                  ...generalFilterProperties])
                  filterDataHandler('proposition', 'Всі варіанти');
                  filterDataHandler('map', 'Всі варіанти');
                  filterDataHandler('auction', 'Всі варіанти');
                break;
              default:
                setFilterOptions([...generalFilterProperties]);
                break;
            }
          }

          const filterDataHandler = (name, value) => {
            let objName = name.includes('[]') ? name.substring(0, name.length - 2) : name;
            let property = filter[`${objName}`] ? [...filter[`${objName}`]] : [];
            let index = property.indexOf(value);
            if (name.includes('[]')) {
              if (index !== -1) {
                property.splice(index, 1);
              }
              else {
                property.push(value);
              }
            }
            else {
              property = value;
            }

            setFilter((prev) => ({
              ...prev,
              [`${objName}`] : property
            }))
          }

          const pagesHandler = (activePage) => {
            setActivePage(activePage);
            navigate(`/search?advertisement=${advertisement}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sortType}&page=${activePage}`);
          }

          const advertisementHandler = (advertisement) =>{
            setAdvertisement(advertisement);
            setActivePage(1);
            navigate(`/search?advertisement=${advertisement}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sortType}&page=${1}`);
          }

        return (
          <div className="app-screen">
            <Header />
            <div className="container">
              
              <div className="select-location-container">
                <Select class={"no-border"} handleData={getData} placeholder="Оберіть область" name='region' readonly={false} list={regions} value={region}/>
                <Select class={"no-border"} handleData={getArea} placeholder="Оберіть місто" name='city' readonly={false} list={cities} value={city} />
                <Input class={"no-border full"} placeholder="Введіть вулицю" name='street' value={street.value}  />
              </div>
            
              <div className="select-options-container">
                <div className="select-container">
                  <Select class={""} handleData={advertisementHandler} placeholder="Тип оголошення" value={advertisement} name='realty' readonly={true} list={["Всі оголошення", "Продаж", "Оренда"]} />
                  <Select class={""} handleData={realtySelectHandler} placeholder="Тип нерухомості" value={realty} name='realty' readonly={true} list={["Вся нерухомість", "Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}  />
                </div>
                <div className="filter-container-button">
                  <Filter ref={filterRef} options={filterOptions} dataHandler={filterDataHandler} parameters={filterParams}/>
                    <button className="btn" onClick={() => {
                      createFilterLink();
                      if (filterRef.current.children[1].classList.contains('show')){ 
                        filterRef.current.click();
                      }
                      }}>Застосувати</button>
                  </div>
              </div>
             
              <div className="separator"></div>

              <div className="settings-container">
                <Select class={""} handleData={sort} placeholder="Тип сортування" value={sortType} name='realty' readonly={true} list={["Спочатку нові", "Найдорожчі", "Найдешевші"]} />
                <div className="btn-check-container">
                  <Link className="btn link" to="/select">Обрані</Link>
                  <button onClick={(e) => {toggleClass(e); setItems(createItems(data, "0"))}} className={"list-check btn-check " + (localStorage.getItem('card') === "0" ? "activate" : "")}></button>
                  <button onClick={(e) => {toggleClass(e); setItems(createItems(data, "1"))}} className={"table-check btn-check " + (localStorage.getItem('card') === "1" ? "activate" : "")}></button>
                </div>
              </div>
              {items}
              {page > 1 && showPages && 
                <Pages pages={page} activePage={activePage} pageHandle={pagesHandler} />
              }
            </div>
          </div>
        )
}
