import { useEffect, useState } from "react";
import type { Event } from "../types/event";
import type { ViewState } from "react-map-gl";
import EventModal from "../components/EventModal";
import MapComponent from "../components/MapComponent";
import SearchBarEvent from "../components/filtres/SearchBarEvent";
import StatusEvenementFilter from "../components/filtres/StatusEvenementFilter";
import GenreMusicalFilter from "../components/filtres/GenreMusicalFilter";
import PriceRangeFilter from "../components/filtres/PriceRangeFilter";

const API_URL = import.meta.env.VITE_API_URL;

export default function MapPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [dateFilter, setDateFilter] = useState<"all" | "current" | "upcoming">("all");
    const [selectedGenre, setSelectedGenre] = useState<string>("all");
    const [genres, setGenres] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [viewState, setViewState] = useState<ViewState>({
        longitude: 2.3488,
        latitude: 48.8534,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
    });

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

        const fetchGenres = async () => {
        try {
            const res = await fetch(`${API_URL}/events/genres`);
            const data = await res.json();
            setGenres(data);
        } catch {
            setGenres([]);
        }
        };

        fetchEvents();
        fetchGenres();
    }, []);

    useEffect(() => {
        const now = new Date();
        const filtered = events.filter((event) => {
            const debut = new Date(event.debut);
            const fin = new Date(event.fin);
            const prix = Number(event.prix);
            const searchTerms = searchTerm.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

            const dateOk =
            dateFilter === "all" ||
            (dateFilter === "current" && debut <= now && now <= fin) ||
            (dateFilter === "upcoming" && now < debut);

            const genreOk =
                selectedGenre === "all" ||
                extractGenresFromEvent(event).includes(selectedGenre);
            const prixOk = prix >= priceRange[0] && prix <= priceRange[1];

            const searchOk =
            searchTerms.length === 0 ||
            searchTerms.some(term =>
                event.owner?.ville.toLowerCase().includes(term) ||
                event.owner?.adresse.toLowerCase().includes(term)
            );

            return dateOk && genreOk && prixOk && searchOk;
        });

        setFilteredEvents(filtered);
    }, [events, dateFilter, selectedGenre, priceRange, searchTerm]);


    useEffect(() => {
        if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 13 }));
            },
            (err) => console.warn("Géolocalisation refusée :", err)
        );
        }
    }, []);

    function handleSelectSuggestion(suggestion: { id: string; place_name: string }) {
        setSearchTerm(suggestion.place_name);
        // Trouver un événement qui correspond exactement à la suggestion (par adresse et ville)
        const suggestionText = suggestion.place_name.toLowerCase();
        const suggestionParts = suggestionText.split(",").map((part) => part.trim());

        // Recherche dans les événements chargés
        const matchedEvent = events.find((event) => {
            const exactAddressMatch = suggestionParts[0] && event.owner?.adresse.toLowerCase() === suggestionParts[0];
            const exactCityMatch =
            suggestionParts.length > 1 && event.owner?.ville.toLowerCase() === suggestionParts[suggestionParts.length - 1];
            return exactAddressMatch && exactCityMatch;
        });

        if (
            matchedEvent &&
            typeof matchedEvent.owner?.longitude === "number" &&
            typeof matchedEvent.owner?.latitude === "number"
        ) {
            setViewState((prev) => ({
                ...prev,
                longitude: matchedEvent.owner.longitude,
                latitude: matchedEvent.owner.latitude,
                zoom: 15,
            }));
        } else {
            // Sinon, recentrer sur la ville (dernier élément de la suggestion)
            const cityName = suggestion.place_name.split(",").pop()?.trim().toLowerCase() || "";
            const eventsInCity = events.filter((event) => event.owner?.ville.toLowerCase().includes(cityName));

            if (eventsInCity.length > 0) {
                const validEvents = eventsInCity.filter(
                    event =>
                        typeof event.owner?.latitude === "number" &&
                        typeof event.owner?.longitude === "number"
                );
                if (validEvents.length > 0) {
                    const avgLat =
                        validEvents.reduce((sum, event) => sum + (event.owner!.latitude as number), 0) / validEvents.length;
                    const avgLng =
                        validEvents.reduce((sum, event) => sum + (event.owner!.longitude as number), 0) / validEvents.length;

                    setViewState((prev) => ({
                        ...prev,
                        longitude: avgLng,
                        latitude: avgLat,
                        zoom: 13,
                    }));
                }
            }
        }
    }

    function extractGenresFromEvent(event: Event): string[] {
        const genres = new Set<string>();

        event.jouer?.forEach((passage) => {
            passage.band?.avoir?.forEach((a) => {
                const genre = a.genre?.type_musique;
                if (genre) genres.add(genre);
            });
        });

        return Array.from(genres);
    }

    return (
        <main className="relative h-screen w-screen">
            {/* Filtres et barre de recherche */}
            <div className="absolute top-5 left-5 z-50 w-80">
                <SearchBarEvent
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSelectSuggestion={handleSelectSuggestion}
                    apiUrl={API_URL}
                />
            </div>
            <div className="absolute top-5 right-5 z-50 w-64 p-3 bg-white rounded-lg shadow-lg space-y-3">
                <StatusEvenementFilter value={dateFilter} onChange={setDateFilter} />
                <GenreMusicalFilter value={selectedGenre} genres={genres} onChange={setSelectedGenre} />
                <PriceRangeFilter onChange={setPriceRange} />
            </div>

            {/* Carte interactive */}
            <MapComponent
                events={filteredEvents}
                viewState={viewState}
                setViewState={setViewState}
                userLocation={userLocation}
                onEventSelect={(event) => setSelectedEvent(event)}
            />

            {/* Modale de détail */}
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </main>
    );
}
