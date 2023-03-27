import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class TableCard extends Component {

    render () {
        if (!this.props.images) {return};

        let tags = [];
        for(let i = 0; i < this.props.tags.length && i < 3; i++){
            if (this.props.tags[i] === "") continue;
            tags.push(<button key={i} className="tag">{this.props.tags[i]}</button>);
        } 

        return (
            <div className="tableCard">
                <div className="table-card-image-container">
                    <img className="table-card-photo" src={"http://localhost:3001/"+ this.props.slug +"/"+this.props.images[0]} alt=""/>
                    {this.props.images.length > 1 &&
                        <div className="table-photo-count-info">+ {this.props.images.length - 1} Фото</div>
                    }
                </div>
                <div className="table-card-info-container">
                    <Link className="table-street link" to={'/advertisement/'+ this.props.slug}>{this.props.street + ", " + this.props.city}</Link>
                    <div className="table-tags-container">{tags}</div>
                    <div className="table-price-container">
                        <div className="table-price">{this.props.price.toLocaleString('ua')} $</div>
                        •
                        <div className="table-price-ua">{this.props.priceinua.toLocaleString('ua')} грн.</div>
                    </div>
                    <div className="table-info">{this.props.square}</div>
                    <div className="table-info">{this.props.description.length > 50 ? this.props.description.substring(0, 50) + "..." : this.props.description}</div>
                    <div className="table-date-container">
                        <div className="table-date">{this.props.date}</div>
                        <div className="table-heart">
                            <div className="table-heart-text">В обрані</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}