import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import AgencyCard from "../Components/Cards/AgencyCard";
import Pages from "../Components/Pages";
import { useLocation, useNavigate } from "react-router";
import NoResult from "../Components/NoResult";
import queryString from "query-string";

export default function Agencies () {

    const [agencies, setAgencies] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>)
    const [page, setPage] = useState(0);
    const [showPages, setShowPages] = useState(false);
    const [activePage, setActivePage] = useState(1);

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let params = queryString.parse(location.search)
        let page = 1
        if (params.page) {
            page = params.page
            setActivePage(page)
        }

        setAgencies(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>)
        fetch(`https://diplomchuma-production.up.railway.app/getAgenciesInfo?page=${page}`).then(res=>res.json()).then(data=>{
            setAgencies(data.agencies)
            setPage(Math.ceil(data.count[0].count / 10));
            setShowPages(true)
        })
    },[activePage])

    const pagesHandler = (activePage) => {
        setActivePage(activePage);
        navigate(`/agencies?page=${activePage}`);
    }

    return(
        <div className="app-screen">
             <Header />
             <div className="container">
                {!Array.isArray(agencies) && agencies}
                {agencies.length === 0 && <NoResult text='Агентств нерухомості ще немає'/>}
                {Array.isArray(agencies) && agencies.map((element, index) => {
                    return (
                        <AgencyCard key={index} name={element.name} id={element.id} logo={element.logo} region={element.region} city={element.city} description={element.description}/>
                    )
                })}
                {page > 1 && showPages && 
                    <Pages pages={page} activePage={activePage} pageHandle={pagesHandler} />
                }
             </div>
        </div>
    )
}