import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RealtorCard({realtor, ...props}) {

    const [open, setOpen] = useState(false);
    const [showHint, setShowHint] = useState(false)

    return (
        <div className="realtor-card" onContextMenu={(e) => props.handleClick(e, realtor.id, `${realtor.first_name} ${realtor.last_name}`)}>
            <div className="realtor-info">
                <div className="realtor-card-image">
                    <img className="realtor-avatar" src={`http://localhost:3001/users/${realtor.avatar === '' ? 'avatar.png' : realtor.avatar}`} alt=''/>
                </div>
                <div className="realtor-card-info">
                    <span className="realtor-card-name">{`${realtor.first_name} ${realtor.last_name}`}</span>
                    <div className="realtor-phone-container">
                        <span className="realtor-phone-number" onMouseLeave={() => setShowHint(false)} onMouseEnter={() => {!open ? setShowHint(true) : setShowHint(false)}} onClick={() => setOpen(true)}>{
                            open ? `(${realtor.phone.substring(0,3)}) ${realtor.phone.substring(3,6)} ${realtor.phone.substring(6)}` : `(${realtor.phone.substring(0,3)}) XXX XXXX`
                        }</span>
                        <span className="realtor-phone-number type">{showHint ? "Показати" : ''}</span>
                    </div>
                </div>
                <Link className="list-street link" to={`/realtor/${realtor.id}/realtor`}></Link>
            </div>
            <div className="separator"></div>
            <div className="realtor-card-description">
                <span>{realtor.description === '' ? 'Рієлтор не залишив опис про себе.' : realtor.description.length > 150 ? realtor.description.substring(0, 150) + "..." : realtor.description}</span>
            </div>
        </div>
    )
}