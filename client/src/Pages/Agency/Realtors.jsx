import React, { useEffect, useState } from "react";
import RealtorCard from "../../Components/Cards/RealtorCard";
import Invite from "../../Components/Dialogs/Invite";
import NoResult from "../../Components/NoResult";

export default function Realtors ({ id, user, dialog, socket}) {
    const [load, setLoad] = useState(true)
    const [noRes, setNoRes] = useState(false);
    const [modal, setModal] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('')

    useEffect(() => {
        
        fetch(`/get_realtors?agency=${id}`).then((res) => res.json()).then((data)=>{
            if (data.length > 0) {
                setData(data)
                setLoad(false)
                setNoRes(false)
            }
            if (data.length === 0) {
                setLoad(false)
                setNoRes(true)
            }
            else if (data.length === 1) {
                console.log(user.id)
                if (data[0].id === user.id) {
                    setLoad(false)
                    setNoRes(true)
                }
            }
        })
        fetch(`/get_agency_info?id=${id}`).then((res) => res.json()).then((data) => {
            setName(data.name);
        })
    }, [id, user])

    const clickHandler = () => {
        setModal(<Invite dialog={dialog} modalHandle={setModal} socket={socket} agency={id} name={name}/>)
    }

    document.title = 'Рієлтори агентства';

    //if (!user) return

    return (
        <div className="realtors-agency-container">
            {modal}
            {user.permission === 2 && 
                <button className="btn" onClick={clickHandler}>Запросити</button>
            }
            {noRes && <NoResult text="Рієлторів немає" realtors={true} />}
            {load && <div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>}
            {data.length > 0 &&
                data.map((element, index) => {
                    if (user.id === element.id && user.permission !== 0) return
                    return (
                        <RealtorCard key={index} realtor={element}/>
                    )
                })
            }
        </div>
    )
}