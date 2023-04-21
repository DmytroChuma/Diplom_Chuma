import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

export default function CabinetCard({children, link, linkText, clickHandler}) {

    return (
        <div className="info-cabinet-card">
            <div className="cabinet-card-body">
                {children}
            </div>
            <Link onClick={() => clickHandler()} className='card-info-link-btn' to={link}>{linkText}</Link>
        </div>
    )
}

CabinetCard.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element.isRequired
      ]),
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
}