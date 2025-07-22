import Map, { Marker } from "react-map-gl";
import type { ViewState } from "react-map-gl";
import type { Event } from "../types/event";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  events: Event[];
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
  userLocation: { latitude: number; longitude: number } | null;
  onEventSelect: (event: Event) => void;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const franceBounds: [[number, number], [number, number]] = [
  [-4.8, 42.0],
  [9.3, 51.1],
];

export default function MapComponent({
  events,
  viewState,
  setViewState,
  userLocation,
  onEventSelect,
}: MapComponentProps) {
  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        maxBounds={franceBounds}
      >
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="bottom"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
          </Marker>
        )}

        {events
          .filter(
            (event) =>
              typeof event.owner?.longitude === "number" &&
              typeof event.owner?.latitude === "number"
          )
          .map((event) => (
            <Marker
              key={event.id_event}
              longitude={event.owner!.longitude}
              latitude={event.owner!.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onEventSelect(event);
              }}
            >
              <div className="flex flex-col items-center space-y-1 group">
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden cursor-pointer transform transition-transform group-hover:scale-110"
                  title={event.titre}
                >
                  <img
                    src={event.image_url}
                    alt={event.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white text-xs text-gray-800 px-2 py-1 rounded-md shadow group-hover:bg-gray-100 whitespace-nowrap max-w-[100px] text-center truncate">
                  {event.titre}
                </div>
              </div>
            </Marker>
          ))}
      </Map>
    </div>
  );
}
