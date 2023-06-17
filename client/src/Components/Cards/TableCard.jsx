import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TableCard (props) {

        const [select, setSelect] = useState(props.select);

        if (!props.images) {return};

        let tags = [];
        for(let i = 0; i <props.tags.length && i < 3; i++){
            if (props.tags[i] === "") continue;
            tags.push(<button key={i} className="tag" onClick={() => props.tagsHandler(props.tags[i])}>{props.tags[i].text}</button>);
        } 

        const selectClick = () => {
            props.selectHandler(props.id);
            setSelect((prev) => !prev)
        }

        return (
            <div className="tableCard">
                <Link className="table-card-image-container" to={'/advertisement/'+ props.slug}>
                    <img className="table-card-photo" src={"https://house-f621.onrender.com/"+ props.slug +"/"+props.images[0]} alt=""/>
                    {props.images.length > 1 &&
                        <div className="table-photo-count-info">+ {props.images.length - 1} Фото</div>
                    } 
                </Link>
                <div className="table-card-info-container">
                    <Link className="table-street link" to={'/advertisement/'+ props.slug}>{props.street + ", " + props.city}</Link>
                    {props.showTags && <div className="table-tags-container">{tags}</div>}
                    <div className="table-price-container">
                        <div className="table-price">{props.price.toLocaleString('ua')} $</div>
                        •
                        <div className="table-price-ua">{props.priceinua.toLocaleString('ua')} грн.</div>
                    </div>
                    <div className="table-info">{props.square}</div>
                    <div className="table-info">{props.description.length > 50 ? props.description.substring(0, 50) + "..." : props.description}</div>
                    <div className="table-date-container">
                        <div className="table-date">{props.date}</div>
                        {!props.hideHeart && <div className={"table-heart " + (select ? 'heart' : '')} onClick={selectClick}>
                            <div className="table-heart-text">{select ? 'Видалити' : 'В обрані'}</div>
                        </div>}
                    </div>
                </div>
            </div>
        )
    

}