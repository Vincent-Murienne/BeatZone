import { useEffect, useState } from "react";

export interface Suggestion {
    id: string;
    place_name: string;
}

interface SearchBarEventProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onSelectSuggestion: (s: Suggestion) => void;
    apiUrl: string;
}

export default function SearchBarEvent({
    searchTerm,
    setSearchTerm,
    onSelectSuggestion,
    apiUrl,
}: SearchBarEventProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`${apiUrl}/events/suggestions`);
            const data: string[] = await res.json();
            const filtered = data
            .filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 10)
            .map((s) => ({ id: s, place_name: s }));
            setSuggestions(filtered);
        } catch (err) {
            console.error("Erreur de suggestions :", err);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
        };

        const timeout = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, apiUrl]);

    const handleSelect = (s: Suggestion) => {
        setSearchTerm(s.place_name);
        setSuggestions([]);
        setHasSelectedSuggestion(true);
        onSelectSuggestion(s);
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md">
            <input
                type="text"
                placeholder="Adresse, ville ou code postal..."
                value={searchTerm}
                onChange={(e) => {
                setSearchTerm(e.target.value);
                setHasSelectedSuggestion(false);
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions.length > 0) {
                    handleSelect(suggestions[0]);
                }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
            />

            {searchTerm && (
                <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                ×
                </button>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md z-50 max-h-80 overflow-y-auto">
                {suggestions.map((s) => (
                    <li
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                    <span>📍</span>
                    <span>{s.place_name}</span>
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
    );
}
