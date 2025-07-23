import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native";

export interface Suggestion {
    id: string;
    place_name: string;
}

interface SearchBarEventMobileProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onSelectSuggestion: (s: Suggestion) => void;
    apiUrl: string;
}

export default function SearchBarEventMobile({
    searchTerm,
    setSearchTerm,
    onSelectSuggestion,
    apiUrl,
}: SearchBarEventMobileProps) {
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
        <View className="relative bg-white rounded-lg shadow-md w-full mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
            <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Adresse, ville ou code postal..."
            value={searchTerm}
            onChangeText={(text) => {
                setSearchTerm(text);
                setHasSelectedSuggestion(false);
            }}
            onSubmitEditing={() => {
                if (suggestions.length > 0) {
                handleSelect(suggestions[0]);
                }
            }}
            placeholderTextColor="#9CA3AF"
            />
            {searchTerm !== "" && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
                <Text className="text-gray-500 text-xl ml-2">×</Text>
            </TouchableOpacity>
            )}
        </View>

        {suggestions.length > 0 && (
            <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md max-h-60"
            renderItem={({ item }) => (
                <TouchableOpacity
                className="px-4 py-2 flex-row items-center gap-2 hover:bg-gray-100"
                onPress={() => handleSelect(item)}
                >
                <Text className="mr-2">📍</Text>
                <Text>{item.place_name}</Text>
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            />
        )}

        {searchTerm.length >= 2 &&
            suggestions.length === 0 &&
            !isSearching &&
            !hasSelectedSuggestion && (
            <View className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-md px-4 py-2">
                <Text className="text-sm text-center text-gray-500">
                Aucun résultat trouvé
                </Text>
            </View>
            )}
        </View>
    );
}
