import React, { useEffect, useState } from "react";
import RealtorCard from "../../Components/Cards/RealtorCard";
import Invite from "../../Components/Dialogs/Invite";
import NoResult from "../../Components/NoResult";
import RealtorMenu from "./RealtorMenu";

export default function Realtors ({ id, user, dialog, socket}) {
    const [load, setLoad] = useState(true)
    const [noRes, setNoRes] = useState(false);
    const [modal, setModal] = useState('');
    const [data, setData] = useState([]);
    const [name, setName] = useState('')
    const [menu, setMenu] = useState('')

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

    const removeRealtor = (realtorId, name) => {
        let obj = {realtor: realtorId, agency: parseInt(id), name: name}
        socket.emit('del_realtor', obj)
        fetch('/del_realtor', 
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials : "include",
            mode: 'cors',
            body: JSON.stringify(obj)
        }
        ).then(res=>{if(res.status===200){return true}}).then(res=>{
            if (!res) return
            let newRealtorList = data.filter(element => element.id !== realtorId)
           
            if (newRealtorList.length === 1) setNoRes(true)
            setData(newRealtorList)
            socket.emit('message_body', {agency: parseInt(id), text: `Рієлтор ${name}, вийшов з агентства`})
        })
    }

    const realtorClick = (e, id, name) => {
        e.preventDefault()
        let x = e.clientX;
        let y = e.clientY;
        if (x > 1200) {
            x -= 250
        }
        if (y > 870) {
            y -= 50
        }
        setMenu(<RealtorMenu cX={x} cY={y} id={id} name={name} menu={setMenu} deleteHandler={removeRealtor} />)
    }

    useEffect(() => {
        const closeHandler = (e) => {
            if(!e.target.classList.contains('contex-menu') && !e.target.classList.contains('context-menu-item')){
            setMenu('');
            }
        }
  
        document.addEventListener("mouseup",(e) =>  closeHandler(e));
        return () => document.removeEventListener("mouseup",(e) => closeHandler(e));
    }, [])

    document.title = 'Рієлтори агентства';

    return (
        <div className="realtors-agency-container">
            {menu}
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
                        <RealtorCard key={index} realtor={element} owner={user.permission === 2 ? true : false} handleClick={realtorClick}/>
                    )
                })
            }
            {noRes}
        </div>
    )
}