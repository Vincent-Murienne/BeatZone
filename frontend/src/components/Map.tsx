import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import type { ViewState } from "react-map-gl";
import type { Event } from "../types/event";
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
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 999,
          width: 350,
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Rechercher une adresse, ville ou code postal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px 40px 12px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "white",
                color: "#000",
                fontSize: "14px",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />

            {/* Bouton de suppression */}
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                  padding: "4px",
                }}
              >
                ×
              </button>
            )}

            {/* Indicateur de chargement */}
            {isSearching && (
              <div
                style={{
                  position: "absolute",
                  right: "30px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                🔍
              </div>
            )}
          </div>

          {/* Suggestions améliorées */}
          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "white",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                maxHeight: "300px",
                overflowY: "auto",
                margin: 0,
                padding: 0,
                zIndex: 1000,
                border: "1px solid #e0e0e0",
                borderTop: "none",
                listStyle: "none",
              }}
            >
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{
                    padding: "12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {getSuggestionIcon(suggestion.place_type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#000",
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "1.2",
                      }}
                    >
                      {formatSuggestion(suggestion)}
                    </div>
                    <div
                      style={{
                        color: "#666",
                        fontSize: "12px",
                        marginTop: "2px",
                      }}
                    >
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Message si aucun résultat */}
          {searchTerm.length >= 2 &&
            suggestions.length === 0 &&
            !isSearching && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  background: "white",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "12px",
                  zIndex: 1000,
                  border: "1px solid #e0e0e0",
                  borderTop: "none",
                  color: "#666",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Aucun résultat trouvé
              </div>
            )}
        </div>
      </div>

      {/* Carte */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
        maxBounds={franceBounds}
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

        {selectedEvent && (
          <Popup
            longitude={selectedEvent.longitude}
            latitude={selectedEvent.latitude}
            anchor="top"
            onClose={() => setSelectedEvent(null)}
          >
            <div style={{ color: "#000" }}>
              <h3>{selectedEvent.titre}</h3>
              <p>{selectedEvent.description}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapBox;
