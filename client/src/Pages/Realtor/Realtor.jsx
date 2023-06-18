import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Header from "../../Components/Header/Header";
import Info from "./Info";
import Advertisements from "./Advertisements";
import NotFoundPage from "../NotFoundPage";

export default function Realtor () {

    const [data, setData] = useState('');
    const [error, setError] = useState(false);

    const location = useLocation();

    let slug = location.pathname.split('/');
    slug = slug[slug.length - 1];
    let id = location.pathname.split('/')[2];
    let page; 

    document.title = 'Інформація про рієлтора';

    useEffect(() => {
        fetch(`https://diplomchuma-production.up.railway.app/get_realtor_info?id=${id}`).then((res) => res.json()).then((data) => {
            setData(data[0]);
            if (data.length === 0) {
                setError(true)
            }
        })
    }, [id])

    switch(slug){
        case 'advertisements':
            page = <Advertisements id={id}/>
            break;
        default:
            page = <Info data={data} id={id}/>
            break;
    }

    return (
        <div>
            {!error &&
                <div className="app-screen">
                    <Header />
                    <div className='container cabinet'>
                        <div className='cabinet-menu'>
                            <Link className={'cabinet-item personally ' + (slug === 'realtor' ? 'active-i-c' : '')}  to={`/realtor/${id}/realtor`}>
                                Інформація про рієлтора
                            </Link>
                            <Link className={'cabinet-item my-advertisements ' + (slug === 'advertisements' ? 'active-i-c' : '')}  to={`/realtor/${id}/advertisements`}>
                                Оголошення рієлтора
                            </Link>
                        </div>
                        <div className='cabinet-info-container'>
                            {page}
                        </div>
                    </div>
                </div>
            }
            {error &&
                   <NotFoundPage/>
            }
        </div>
    )
}