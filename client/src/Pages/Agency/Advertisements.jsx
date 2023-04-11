import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string'

import UserAdvertisementCard from "../../Components/Cards/UserAdvertisementCard";
import Pages from "../../Components/Pages";

export default function Advertisements (props) {

    const [data, setData] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(0);
    const [showPages, setShowPages] = useState(false);
    const [activePage, setActivePage] = useState(1);

    const navigate = useNavigate();
    let location = useLocation();
    
    useEffect(() => {
        let params = queryString.parse(location.search);
        let page = activePage
        if (params.page) {
          setActivePage(params.page)
          page = params.page
        }

        setData(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>)
        setShowPages(false);
        fetch(`/search?agency=${props.id}&page=${page}`).then((res) => res.json()).then((data) => {
            setData(data.realty);
            setCount(data.count);
            setPage(Math.ceil(data.count / 5));
            setShowPages(true);
        })
    }, [location])

    const pagesHandler = (activePage) => {
        setActivePage(activePage);
        navigate(`/agency/${props.id}/advertisements?agency=${props.id}&page=${activePage}`);
    }
    
    return (
        <div className="agency-advertisement-container">
            {Array.isArray(data) && 
                <div>
                    <span className='span-count'>Кількість оголошень агентства: {count}</span>
                    <div className="separator"></div>
                </div>}
            {!Array.isArray(data) && data}
            {Array.isArray(data) && data.map((element, index) => {
                return (
                    <div key={index}>
                        <UserAdvertisementCard link={true} price={element.price} images={element.images} date={element.date} tags={element.tags} street={element.street} city={element.city} priceinua={element.priceinua} square={element.square} description={element.description} slug={element.slug}/>
                    </div>
                ) 
            })}
            {page > 1 && showPages && 
                <Pages pages={page} activePage={activePage} pageHandle={pagesHandler} />
              }
        </div>
    );
}