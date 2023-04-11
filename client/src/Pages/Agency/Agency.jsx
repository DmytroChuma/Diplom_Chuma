import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import store from "../../Store/Store";
import Header from "../../Components/Header/Header";
import AddAgency from "./AddAgency";
import AgencyInfo from "./AgencyInfo";
import NotFoundPage from "../NotFoundPage";
import Advertisements from "./Advertisements";
import Realtors  from "./Realtors";


export default function Agency() {

    const [owner, setOwner] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState('');
    const [user, setUser] = useState('')

    const location = useLocation();

    let slug = location.pathname.split('/');
    slug = slug[slug.length - 1];
    let id = location.pathname.split('/')[2];
    let page; 

    store.subscribe(() => {
        if (store.getState().user.permission === 2 && store.getState().user.agency.toString() === id) {
            setOwner(true)
            setUser(store.getState().user)
        }
    })

    useEffect(() => {
        if (store.getState()) {
            if (store.getState().user.permission === 2 && store.getState().user.agency.toString() === id) {
                setOwner(true)
                setUser(store.getState().user)
            }
        }
        fetch(`/get_agency_info?id=${id}`).then((res) => res.json()).then((data) => {
            setData(data);
            if (!data) {
                setError(true)
            }
        })
    }, [])

        switch(slug) {
            case 'settings':
                page = <AddAgency text='Налаштування агенства'/>
                break;
            case 'realtors':
                page = <Realtors id={id} user={user}/>
                break;
            case 'advertisements':
                page = <Advertisements id={id}/>
                break;
            default:
                page = <AgencyInfo data={data} />
                break;
        }

    return(
        <div>
            {!error &&
                <div className="app-screen">
                <Header />
                <div className='container cabinet'>
                    <div className='cabinet-menu'>
                        <Link className={'cabinet-item agency ' + (slug === 'agency' ? 'active-i-c' : '')}  to={`/agency/${id}/agency`}>
                            Агентство
                        </Link>
                        <Link className={'cabinet-item realtors ' + (slug === 'realtors' ? 'active-i-c' : '')}  to={`/agency/${id}/realtors`}>
                            Рієлтори
                        </Link>
                        <Link className={'cabinet-item my-advertisements ' + (slug === 'advertisements' ? 'active-i-c' : '')}  to={`/agency/${id}/advertisements`}>
                            Оголошення
                        </Link>
                        {owner && 
                            <Link className={'cabinet-item settings ' + (slug === 'settings' ? 'active-i-c' : '')} to={`/agency/${id}/settings`}>
                                Налаштування
                            </Link>
                        }
                    </div>
                    <div className='cabinet-info-container'>
                        {page}
                    </div>
                </div>
                </div>
            }
            {error &&
                <>
                   <NotFoundPage/>
                </>
            }
        </div>
    )
}