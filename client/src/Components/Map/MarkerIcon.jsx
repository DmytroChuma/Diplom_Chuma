import L from 'leaflet';

import marker from '../../marker-icon.svg';

const MarkerIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
});

export default MarkerIcon;