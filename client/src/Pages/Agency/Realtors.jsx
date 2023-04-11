import React, { useEffect, useState } from "react";
import RealtorCard from "../../Components/Cards/RealtorCard";

export default function Realtors ({id, user}) {

    const [data, setData] = useState(<div className="loading"><div className="fa fa-spinner fa-pulse fa-3x fa-fw"></div>Завантаження</div>);

    useEffect(() => {
        fetch(`/get_realtors?agency=${id}`).then((res) => res.json()).then((data)=>{
            if (data.length > 0) {
                setData(data)
            }
        })
    }, [])

    return (
        <div className="realtors-agency-container">
            {Array.isArray(data) &&
                data.map((element, index) => {
                    if (user.id === element.id && user.permission === 2) return
                    return (
                        <RealtorCard key={index} realtor={element}/>
                    )
                })
            }
        </div>
    )
}