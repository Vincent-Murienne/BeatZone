import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import debounce from 'lodash.debounce';
import type { Band } from '../../types/band';

type SearchBarBandProps = {
    allBands: Band[];
    onResults: (bands: Band[]) => void;
    onQueryChange?: (query: string) => void;
};

export default function SearchBarBand({
    allBands,
    onResults,
    onQueryChange,
}: SearchBarBandProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const filterBands = () => {
        if (query.length < 2) {
            onResults(allBands);
            return;
        }

        const filtered = allBands.filter((band) =>
            band.nom.toLowerCase().includes(query.toLowerCase()) ||
            band.description?.toLowerCase().includes(query.toLowerCase()) ||
            band.avoir?.some((a) =>
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
        <View style={styles.container}>
        <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un groupe..."
            style={styles.input}
            placeholderTextColor="#999"
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
    },
});
