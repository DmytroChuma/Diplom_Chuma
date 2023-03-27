import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import MarkerIcon from "./MarkerIcon";

function MyComponent ({ saveMarkers }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
     // L.marker([lat, lng], { icon }).addTo(map);
      saveMarkers([lat, lng]);
      
    }
  });
  return null;
}

class MapElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: this.props.zoom,
      markers: this.props.position,
      center: this.props.center
    };
  }

  saveMarkers = (newMarkerCoords) => {
    this.setState({markers: newMarkerCoords});
    this.props.handlePosition(newMarkerCoords);
  };
  
  addMarker = (e) => {
    const {markers} = this.state
    markers.push(e.latlng)
    this.setState({markers})
  }


  render() {

    return (
      <div className="map">
        <MapContainer center={this.state.center} zoom={this.state.zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={MarkerIcon} position={this.state.markers}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <MyComponent saveMarkers={this.saveMarkers} />
        </MapContainer>
      </div>
    );
  }
}

export default MapElement;