import React from "react";

import ListCard from "../Components/Cards/ListCard";
import TableCard from "../Components/Cards/TableCard";
import Select from "../Components/Inputs/Select";
import Filter from "../Components/Inputs/Filter";

export default function Search (){
    
        const [data, setData] = React.useState("");

        const [items, setItems] = React.useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);

        const [cities, SetCities] = React.useState("");

        const [city, SetCity] = React.useState("");

        const [sortType, SetSort] = React.useState("Спочатку нові");

        const regions = ["Вінницька область", "Волинська область", "Дніпропетровська область", 
        "Донецька область", "Житомирська область", "Закарпатська область", "Запорізька область", 
        "Івано-Франківська область", "Київська область", "Кіровоградська область", "Луганська область", 
        "Львівська область", "Миколаївська область", "Одеська область", "Полтавська область", 
        "Рівненська область", "Сумська область", "Тернопільська область", "Харківська область", 
        "Херсонська область", "Хмельницька область", "Черкаська область", "Чернівецька область", 
        "Чернігівська область", "АР Крим"];

 

        
        const createItems = (data, type) => {
          localStorage.setItem('card', type);
          if (type === "0") {
            let list = [];
            for (let i = 0 ; i < data.length; i++) {
              list.push(<ListCard key={i} id={data[i].id} price={data[i].price} images={data[i] ? data[i].images : ""} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug} />);
            }
          // localStorage.setItem('card', 0);
            return(<div className="list-cards-container">{list}</div>);
          }
          else {
            let table = [];
            for (let i = 0 ; i < data.length; i++) {
              table.push(<TableCard key={i} id={data[i].id} price={data[i].price} images={data[i] ? data[i].images : ""} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug}/>);
            }
         //   localStorage.setItem('card', 1);
            return(<div className="table-cards-container">{table}</div>);
          }
        }

  
          React.useEffect(() => {
            document.title = 'Пошук нерухомості';
            fetch('/search').then((res) => res.json()).then((data) => {
              setData(data);
              setItems(createItems(data, localStorage.getItem('card')));
            });
          }, []); 

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
            fetch('/region/:'+data).then((res) => res.json()).then((data) => {
              SetCities(data.cities);
              SetCity("");
            });
          }

          const getArea = (data) => {
            SetCity(data);
          }
         
          const sort = (sortType) => {
            setItems(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
            fetch('/search/:'+sortType).then((res) => res.json()).then((data) => {
              setData(data);
              SetSort(sortType);
              setItems(createItems(data, localStorage.getItem('card')));
            });
          }

        return (
            <div className="container">
              
              <div className="select-location-container">
                <Select class={"no-border"} handleData={getData} placeholder="Оберіть область" name='region' readonly={false} list={regions}/>
                <Select class={"no-border"} handleData={getArea} placeholder="Оберіть місто" name='city' readonly={false} list={cities} value={city} />
                <Select class={"no-border full"} placeholder="Введіть район" name='city' readonly={false} list={["Ужгород", "Львів"]}  />
              </div>
            
              <div className="select-options-container">
                <div className="select-container">
                  <Select class={""} placeholder="Тип оголошення" name='realty' readonly={true} list={["Всі оголошення", "Продаж", "Оренда"]} />
                  <Select class={""} placeholder="Тип нерухомості" name='realty' readonly={true} list={["Вся нерухомість", "Будинок", "Квартира", "Ділянка", "Гараж", "Дача", "Частина будинку"]}  />
                </div>

                {/*<Filter options={[
                  {
                    name: "houseType",
                    text: "Тип будинку",
                    type: 1,
                    options: ["Окремий будинок", "Таунхаус", "Дуплекс"]
                  },
                  {
                    name: "walls",
                    text: "Тип стін",
                    type: 1,
                    options: ["Цегла", "Дерево", "Дерево та цегла", "Монолітно-цегляний", "Панель", "Піноблок", "Пінобетон", "Зруб", "Брус", "Шлакобетон", "Шлакоблок", "Глинобитний", "Газобетон", "Метал", "Термоблок"]
                  },
                  {
                    name: "plan",
                    text: "Планування",
                    type: 1,
                    options: ["Чорнова штукатурка", "З меблями", "Без меблів", "Тераса"]
                  },
                  {
                    name: "heating",
                    text: "Опалення",
                    type: 1,
                    options: ["Без опалення", "Індивідуальне", "Централізоване", "Комбіноване"]
                  },
                  {
                    name: "",
                    text: "Переваги",
                    type: 1,
                    options: ["Ділянка", "Гараж", "Камін", "Балкон", "Сад", "Підвал", "Мансардний поверх"]
                  },
                  {
                    name: "auction",
                    text: "Торг",
                    type: 0,
                    options: ["Всі варіанти", "Торг можливий", "Торг не можливий"]
                  }
                  ]}/>*/}

              </div>
             
              <div className="separator"></div>

              <div className="settings-container">
                <Select class={""} handleData={sort} placeholder="Тип сортування" value={sortType} name='realty' readonly={true} list={["Спочатку нові", "Найдорожчі", "Найдешевші"]} />
                <div className="btn-check-container">
                  <button onClick={(e) => {toggleClass(e); setItems(createItems(data, "0"))}} className={"list-check btn-check " + (localStorage.getItem('card') === "0" ? "activate" : "")}></button>
                  <button onClick={(e) => {toggleClass(e); setItems(createItems(data, "1"))}} className={"table-check btn-check " + (localStorage.getItem('card') === "1" ? "activate" : "")}></button>
                </div>
              </div>
              
              {items}
            </div>
        )
}
//price={data.price} images={data} date={data.date}


/*

 <div className="table-cards-container">
                  {table}

                {  <TableCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
                  <TableCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
                  <TableCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
                  <TableCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
        <TableCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} /> }
        </div>
               
        <div className="list-cards-container">
          {list}

          {<ListCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
          <ListCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />
          <ListCard price={data.price} images={data ? data.images : ""} date={data.date} tags={data.tags} street={data.street} city={data.city} priceinua={data.priceinua} square={data.square} description={data.description} />}
        </div>

        */