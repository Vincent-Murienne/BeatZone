import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBox = () => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Map
        initialViewState={{
          longitude: 2.3488,
          latitude: 48.8534,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={2.3488} latitude={48.8534} />
      </Map>
    </div>
  );
};

export default MapBox;
