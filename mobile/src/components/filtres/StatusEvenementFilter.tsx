import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface StatusEvenementFilterProps {
  value: "all" | "current" | "upcoming";
  onChange: (value: "all" | "current" | "upcoming") => void;
}

export default function StatusEvenementFilter({ value, onChange }: StatusEvenementFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<"all" | "current" | "upcoming">(value);
  const [items, setItems] = useState([
    { label: 'Tous les événements', value: 'all' },
    { label: 'En cours', value: 'current' },
    { label: 'À venir', value: 'upcoming' },
  ]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <View style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#374151" }}>
        Filtrer par statut
      </Text>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedValue}
        setItems={setItems}
        onChangeValue={(val) => {
          if (val) onChange(val as "all" | "current" | "upcoming");
        }}
        placeholder="Sélectionnez un statut"
        containerStyle={{ height: 40, marginBottom: 10 }}
        dropDownDirection="BOTTOM"
        zIndex={1000}
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