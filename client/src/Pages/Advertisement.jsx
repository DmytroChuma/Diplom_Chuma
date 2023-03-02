import React from "react";
import { useLocation } from "react-router-dom";

import PhotoViewer from "../Components/Inputs/PhotoViewer";
import MapElement from "../Components/Map/MapElement";

export default function Advertisement() {

    const [data, setData] = React.useState("");

    const location = useLocation();

  //  console.log(location);
    
    React.useEffect(() => {
            fetch(location.pathname)
            
              .then((res) => res.json())
              .then((data) => {setData(data);});
          }, [location.pathname]);
          if (!data) return;
    return (
        <div className="container">
            <PhotoViewer id={data[0].id} images={data[0].images}/>
            Advertisement <br></br>
           
            <MapElement />
        </div>
    )
}