import { useEffect, useState, useCallback } from "react";
import Map, { Marker } from "react-map-gl";
import type { ViewState } from "react-map-gl";
import type { Event } from "../types/event";
import "mapbox-gl/dist/mapbox-gl.css";
import PriceRangeFilter from "../components/PriceRangeFilter";

interface Suggestion {
  id: string;
  place_name: string;
  center?: [number, number];
  place_type: string[];
  text: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface MapBoxProps {
  onEventSelect?: (event: Event) => void;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;

const MapComponent = ({ onEventSelect }: MapBoxProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "current" | "upcoming">("all");
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);


  const [viewState, setViewState] = useState<ViewState>({
    longitude: 2.3488,
    latitude: 48.8534,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const franceBounds: [[number, number], [number, number]] = [
    [-4.8, 42.0],
    [9.3, 51.1],
  ];

  const formatSuggestion = (s: Suggestion) =>
    s.place_name || s.text;

    useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements :", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(`${API_URL}/genres`);
      if (res.ok) {
        const data = await res.json();
        setGenres(data);
      } else {
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  // Filtrage des événements selon date ET genre
  useEffect(() => {
    const now = new Date();

    const filtered = events.filter((event) => {
      const debut = new Date(event.debut);
      const fin = new Date(event.fin);
      const prix = Number(event.prix);

      // Filtre date
      const dateOk =
        dateFilter === "all" ||
        (dateFilter === "current" && debut <= now && now <= fin) ||
        (dateFilter === "upcoming" && now < debut);

      // Filtre genre
      const genreOk = selectedGenre === "all" || event.genre === selectedGenre;

      // Filtre prix
      const prixOk = prix >= priceRange[0] && prix <= priceRange[1];

      return dateOk && genreOk && prixOk;
    });

    setFilteredEvents(filtered);
  }, [events, dateFilter, selectedGenre, priceRange]);

  const fetchSuggestions = useCallback(async () => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`${API_URL}/suggestions`);
      const allSuggestions: string[] = await res.json();

      const filtered = allSuggestions
        .filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 10)
        .map((s) => ({
          id: s,
          place_name: s,
          text: s,
          center: undefined,
          place_type: ["custom"],
        }));

      setSuggestions(filtered);
    } catch (error) {
      console.error("Erreur suggestions locales :", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

const handlePriceRangeChange = (range: [number, number]) => {
  if (range[0] !== priceRange[0] || range[1] !== priceRange[1]) {
    setPriceRange(range);
  }
};

  useEffect(() => {
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSuggestions]);


const handleSelectSuggestion = (suggestion: Suggestion) => {
  const matchedEvent = events.find((event) => {
    const suggestionText = suggestion.place_name.toLowerCase();
    const suggestionParts = suggestionText.split(',').map(part => part.trim());
    const exactAddressMatch = suggestionParts[0] && event.adresse.toLowerCase() === suggestionParts[0];
    const exactCityMatch = suggestionParts.length > 1 && event.ville.toLowerCase() === suggestionParts[suggestionParts.length - 1];
    const exactPostalMatch = event.code_postal && suggestionParts.some(part => part === String(event.code_postal));
    const isExactMatch = exactAddressMatch && (exactCityMatch || exactPostalMatch);
    
    return isExactMatch;
  });

  if (matchedEvent) {
    // Zoom sur l'événement trouvé
    setViewState((prev) => ({
      ...prev,
      longitude: matchedEvent.longitude,
      latitude: matchedEvent.latitude,
      zoom: 15,
    }));
  } else {
    const suggestionParts = suggestion.place_name.split(',').map(part => part.trim());
    const cityName = suggestionParts[suggestionParts.length - 1];
    const eventsInCity = events.filter(event => 
      event.ville.toLowerCase().includes(cityName.toLowerCase())
    );
    
    if (eventsInCity.length > 0) {
      const avgLat = eventsInCity.reduce((sum, event) => sum + event.latitude, 0) / eventsInCity.length;
      const avgLng = eventsInCity.reduce((sum, event) => sum + event.longitude, 0) / eventsInCity.length;
      
      setViewState((prev) => ({
        ...prev,
        longitude: avgLng,
        latitude: avgLat,
        zoom: 13,
      }));
    }
  }

  setHasSelectedSuggestion(true);
  setSearchTerm(formatSuggestion(suggestion));
  setSuggestions([]);

};


  const getSuggestionIcon = () => "📍";

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setFilteredEvents(events);
    setHasSelectedSuggestion(false);
  };

  const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);

useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
          zoom: 13,
        }));

        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.warn("Permission refusée ou erreur de géolocalisation :", error);
      }
    );
  }
}, []); 

  return (
    <div className="h-screen w-screen relative">
      {/* Barre de recherche */}
      <div className="bg-white absolute top-5 left-5 z-50 w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Adresse, ville ou code postal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) {
                handleSelectSuggestion(suggestions[0]);
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          />

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              aria-label="Effacer la recherche"
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
                  <span>{getSuggestionIcon()}</span>
                  <span>{formatSuggestion(s)}</span>
                </li>
              ))}
            </ul>
          )}
          {searchTerm.length >= 2 && suggestions.length === 0 && !isSearching && !hasSelectedSuggestion && (
            <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md z-50 px-4 py-2 text-sm text-center text-gray-500">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      </div>
      {/* Filtres */}
      <div className="bg-white absolute top-5 right-5 z-50 p-3 rounded-lg shadow-lg space-y-3 w-64">
        {/* Filtre date */}
        <div>
          <label htmlFor="date-filter" className="sr-only">
            Filtrer par date
          </label>
          <select
            id="date-filter"
            onChange={(e) => setDateFilter(e.target.value as "all" | "current" | "upcoming")}
            value={dateFilter}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
            aria-label="Filtrer par date"
          >
            <option value="all">Tous les événements</option>
            <option value="current">En cours</option>
            <option value="upcoming">À venir</option>
          </select>
        </div>

        {/* Filtre genre */}
        <div>
          <label htmlFor="genre-filter" className="sr-only">
            Filtrer par genre
          </label>
          <select
            id="genre-filter"
            onChange={(e) => setSelectedGenre(e.target.value)}
            value={selectedGenre}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          >
            <option value="all">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre prix */}
        <div>
          <PriceRangeFilter onChange={handlePriceRangeChange} />
        </div>

      </div>
      {/* Carte */}
      <div className="w-full h-full">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
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
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" title="Vous êtes ici" />
            </Marker>
          )}
          {filteredEvents.map((event) => (
            <Marker
              key={event.id_event}
              longitude={event.longitude}
              latitude={event.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onEventSelect?.(event);
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
    </div>
  );
};

export default MapComponent;
