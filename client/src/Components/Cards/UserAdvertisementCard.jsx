import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserAdvertisementCard (props) {

    const archiveHandler = () => {
        fetch('/archive', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({slug: props.slug})
          }).then(response => {
            response.json().then(json => {
                props.handleLoad(json.success, 'Оголошення додано до архіву', document.getElementsByClassName("user-advertisement-card").length);
            });
          });
    }

    const showHandler = () => {
        fetch('/show', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({slug: props.slug})
        }).then(response => {
            response.json().then(json => {
                props.handleLoad(json.success, 'Оголошення опубліковано', document.getElementsByClassName("user-advertisement-card").length);
            });
          });
    }

   const deleteHandler = () => {
        fetch('/delete_post', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({slug: props.slug})
        }).then(response => {
            response.json().then(json => {
                props.handleLoad(json.success, 'Оголошення видалено', document.getElementsByClassName("user-advertisement-card").length);
            });
        });
   }


    return (
        <div className={'user-advertisement-card ' + (props.link ? 'hover' : '')}>
           
            <div className="card-info">
                <div className="userA-img">
                    <img className="userA-card-photo" src={"http://localhost:3001/"+ props.slug +"/"+ props.images[0]} alt='' />
                </div>
                <div className="user-advertisement-card-info">
                    {props.link &&
                        <Link className="list-street link" to={'/advertisement/'+ props.slug}></Link>
                    }
                    <div className="list-street">{props.street + ", " + props.city}</div>
                    <div className="list-price-container">
                        <div className="list-price">{props.price.toLocaleString('ua')} $</div>
                        •
                        <div className="list-price-ua">{props.priceinua.toLocaleString('ua')} грн.</div>
                    </div>
                    <div className="list-info">{props.square}</div>
                    <div className="list-info">{props.description.length > 100 ? props.description.substring(0, 100) + "..." : props.description}</div>
                    <div className="u-list-date">Оголошення опубліковано: {props.date}</div>
                </div>
            </div>
            {props.info && 
                <div className="card-information">
                    <span className="card-information views">{props.info.views}</span>
                    <span className="card-information phones">{props.info.phone}</span>
                    <span className="card-information select">{props.info.select}</span>
                </div>
            }
            {props.setting &&
            <div className="card-settings">
                {props.check}
                <div className="card-buttons">
                    {!props.archive &&
                        <Link className="btn edit" to={'/edit-advertisement /'+props.slug} >Редагувати</Link>
                    }
                    {props.archive && 
                        <button onClick={showHandler} className="btn publicate">Опублікувати</button>
                    }
                    {!props.archive && 
                        <button onClick={archiveHandler} className="btn archive">В архів</button>
                    }
                    <button onClick={deleteHandler} className="btn delete">Видалити</button>
                </div>
            </div>
            }
        </div>
    );
}