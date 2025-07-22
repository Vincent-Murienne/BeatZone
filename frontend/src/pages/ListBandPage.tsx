import { useEffect, useState } from "react";
import axios from "axios";
import type { Band } from "../types/band";
import BandCard from "../components/BandCard";
import SearchBarBand from "../components/filtres/SearchBarBand";
import GenreMusicalFilter from "../components/filtres/GenreMusicalFilter";

export default function ListBandPage() {
    const [allBands, setAllBands] = useState<Band[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [searchResults, setSearchResults] = useState<Band[]>([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

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

    // Applique le filtre de genre sur les résultats de recherche
    useEffect(() => {
        const bandsToFilter = isSearchActive ? searchResults : allBands;
        
        const filtered = bandsToFilter.filter((band) => {
            const genres = band.avoir?.map((a) => a.genre?.type_musique) || [];
            const matchGenre = selectedGenre === "all" || genres.includes(selectedGenre);
            return matchGenre;
        });

        setBands(filtered);
    }, [selectedGenre, searchResults, allBands, isSearchActive]);

    if (loading) return <p className="text-center mt-10">Chargement...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center mb-6">
                <SearchBarBand 
                    allBands={allBands}
                    onResults={(results) => {
                        setSearchResults(results);
                        setIsSearchActive(results.length !== allBands.length);
                    }} 
                />
                <GenreMusicalFilter
                    value={selectedGenre}
                    genres={allGenres}
                    onChange={setSelectedGenre}
                />
            </div>

            {bands.length > 0 ? (
                <BandCard bands={bands} />
            ) : (
                <p className="text-center mt-10">Aucun groupe trouvé.</p>
            )}
        </div>
    );
}