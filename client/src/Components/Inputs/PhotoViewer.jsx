import React, {useState} from "react";

export default function PhotoViewer (props) {

    const[count, setCount] = useState(0);

    if (!props.images) {return};
    
    const clickHandler = (index) => {
        if (index < 0 || index > props.images.length-1) return;
        setCount(index);
        toggleClass(index);
    }

    let images = [];
    for (let i = 0 ; i < props.images.length; i++) {
        images.push(
            <div key={i} className={"small-photo " + (i === 0 ? "active" : "")} onClick={() => {clickHandler(i)}}>
                <div className="viewer-active"></div>
                <img className="viewer-photo small" src={"https://diplomchuma-production.up.railway.app/"+props.id+"/"+ props.images[i]} alt=''/>
            </div>
        );
         
    }

    const toggleClass = (index) => {
        let photos = document.getElementsByClassName('small-photo');
        for (let i = 0 ; i < photos.length; i++) {
            photos[i].classList.remove("active");
        }
        photos[index].classList.add("active");
      } 

    return (
        <div className="photo-viewer-container">
            <div className="navigate-container">
                <span className="navigate-arrow left" onClick={() => {clickHandler((count-1))}}></span>
                <div className="viewer-main-photo">
                    <img className="viewer-photo" src={"https://diplomchuma-production.up.railway.app/"+props.id+"/" + props.images[count]} alt='' />
                </div>
                <span className="navigate-arrow right" onClick={() => {clickHandler((count+1))}}></span>
            </div>
            <div className="photos-container">
                <div className="viewer-small-photos">
                    {images}
                </div>
            </div>
        </div>
    );
}