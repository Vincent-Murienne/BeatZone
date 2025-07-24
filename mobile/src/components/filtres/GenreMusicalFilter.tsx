import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface GenreMusicalFilterProps {
    value: string;
    genres: string[];
    onChange: (value: string) => void;
}

export default function GenreMusicalFilter({ value, genres, onChange }: GenreMusicalFilterProps) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(value);
    const [items, setItems] = useState([
        { label: 'Tous les genres', value: 'all' },
        ...genres.map(genre => ({ label: genre, value: genre }))
    ]);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        setItems([
            { label: 'Tous les genres', value: 'all' },
            ...genres.map(genre => ({ label: genre, value: genre }))
        ]);
    }, [genres]);

    return (
        <View style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#374151" }}>
                Filtrer par genre
            </Text>
            <DropDownPicker
                open={open}
                value={selectedValue}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedValue}
                setItems={setItems}
                onChangeValue={(val) => {
                    if (val) onChange(val);
                }}
                placeholder="Sélectionnez un genre"
                containerStyle={{ height: 40, marginBottom: 10 }}
                dropDownDirection="BOTTOM"
                zIndex={999}
                style={{
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    borderWidth: 1,
                }}
                dropDownContainerStyle={{
                    borderColor: "#D1D5DB",
                }}
            />
        </View>
    );
}