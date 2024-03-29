import React from "react";
import { Link } from "react-router-dom";

export default function AgencyCard (props) {
    return (
        <Link className="agency-card" to={`/agency/${props.id}/agency`}>
            <div className="agency-card-container">
                <img className="agency-card-img" src={props.logo === '' ? 'https://house-f621.onrender.com/images/default.png' : `https://house-f621.onrender.com/images/agency/${props.logo}`} alt=''/>
                <div className="agency-card-info-container">
                    <span className="agency-card-name">{props.name}</span>
                    <span className="agency-card-info">{props.region}</span>
                    <span className="agency-card-info">{props.city}</span>
                </div>
            </div>
            <div className="separator"></div>
            <span className="agency-card-text">{props.description}</span>
        </Link>
    )
}