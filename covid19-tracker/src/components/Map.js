import 'leaflet/dist/leaflet.css';
import "./Map.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../Utils/DataOnMap";

function Map({ countries, center, zoom, casesType }) {    
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map;