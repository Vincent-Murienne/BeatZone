import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Band } from '../types/band';

type BandCardProps = {
    bands: Band[];
};

export default function BandCard({ bands }: BandCardProps) {
    const navigation = useNavigation<any>();

    if (!bands || bands.length === 0) return null;

    return (
        <View className="mt-8 px-4">
        <Text className="text-2xl font-semibold mb-4">Artistes / Groupes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bands.map((band) => (
            <TouchableOpacity
                key={band.id_band}
                className="bg-white rounded-2xl shadow-md p-4 mr-4 w-64"
                onPress={() => navigation.navigate('BandDetails', { id: band.id_band })}
            >
                <Image
                source={{ uri: band.image_url }}
                className="w-full h-48 rounded-xl mb-3"
                resizeMode="cover"
                />
                <Text className="text-lg font-bold mb-1" numberOfLines={1}>
                {band.nom}
                </Text>

                {band.avoir && band.avoir.length > 0 ? (
                <View className="flex flex-row flex-wrap gap-2">
                    {band.avoir.map((a, index) =>
                    a.genre?.type_musique ? (
                        <Text
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                        {a.genre.type_musique}
                        </Text>
                    ) : null
                    )}
                </View>
                ) : (
                <Text className="text-sm text-gray-500">Aucun genre renseigné.</Text>
                )}
            </TouchableOpacity>
            ))}
        </ScrollView>
        </View>
    );
}
