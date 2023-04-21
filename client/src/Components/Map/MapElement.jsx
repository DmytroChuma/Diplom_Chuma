import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import MarkerIcon from "./MarkerIcon";

function MyComponent ({ saveMarkers }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
    }
  });
  return null;
}

class MapElement extends React.Component {

  saveMarkers = (newMarkerCoords) => {
    if (this.props.marker){
      this.props.handlePosition(newMarkerCoords);
      this.props.mapHandler(true);
    }
  };

  render() {

    return (
      <div className="map">
        <MapContainer center={this.props.center} zoom={this.props.zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={MarkerIcon} position={this.props.position}>
          </Marker>
          <MyComponent saveMarkers={this.saveMarkers} />
        </MapContainer>
      </div>
    );
  }
}

export default MapElement;