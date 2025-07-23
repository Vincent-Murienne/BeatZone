import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import type { Band } from "../types/band";
import BandCard from "../components/BandCard";
import SearchBarBand from "../components/filtres/SearchBarBand";
import GenreMusicalFilter from "../components/filtres/GenreMusicalFilter";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ListBandScreen() {
    const [allBands, setAllBands] = useState<Band[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [searchResults, setSearchResults] = useState<Band[]>([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        const fetchBands = async () => {
        try {
            const res = await axios.get(`${API_URL}/bands`);
            setAllBands(res.data);
            setSearchResults(res.data);
            setBands(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des groupes :", error);
        } finally {
            setLoading(false);
        }
        };

        const fetchGenres = async () => {
        try {
            const res = await fetch(`${API_URL}/bands/genres`);
            const data = await res.json();
            setAllGenres(data);
        } catch {
            setAllGenres([]);
        }
        };

        fetchBands();
        fetchGenres();
    }, []);

    useEffect(() => {
        const bandsToFilter = isSearchActive ? searchResults : allBands;

        const filtered = bandsToFilter.filter((band) => {
        const genres = band.avoir?.map((a) => a.genre?.type_musique) || [];
        const matchGenre = selectedGenre === "all" || genres.includes(selectedGenre);
        return matchGenre;
        });

        setBands(filtered);
    }, [selectedGenre, searchResults, allBands, isSearchActive]);

    return (
        <View style={{ flex: 1 }}>
        <View style={styles.filterContainer}>
        <View style={{ marginBottom: 20 }}>
            <SearchBarBand
            allBands={allBands}
            onResults={(results) => {
                setSearchResults(results);
                setIsSearchActive(results.length !== allBands.length);
            }}
            />
        </View>
        <GenreMusicalFilter
            value={selectedGenre}
            genres={allGenres}
            onChange={setSelectedGenre}
        />
        </View>

        <FlatList
        data={bands}
        keyExtractor={(item) => item.id_band.toString()}
        renderItem={({ item }) => (
            <View style={{ width: 320, marginVertical: 8 }}>
            <BandCard bands={[item]} />
            </View>
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        style={{ marginTop: 140 }}
        />

        </View>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        zIndex: 9999,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listContent: {
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 20,
        alignItems: "center",
    },
});
