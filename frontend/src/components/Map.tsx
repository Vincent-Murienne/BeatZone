import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import type { ViewState } from "react-map-gl";
import type { Event } from "../types/event";
import EventModal from "./EventModal";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  text: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

const MapBox = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 2.3488,
    latitude: 48.8534,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // Limites approximatives de la France métropolitaine
  const franceBounds: [[number, number], [number, number]] = [
    [-4.8, 42.0], // Sud-Ouest
    [9.3, 51.1], // Nord-Est
  ];

  // Chargement des événements
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:3000/api/events");
      const data = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    };
    fetchEvents();
  }, []);

  // Recherche améliorée dans l'API Mapbox avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Types de lieux à inclure : adresses, lieux, villes, codes postaux
      const types = "address,place,postcode,poi";

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchTerm
        )}.json?access_token=${MAPBOX_TOKEN}&limit=8&language=fr&country=fr&types=${types}&autocomplete=true`
      );

      const data = await res.json();

      if (data.features) {
        // Filtrer et trier les résultats par pertinence
        const filteredSuggestions = data.features
          .filter((feature: any) => {
            // Inclure tous les types de lieux pertinents
            return (
              feature.place_type.includes("address") ||
              feature.place_type.includes("place") ||
              feature.place_type.includes("postcode") ||
              feature.place_type.includes("poi")
            );
          })
          .sort((a: any, b: any) => {
            // Prioriser les adresses exactes
            if (
              a.place_type.includes("address") &&
              !b.place_type.includes("address")
            )
              return -1;
            if (
              !a.place_type.includes("address") &&
              b.place_type.includes("address")
            )
              return 1;
            return 0;
          });

        setSuggestions(filteredSuggestions);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Lorsqu'une suggestion est sélectionnée
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const [lng, lat] = suggestion.center;

    // Ajuster le zoom selon le type de lieu
    let zoomLevel = 13;
    if (suggestion.place_type.includes("address")) {
      zoomLevel = 16; // Plus de zoom pour une adresse précise
    } else if (suggestion.place_type.includes("postcode")) {
      zoomLevel = 14; // Zoom moyen pour un code postal
    } else if (suggestion.place_type.includes("place")) {
      zoomLevel = 12; // Moins de zoom pour une ville
    }

    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: zoomLevel,
    }));

    setSearchTerm(formatSuggestion(suggestion));
    setSuggestions([]);
  };

  // Formatage amélioré des suggestions
  const formatSuggestion = (suggestion: Suggestion) => {
    const parts = [];

    // Pour une adresse complète
    if (suggestion.place_type.includes("address")) {
      // L'adresse principale
      parts.push(suggestion.text);

      // Chercher le code postal et la ville dans le contexte
      if (suggestion.context) {
        let postcode = "";
        let city = "";

        suggestion.context.forEach((item) => {
          if (item.id.startsWith("postcode")) {
            postcode = item.text;
          } else if (item.id.startsWith("place")) {
            city = item.text;
          }
        });

        if (postcode) parts.push(postcode);
        if (city) parts.push(city);
      }

      return parts.join(", ");
    }

    // Pour un code postal
    if (suggestion.place_type.includes("postcode")) {
      parts.push(suggestion.text);

      if (suggestion.context) {
        const city = suggestion.context.find((item) =>
          item.id.startsWith("place")
        );
        if (city) parts.push(city.text);
      }

      return parts.join(" ");
    }

    // Pour une ville ou un lieu
    return suggestion.place_name;
  };

  // Obtenir une icône selon le type de lieu
  const getSuggestionIcon = (placeType: string[]) => {
    if (placeType.includes("address")) return "🎉";
    if (placeType.includes("postcode")) return "🎊";
    if (placeType.includes("place")) return "📍";
    if (placeType.includes("poi")) return "📍";
    return "📍";
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setFilteredEvents(events); // Réafficher tous les événements
  };

    return (
    <div className="h-screen w-screen relative">
      {/* Barre de recherche */}
      <div className="absolute top-5 left-5 z-50 w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une adresse, ville ou code postal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          />

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}

          {isSearching && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md z-50 max-h-80 overflow-y-auto">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <span>{getSuggestionIcon(s.place_type)}</span>
                  <span>{formatSuggestion(s)}</span>
                </li>
              ))}
            </ul>
          )}

          {searchTerm.length >= 2 && suggestions.length === 0 && !isSearching && (
            <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md z-50 px-4 py-2 text-sm text-center text-gray-500">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      </div>

      {/* Carte */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        className="w-full h-full"
        maxBounds={[[-4.8, 42.0], [9.3, 51.1]]}
      >
        {filteredEvents.map((event) => (
          <Marker
            key={event.id_event}
            longitude={event.longitude}
            latitude={event.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedEvent(event);
            }}
          >
            <img src={event.image_url} alt="marker" width={30} />
          </Marker>
        ))}
      </Map>

      {/* Modal événement */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default MapBox;
