import React, { useEffect, useState } from "react";
import { useNavigate, useLocation} from 'react-router-dom';
import queryString from 'query-string'

import Header from "../Components/Header/Header";
import ListCard from "../Components/Cards/ListCard";
import TableCard from "../Components/Cards/TableCard";
import NoResult from "../Components/NoResult";
import Pages from "../Components/Pages";

import handleSelect from "../Utils/HandleSelect";

export default function Select () {

    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState("");
    const [items, setItems] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
    const [page, setPage] = useState(1);
    const [showPages, setShowPages] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [select, setSelect] = useState(localStorage.getItem('select'))

    const selectHandler = (id) => {
        handleSelect(id);
        setSelect(localStorage.getItem('select'))
      }

      const getSelectHeart = (id) => {
        if (JSON.parse(localStorage.getItem('select')).includes(id)) {
          return true;
        }
        return false;
      }

     

    const createItems = (data, type) => {
        if(data.length === 0) {
          return(<NoResult text='Ви ще не додали жодного оголошення в обране'/>);
        }
        localStorage.setItem('card', type);
        if (type === "0") {
          let list = [];
          for (let i = 0 ; i < data.length; i++) {
            list.push(<ListCard key={i} id={data[i].id} showTags={false} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)} date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug} />);
          }
          return(<div className="list-cards-container">
            {list}
            </div>);
        }
        else {
          let table = [];
          for (let i = 0 ; i < data.length; i++) {
            table.push(<TableCard key={i} id={data[i].id} showTags={false} selectHandler={selectHandler} price={data[i].price} images={data[i] ? data[i].images : ""} select={getSelectHeart(data[i].id)}  date={data[i].date} tags={data[i].tags} street={data[i].street} city={data[i].city} priceinua={data[i].priceinua} square={data[i].square} description={data[i].description} slug={data[i].slug}/>);
          }
          return(<div className="table-cards-container">
            {table}
          </div>);
        }
      }

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

      const pagesHandler = (activePage) => {
        setActivePage(activePage);
        navigate(`/select?page=${activePage}`);
      }

      useEffect(() => {
       
        let params = queryString.parse(location.search);
        let page = activePage;
            if (params.page) {
                let size = JSON.parse(localStorage.getItem('select'))
                page = params.page
                if (Math.ceil(size.length/12) < page) {
                    page = Math.ceil(size.length/12);
                }
              setActivePage(page)
            }
        setItems(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
            setShowPages(false);
              fetch(`https://house-f621.onrender.com/search?count=12&page=${page}&select=${localStorage.getItem('select')}`).then((res) => res.json()).then((data) => {
              setData(data.realty);
              setPage(Math.ceil(data.count / 12 ));
              if(data.length === 0) {
                setItems(<NoResult text='Ви ще не додали жодного оголошення в обране'/>);
              }
              else {
                setItems(createItems(data.realty, localStorage.getItem('card')));
                setShowPages(true);
              }
            });
      }, [location, select])

    return (
        <div className="app-screen">
            <Header />
            <div className="container">
                <div className="settings-container">
                    <span className="span-select">Обрані пропозиції</span>
                    <div className="btn-check-container-select">
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