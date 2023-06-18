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
import handleSelect from "../Utils/HandleSelect";

import regions from "../Utils/Regions";

export default function Search (){

        const [generalFilterProperties] = useState([
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
        ]);

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

        const [priceMin, setPriceMin] = useState('')

        const [priceMax, setPriceMax] = useState('')

        const [currency, setCurrency] = useState('$')

        const [squareMin, setSquareMin] = useState('')

        const [squareMax, setSquareMax] = useState('')

        const [unit, setUnit] = useState('')

        const [rooms, setRooms] = useState('')

        const [parameters, setParameters] = useState('')

        const [sortType, SetSort] = useState("Спочатку нові");

        const [advertisement, setAdvertisement] = useState('Всі оголошення');

        const filterRef = React.useRef()

        document.title = 'Пошук нерухомості';

        const selectHandler = (id) => {
          handleSelect(id);
        }
        
        const getSelectHeart = (id) => {
          if (!localStorage.getItem('select')) return false
          if (JSON.parse(localStorage.getItem('select')).includes(id)) {
            return true;
          }
          return false;
        }
        
        const tagsHandler = useCallback((tag) => {      
          navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=Всі оголошення${parameters === '' ? '' : '&'}${parameters}&sort=Спочатку нові&realty=${tag.realty ? tag.realty : 'Вся нерухомість' }&${tag.type}=${tag.urlText}`)
        }, [city, navigate, parameters, region])

        const createItems = useCallback((data, type) => {
          if(data.length === 0) {
            return(<NoResult/>);
          }
          localStorage.setItem('card', type);
          if (type === "0") {
            let list = [];
            for (let i = 0 ; i < data.length; i++) {
              list.push(<ListCard key={i} id={data[i].id} showTags={true} tagsHandler={tagsHandler} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug} />);
            }
            return(<div className="list-cards-container">
              {list}
              </div>);
          }
          else {
            let table = [];
            for (let i = 0 ; i < data.length; i++) {
              table.push(<TableCard key={i} id={data[i].id} showTags={true} tagsHandler={tagsHandler} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)}  date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug}/>);
            }
            return(<div className="table-cards-container">
              {table}
            </div>);
          }
        }, [tagsHandler])

  

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

        

          const getData = useCallback((data, clear = true) => {
            setRegion(data);
            fetch('https://diplomchuma-production.up.railway.app/region/:'+data).then((res) => res.json()).then((data) => {
              SetCities(data.cities);
              if (clear)
                SetCity("");
            });
            navigate(`/search?region=${data}&advertisement=${advertisement}${parameters === '' ? '' : '&'}${parameters}&realty=${realty}&${filterValue}${filterValue !== ''? "&" : ''}sort=${sortType}&page=${1}`)
          }, [advertisement, filterValue, navigate, parameters, realty, sortType])

          const getArea = useCallback((data) => {
            SetCity(data);
            navigate(`/search?region=${region}&city=${data}&advertisement=${advertisement}${parameters === '' ? '' : '&'}${parameters}&realty=${realty}&${filterValue}${filterValue !== ''? "&" : ''}sort=${sortType}&page=${1}`)
          }, [advertisement, filterValue, navigate, parameters, realty, sortType, region])

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
            let params = []
            if (priceMin !== '' || priceMax !== '')
              params.push(`currency=${currency}`);
            if (priceMin !== '') 
              params.push(`pricemin=${priceMin}`);
            if (priceMax !== '') 
              params.push(`pricemax=${priceMax}`);
            if (squareMin !== '') 
              params.push(`squaremin=${squareMin}`);
            if (squareMax !== '')
              params.push(`squaremax=${squareMax}`);
            if (unit !== '')
              params.push(`unit=${unit}`);
            if (rooms !== '')
              params.push(`rooms=${rooms}`);
            let paramsVal = params.join('&');
            setParameters(params.join('&'))
            navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=${advertisement}${paramsVal === '' ? '' : '&'}${paramsVal}&realty=${realty}&${value}${value !== ''? "&" : ''}sort=${sortType}&page=${1}`);
            setFilterValue(value);
            return value;
          }

          const sort = (sort) => {
            SetSort(sort);
            setActivePage(1);
            navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=${advertisement}${parameters === '' ? '' : '&'}${parameters}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sort}&page=${1}`);
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

          const realtySelectHandler = useCallback(async (type, params = '') =>{
            if (params === '' && type !== realty) setFilter({});
            if (params === '' && type !== realty) setFilterOptions([]);
            let data;
            setRealty(type);
            setActivePage(1);
            setParameters('')
            setPriceMax('')
            setPriceMin('')
            setSquareMax('')
            setSquareMin('')
            setUnit('')
            setCurrency('$')
            setRooms('')
            if (params === '') {
              navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=${advertisement}&realty=${type}&sort=${sortType}&page=${1}`);
            }
            
            switch(type){
              case 'Будинок':
              case 'Дача':
              case 'Частина будинку':
                data = await fetchHandler('https://diplomchuma-production.up.railway.app/house');
                setFilterOptions([
                  {
                    name: 'type',
                    text: 'Тип житла',
                    type: 0,
                    options: ['Всі варіанти', 'Новобудова', 'Вторинне']
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
                  filterDataHandler('type', 'Всі варіанти');
                  filterDataHandler('proposition', 'Всі варіанти');
                  filterDataHandler('map', 'Всі варіанти');
                  filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Квартира':
                data = await fetchHandler('https://diplomchuma-production.up.railway.app/house');
                setFilterOptions([
                {
                  name: 'type',
                  text: 'Тип житла',
                  type: 0,
                  options: ['Всі варіанти', 'Новобудова', 'Вторинне']
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
                filterDataHandler('type', 'Всі варіанти');
                filterDataHandler('proposition', 'Всі варіанти');
                filterDataHandler('map', 'Всі варіанти');
                filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Гараж':
                data = await fetchHandler('https://diplomchuma-production.up.railway.app/garage');
                setFilterOptions([
                  {
                    name: 'type',
                    text: 'Тип гаража',
                    type: 0,
                    options: ['Всі варіанти', 'Окремий гараж', 'Місце в кооперативі']
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
                  filterDataHandler('type', 'Всі варіанти');
                  filterDataHandler('proposition', 'Всі варіанти');
                  filterDataHandler('map', 'Всі варіанти');
                  filterDataHandler('auction', 'Всі варіанти');
                break;
              case 'Ділянка':
                data = await fetchHandler('https://diplomchuma-production.up.railway.app/area');
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
          }, [advertisement, city, generalFilterProperties, navigate, realty, region, sortType])

          const pagesHandler = (activePage) => {
            setActivePage(activePage);
            navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=${advertisement}${parameters === '' ? '' : '&'}${parameters}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sortType}&page=${activePage}`);
          }

          const advertisementHandler = (advertisement) =>{
            setAdvertisement(advertisement);
            setActivePage(1);
            navigate(`/search?${region === '' ? '' : `region=${region}&`}${city === '' ? '' : `city=${city}&`}advertisement=${advertisement}${parameters === '' ? '' : '&'}${parameters}&realty=${realty}&${filterValue === '' ? '' : filterValue+'&'}sort=${sortType}&page=${1}`);
          }

          
          useEffect(() => {
            let params = queryString.parse(location.search);
            if (JSON.stringify(params) === '{}') {
              setRegion('')
              SetCities('')
              SetCity('')
              setAdvertisement('Всі оголошення')
              setRealty('Вся нерухомість')
              setFilterOptions(generalFilterProperties)
            }
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
              if (region !== params.region && params.region) {
                getData(params.region, false)
              }
              else if (!params.region){
                setRegion('')
                SetCities('')
                SetCity('')
              }
              if (city !== params.city && params.city) {
                getArea(params.city)
              }
              if (params.pricemin) {
                setPriceMin(params.pricemin)
              }
              else {
                setPriceMin('')
              }
              if (params.pricemax) {
                setPriceMax(params.pricemax)
              }
              else {
                setPriceMax('')
              }
              if (params.currency){
                setCurrency(params.currency)
              }
              else {
                setCurrency('$')
              }
              if (params.squaremin) {
                setSquareMin(params.squaremin)
              }
              else {
                setSquareMin('')
              }
              if (params.squaremax) {
                setSquareMax(params.squaremax)
              }
              else {
                setSquareMax('')
              }
              if (params.unit){
                setUnit(params.unit)
              }
              else {
                setUnit('')
              }
              if (params.rooms){
                setRooms(params.rooms)
              }
              else {
                setRooms('')
              }
              delete params.sort;
              delete params.advertisement;
              delete params.realty;
              delete params.page;
              delete params.region;
              delete params.city;
              delete params.pricemin;
              delete params.pricemax;
              delete params.currency;
              delete params.rooms;
              delete params.squaremin;
              delete params.squaremax;
              delete params.unit;
              for (let parameter of Object.keys(params)) {
                filterDataHandler(parameter, params[parameter]);
              }
            }

            setItems(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
            setShowPages(false);
            let query = 'https://diplomchuma-production.up.railway.app'+location.pathname+location.search
            if (!query.includes('count=12')){
              query.includes('?') ? query += '&count=12' : query += '?count=12'
            }
              fetch(query).then((res) => res.json()).then((data) => {
              setData(data.realty);
              setPage(Math.ceil(data.count / 12));
              if(data.length === 0) {
                setItems(<NoResult/>);
              }
              else {
                setItems(createItems(data.realty, localStorage.getItem('card')));
                setShowPages(true);
              }
            });
          }, [location, advertisement, city, realty, region, getData, getArea, sortType, createItems, generalFilterProperties, realtySelectHandler]); 

        return (
          <div className="app-screen">
            <Header />
            <div className="container">
              <div className="select-container">
                <Select class="full" handleData={getData} placeholder="Оберіть область" name='region' list={regions} value={region}/>
                <Select class="full" handleData={getArea} placeholder="Оберіть місто" name='city' list={cities} value={city} />
                <Select class="full" handleData={advertisementHandler} placeholder="Тип оголошення" value={advertisement} name='realty' list={["Всі оголошення", "Продаж", "Оренда"]} />
                <Select class="full" handleData={realtySelectHandler} placeholder="Тип нерухомості" value={realty} name='realty' list={["Вся нерухомість", "Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}  />
              </div>
            
              <div className="select-options-container">
                <div className="select-container">
                  <div className="filter-inputs">
                    <span className="filt-text">Ціна</span>
                    <Input class='filt-input' price={true} value={priceMin} handleChange={setPriceMin} placeholder='Від'/>
                    <Input class='filt-input' price={true} value={priceMax} handleChange={setPriceMax} placeholder='До'/>
                    <Select class='currency-list' value={currency} handleData={setCurrency} list={['$', 'грн']}/>
                    <span className="filt-text">Площа</span>
                    <Input class='filt-input' value={squareMin} number={true} handleChange={setSquareMin} placeholder='Від'/>
                    <Input class='filt-input' value={squareMax} number={true} handleChange={setSquareMax} placeholder='До'/>
                    {realty === 'Ділянка' && <Select class='area-list' value={unit} handleData={setUnit} placeholder='Одиниця' list={['Сотка', 'Гектар', 'м²']}/>}
                    {(realty === 'Квартира' || realty === 'Будинок' || realty === 'Дача' || realty === 'Частина будинку' ) && 
                      <div className="filter-inputs">
                        <span className="filt-text">Кількість кімнат</span>
                        <Input class='filt-input' value={rooms} int={true} number={true} handleChange={setRooms} placeholder='Кімнат'/>
                      </div>
                    }
                    {realty === 'Гараж' && 
                      <div className="filter-inputs">
                        <span className="filt-text">Машиномісць</span>
                        <Input class='filt-input garage' value={rooms} int={true} number={true} handleChange={setRooms} placeholder='Машиномісць'/>
                      </div>
                    }
                  </div>
                </div>
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
             
              <div className="separator"></div>

              <div className="settings-container">
                <Select class={""} handleData={sort} placeholder="Тип сортування" value={sortType} name='realty' list={["Спочатку нові", "Найдорожчі", "Найдешевші"]} />
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
