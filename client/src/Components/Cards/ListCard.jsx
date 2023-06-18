import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ListCard (props) {

    const [select, setSelect] = useState(props.select);

    if (!props.images) {return};
    let images = [];
    for (let i = 1; i < props.images.length && i < 4; i++) {
        images.push(<div key={i} className="small-image-box">
            <img className="small-image" alt="" src={"https://house-f621.onrender.com/"+props.slug+"/"+props.images[i]}/>
            {(i === 3 && props.images.length > 4) &&
                <div className="photo-count-info">+ {props.images.length - 4} Фото</div>
            }
        </div>);
    }

    let tags = [];
    for(let i = 0; i < props.tags.length && i < 3; i++){
        if (props.tags[i] === "") continue;
        tags.push(<button key={i} className="tag" onClick={() => props.tagsHandler(props.tags[i])}>{props.tags[i].text}</button>);
    } 

    const selectClick = () => {
        props.selectHandler(props.id);
        setSelect((prev) => !prev)
    }

    return (
        <div className="ListCard">
            <div className="list-images-container">
                <div className="list-preview-container">
                    <Link to={'/advertisement/'+ props.slug}>
                        <img className="list-preview" src={"https://house-f621.onrender.com/"+props.slug+"/"+props.images[0]} alt=""/>
                    </Link>
                </div>
                {props.images.length > 2 && 
                    <div className="small-images-container">
                        {images}
                    </div>
                }
            </div>
            <div className="list-info-container">
                <div className="list-container">
                    <Link className="list-street link" to={'/advertisement/'+ props.slug}>{props.street + ", " + props.city}</Link>
                    <div className={"list-heart " + (select ? 'heart' : '')} onClick={selectClick}>
                        <div className={"list-heart-text"}>{select ? 'Видалити' : 'В обрані'}</div>
                    </div>
                </div>
                {props.showTags && <div className="list-tags-container">{tags}</div>}
                <div className="list-price-container">
                    <div className="list-price">{props.price.toLocaleString('ua')} $</div>
                    •
                    <div className="list-price-ua">{props.priceinua.toLocaleString('ua')} грн.</div>
                </div>
                <div className="list-info">{props.square}</div>
                <div className="list-info">{props.description.length > 100 ? props.description.substring(0, 100) + "..." : props.description}</div>
                <div className="list-date">Оголошення опубліковано: {props.date}</div>
            </div>
        </div>
    )
}