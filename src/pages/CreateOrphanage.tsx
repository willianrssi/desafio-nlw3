import React, { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { FiPlus } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import "../styles/pages/create-orphanage.css";
import mapIcon from "../utils/mapIcon";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {
  const history = useHistory();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [centerPositionMap, setCenterPositionMap] = useState({
    latitude: -27.593782,
    longitude: -48.5344507,
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction);
    }
    function successFunction(position: Position) {
      console.log(position);
      const { latitude, longitude } = position.coords;
      setCenterPositionMap({ latitude, longitude });
    }
  }, []);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectefImages = Array.from(event.target.files);

    const selectedImagesPreview = selectefImages.map((image) => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
    setImages(selectefImages);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { latitude, longitude } = position;

    const data = new FormData();

    data.append("name", name);
    data.append("about", about);
    data.append("instructions", instructions);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach((image) => {
      data.append("images", image);
    });

    await api.post("orphanages", data);

    alert("Cadastro realizado com sucesso!");

    history.push("/app");

    console.log(
      name,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      latitude,
      longitude
    );
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[centerPositionMap.latitude, centerPositionMap.longitude]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                id="about"
                maxLength={300}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  return <img key={image} src={image} alt={image} />;
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                name=""
                id="image[]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                id="instructions"
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input
                value={opening_hours}
                onChange={(e) => setOpeningHours(e.target.value)}
                id="opening_hours"
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  onClick={() => setOpenOnWeekends(true)}
                  className={open_on_weekends ? "active" : ""}
                >
                  Sim
                </button>
                <button
                  onClick={() => setOpenOnWeekends(false)}
                  className={open_on_weekends ? "" : "active"}
                  type="button"
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
