import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";

import MapComponent from "../components/MapComponent";
import EventModal from "../components/EventModal";
import type { Event } from "../types/event";
import type { Region } from "react-native-maps";
import { useNavigationState } from "@react-navigation/native";

import SearchBarEvent from "../components/filtres/SearchBarEvent";
import StatusEvenementFilter from "../components/filtres/StatusEvenementFilter";
import GenreMusicalFilter from "../components/filtres/GenreMusicalFilter";
import PriceRangeFilter from "../components/filtres/PriceRangeFilter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MapScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 48.8534,
    longitude: 2.3488,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "current" | "upcoming">("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 100]);
  const [genres, setGenres] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

    const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    if (currentRoute === 'EventDetails') {
      setSelectedEvent(null);
    }
  }, [currentRoute]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/eventsDate`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else {
          console.warn("Données invalides pour /events : attendu un tableau", data);
          setEvents([]); 
          setFilteredEvents([]);
        }
      } catch (e) {
        console.warn("Erreur fetch /events :", e);
        setEvents([]);
        setFilteredEvents([]);
      }

      try {
        const resGenres = await fetch(`${API_URL}/events/genres`);
        const dataGenres = await resGenres.json();
        setGenres(dataGenres);
      } catch {
        setGenres([]);
      }
    };
    fetchData();
  }, []);

  function filterEvents() {
    if (!Array.isArray(events)) return;
    const now = new Date();
    const filtered = events.filter((event) => {
      const debut = new Date(event.debut);
      const fin = new Date(event.fin);
      const prix = Number(event.prix);
      const searchTerms = searchTerm.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);

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
        searchTerms.some(
          (term) =>
            event.owner?.ville.toLowerCase().includes(term) ||
            event.owner?.adresse.toLowerCase().includes(term)
        );

      return dateOk && genreOk && prixOk && searchOk;
    });

    setFilteredEvents(filtered);
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

  function handleSelectSuggestion(suggestion: { id: string; place_name: string }) {
    setSearchTerm(suggestion.place_name);

    const suggestionText = suggestion.place_name.toLowerCase();
    const suggestionParts = suggestionText.split(",").map((p) => p.trim());

    const matchedEvent = events.find((event) => {
      const exactAddressMatch = suggestionParts[0] && event.owner?.adresse.toLowerCase() === suggestionParts[0];
      const exactCityMatch = suggestionParts.length > 1 && event.owner?.ville.toLowerCase() === suggestionParts[suggestionParts.length - 1];
      return exactAddressMatch && exactCityMatch;
    });

    if (matchedEvent && typeof matchedEvent.owner?.latitude === "number" && typeof matchedEvent.owner?.longitude === "number") {
      setRegion((prev) => ({
        ...prev,
        latitude: matchedEvent.owner.latitude,
        longitude: matchedEvent.owner.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }));
    }
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchBarContainer}>
        <SearchBarEvent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelectSuggestion={handleSelectSuggestion}
          apiUrl={API_URL || ""}
        />
      </View>

      {/* Bouton Filtrer */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filtrer</Text>
      </TouchableOpacity>

      {/* Modale fullscreen pour filtres */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filtres</Text>
          
          <View style={styles.modalContent}>
            <StatusEvenementFilter value={dateFilter} onChange={setDateFilter} />
            <GenreMusicalFilter value={selectedGenre} genres={genres} onChange={setSelectedGenre} />
            <PriceRangeFilter 
              onChange={setTempPriceRange} 
              defaultMin={priceRange[0]} 
              defaultMax={priceRange[1]} 
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                setPriceRange(tempPriceRange);
                filterEvents();
                setModalVisible(false);
              }}
            >
              <Text style={styles.searchButtonText}>Rechercher</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Carte */}
      <MapComponent
        events={filteredEvents}
        region={region}
        onRegionChange={setRegion}
        userLocation={userLocation}
        onEventSelect={setSelectedEvent}
      />

      {/* Modale détail */}
      {selectedEvent && (
        <EventModal event={selectedEvent} visible onClose={() => setSelectedEvent(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1100,
  },
  filterButton: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 1100,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    color: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalContent: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6B7280",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});