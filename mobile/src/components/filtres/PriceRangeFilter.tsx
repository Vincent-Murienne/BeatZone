import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";

interface PriceRangeFilterProps {
    onChange: (range: [number, number]) => void;
    defaultMin?: number;
    defaultMax?: number;
}

export default function PriceRangeFilter({
    onChange,
    defaultMin = 0,
    defaultMax = 100,
}: PriceRangeFilterProps) {
    const [min, setMin] = useState<string>(defaultMin.toString());
    const [max, setMax] = useState<string>(defaultMax.toString());

    useEffect(() => {
        setMin(defaultMin.toString());
        setMax(defaultMax.toString());
    }, [defaultMin, defaultMax]);

    useEffect(() => {
        const minValue = Number(min) || 0;
        const maxValue = Number(max) || 0;
        onChange([minValue, maxValue]);
    }, [min, max, onChange]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#374151" }}>
                    Filtrer par prix (€)
                </Text>
                
                <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    marginBottom: 10 
                }}>
                    <TextInput
                        keyboardType="numeric"
                        value={min}
                        onChangeText={setMin}
                        placeholder="Min"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "#D1D5DB",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: "#000",
                            backgroundColor: "#fff"
                        }}
                    />
                    <Text style={{ 
                        color: "#6B7280", 
                        marginHorizontal: 8,
                        fontSize: 16 
                    }}>
                        —
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        value={max}
                        onChangeText={setMax}
                        placeholder="Max"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: "#D1D5DB",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: "#000",
                            backgroundColor: "#fff"
                        }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}