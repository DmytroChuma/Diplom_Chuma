import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserAdvertisementCard from '../../Components/Cards/UserAdvertisementCard';
import CheckBox from '../../Components/Inputs/Checkbox';
import Select from '../../Components/Inputs/Select';
import queryString from 'query-string'

import NoResult from '../../Components/NoResult';
import store from '../../Store/Store';
import Pages from '../../Components/Pages';

export default function MyAdvertisements (props) {

    const [data, setData] = useState('');
    const [user, setUser] = useState(store.getState() ? store.getState().user : '');
    const [cards, setCards] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [showPages, setShowPages] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [option, setOption] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const check = [];
    const [checked, setCheck] = useState([]);
    const [all, setAll] = useState(false);

    store.subscribe(() => setUser(store.getState().user))
    document.title = 'Мої оголошення';

    const allClickHandle = () => {
        let checks = document.getElementsByName("card");
        for (let check of checks) {
            if (check.checked !== !all)
                check.click();
        }
        setAll(!all);
    }

    const handleChecks = (value) => {
        let checks = document.getElementsByName("card");

        let arr = check;
        let index = arr.indexOf(value);
        if (index !== -1) {
            arr.splice(index, 1);
            let all = document.getElementsByName("selectAll");
            all[0].checked = false;
            setAll(false);
        }
        else {
            arr.push(value);
            if (arr.length === checks.length) {
                let all = document.getElementsByName("selectAll");
                all[0].checked = true;
                setAll(true);
            }
        }
        setCheck([...arr]);
    }

    function loadItems (success, messageText, length) {
         
        let params = queryString.parse(location.search);
        let page = 1;
        if (params.page) {
            if (length === 1) {
                setActivePage(params.page - 1)
                page = params.page - 1
            }
            else {
                setActivePage(params.page)
                page = params.page
            }
        }

        let all = document.getElementsByName("selectAll");
        if (all[0]) {
            all[0].checked = false;
            setAll(false);
        }

        if (success === 1){
            props.dialog('Успіх', messageText, 1);
        }

        setCards(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
        setShowPages(false);
        fetch(`/search?user=${user.id}&page=${page}`).then((res) => res.json()).then((data) => {
            setData(data.realty);
            setCount(data.count);
            setPage(Math.ceil(data.count / 5));
            if(data.realty.length === 0) {
                setCards(<NoResult text='Ви ще не створили жодного оголошення!' />);
            }
            else {
                data = data.realty;
                let items = [];
                for (let i = 0 ; i < data.length; i++) {
                    let check = <CheckBox checkHandler={handleChecks} text='Обрати' name='card' value={data[i].slug} class='checkmark'/>
                    items.push(<UserAdvertisementCard handleLoad={loadItems} info={{views: data[i].views, phone: data[i].phones, select: data[i].select}} check={check} setting={true} key={i} price={data[i].price} images={data[i] ? data[i].images : ""} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug} />);  
                }
                setCards(items);
                setShowPages(true);
            }
          });
    }

    useEffect( () => {
 
        if (user === '') return;
        loadItems();
    }, [user, location]);

    const pagesHandler = (activePage) => {
        setActivePage(activePage);
        navigate(`/user/cabinet/advertisements?page=${activePage}`);
      }

      const optionHandle = (option) => {
        setOption(option);
      }

      const clickHandle = () => {
        if (option === '') {
            props.dialog('Помилка', 'Оберіть операцію');
            return;
        }
        if (checked.length === 0) {
            props.dialog('Помилка', 'Потрібно обрати оголошення');
            return;
        }

        fetch('/option', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({data: checked,
                                  option: option})
          }).then(response => {
            response.json().then(json => {
               loadItems(json.success, json.text);
            });
          });
      }

    return (
        <div className='my-advertisement'>
            {data.length > 0 && <div className='advetisements-info-operation'>
                <div className='advertisement-count'>Всього опублікованих оголошень: {count}</div>
                <div className='options'>
                    <CheckBox dataHandler={allClickHandle} text='Обрати всі' class='checkmark' name='selectAll'/>
                    <div className='option-container'>
                        <Select handleData={optionHandle} list={['Додати в архів', 'Видалити']} name='operation' placeholder='Операція'/>
                        <button onClick={clickHandle} className='btn'>Застосувати</button>
                    </div>
                </div>
                <div className='separator'></div>
            </div> }
            <div className='list-cards-container'>
                {cards}
            </div>
            {page > 1 && showPages && 
                <Pages pages={page} activePage={activePage} pageHandle={pagesHandler} />
              }
        </div>
    );
}