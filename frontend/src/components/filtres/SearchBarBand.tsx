import { useEffect, useState } from "react";
import axios from "axios";
import type { Band } from "../../types/band";
import debounce from "lodash.debounce";

type SearchBarBandProps = {
    onResults: (bands: Band[]) => void;
};

export default function SearchBarBand({ onResults }: SearchBarBandProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchSuggestions = async () => {
            const API_URL = import.meta.env.VITE_API_URL;

            if (query.length < 2) {
                try {
                    const res = await axios.get(`${API_URL}/bands`);
                    onResults(res.data);
                    return;
                } catch (error) {
                    console.error("Erreur chargement groupes :", error);
                }
            }

            try {
                const { data } = await axios.get(`${API_URL}/bands/search?query=${query}`);
                onResults(data);
            } catch (error) {
                console.error("Erreur recherche groupes :", error);
            }
        };

        const delayedFetch = debounce(() => {
            fetchSuggestions();
        }, 100);

        delayedFetch();

        return () => delayedFetch.cancel();
    }, [query, onResults]);


    return (
        <div className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un groupe..."
                className="w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
