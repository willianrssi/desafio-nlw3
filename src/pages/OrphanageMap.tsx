import React, { useEffect, useState } from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import mapMarkerImg from "../images/map-marker.svg";
import api from "../services/api";
import "../styles/pages/orphanage-map.css";
import mapIcon from "../utils/mapIcon";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanageMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [centerPositionMap, setCenterPositionMap] = useState({
    latitude: -27.593782,
    longitude: -48.5344507,
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction);
    }
    function successFunction(position: Position) {
      const { latitude, longitude } = position.coords;
      setCenterPositionMap({ latitude, longitude });
    }

    api.get("orphanages").then((response) => {
      setOrphanages(response.data);
    });
  }, []);
  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy marker" />
          <h2> Escolha um orfanato no mapa </h2>
          <p>Muitas crianças estão esperando sua visita :)</p>
        </header>

        <footer>
          <strong>Florianópolis</strong>
          <span>Santa Catarina</span>
        </footer>
      </aside>
      <Map
        center={[centerPositionMap.latitude, centerPositionMap.longitude]}
        zoom={15}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        ></TileLayer>

        {orphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            position={[orphanage.latitude, orphanage.longitude]}
            icon={mapIcon}
          >
            <Popup
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className="map-popup"
            >
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight size={20} color="#FFF"></FiArrowRight>
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanageMap;
