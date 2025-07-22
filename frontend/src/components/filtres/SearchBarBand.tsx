import { useEffect, useState } from "react";
import type { Band } from "../../types/band";
import debounce from "lodash.debounce";

type SearchBarBandProps = {
    allBands: Band[];
    onResults: (bands: Band[]) => void;
    onQueryChange?: (query: string) => void;
};

export default function SearchBarBand({ allBands, onResults, onQueryChange }: SearchBarBandProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const filterBands = () => {
            if (query.length < 2) {
                onResults(allBands);
                return;
            }

            const filtered = allBands.filter(band => 
                band.nom.toLowerCase().includes(query.toLowerCase()) ||
                band.description?.toLowerCase().includes(query.toLowerCase()) ||
                band.avoir?.some(a => 
                    a.genre?.type_musique.toLowerCase().includes(query.toLowerCase())
                )
            );
            
            onResults(filtered);
        };

        const delayedFilter = debounce(() => {
            filterBands();
            onQueryChange?.(query);
        }, 300);

        delayedFilter();

        return () => delayedFilter.cancel();
    }, [query, allBands, onResults, onQueryChange]);

    return (
        <div className="relative w-screen max-w-md">
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