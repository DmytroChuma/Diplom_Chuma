import React from "react";
import { Link } from "react-router-dom";

export default function AgencySmallCard (props) {
    return(
        <Link to={`/agency/${props.id}/agency`} className="agency-small">
            <img  className="agency-small-img" src={props.logo === '' ? 'http://192.168.0.105:3001/images/default.png' : `http://192.168.0.105:3001/images/agency/${props.logo}`} alt=''/>
            <span className="agency-small-name">{props.name}</span>
        </Link>
    )
}