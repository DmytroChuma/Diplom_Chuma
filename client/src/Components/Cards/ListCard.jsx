import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ListCard extends Component {

    render () {

        if (!this.props.images) {return};

        let images = [];
        for (let i = 1; i < this.props.images.length && i < 4; i++) {
        
            images.push(<div key={i} className="small-image-box">
                <img className="small-image" alt="" src={"http://localhost:3001/"+this.props.slug+"/"+this.props.images[i]}/>
                {(i === 3 && this.props.images.length > 3) &&
                    <div className="photo-count-info">+ {this.props.images.length - 4} Фото</div>
                }
            </div>);
        }

        let tags = [];
        for(let i = 0; i < this.props.tags.length && i < 3; i++){
            if (this.props.tags[i] === "") continue;
            tags.push(<button key={i} className="tag">{this.props.tags[i]}</button>);
        }  

        return (
            <div className="ListCard">
                <div className="list-images-container">
                    <div className="list-preview-container">
                        <img className="list-preview" src={"http://localhost:3001/"+this.props.slug+"/"+this.props.images[0]} alt=""/>
                    </div>
                    {this.props.images.length > 2 && 
                        <div className="small-images-container">
                            {images}
                        </div>
                    }
                </div>
                <div className="list-info-container">
                    <div className="list-container">
                        <Link className="list-street link" to={'/advertisement/'+ this.props.slug}>{this.props.street + ", " + this.props.city}</Link>
                        <div className="list-heart">
                            <div className="list-heart-text">В обрані</div>
                        </div>
                    </div>
                    <div className="list-tags-container">{tags}</div>
                    <div className="list-price-container">
                        <div className="list-price">{this.props.price.toLocaleString('ua')} $</div>
                        •
                        <div className="list-price-ua">{this.props.priceinua.toLocaleString('ua')} грн.</div>
                    </div>
                    <div className="list-info">{this.props.square}</div>
                    <div className="list-info">{this.props.description.length > 100 ? this.props.description.substring(0, 100) + "..." : this.props.description}</div>
                    <div className="list-date">Оголошення опубліковано: {this.props.date}</div>
                </div>
            </div>
        )
    }
}