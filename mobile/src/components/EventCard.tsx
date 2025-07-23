import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Event } from "../types/event";

type EventCardProps = {
    events: Event[];
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colonnes avec marges

export default function EventCard({ events }: EventCardProps) {
    const navigation = useNavigation<any>();

    if (!events || events.length === 0) return null;

    const handleEventPress = (eventId: string) => {
        navigation.navigate('EventDetails', { id: eventId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Événements du groupe</Text>
            <View style={styles.gridContainer}>
                {events.map((event) => (
                    <TouchableOpacity
                        key={event.id_event}
                        style={[styles.eventCard, { width: cardWidth }]}
                        onPress={() => handleEventPress(String(event.id_event))}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: event.image_url }}
                            style={styles.eventImage}
                            resizeMode="cover"
                        />
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle} numberOfLines={2}>
                                {event.titre}
                            </Text>
                            <Text style={styles.eventDescription} numberOfLines={3}>
                                {event.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1F2937',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    eventCard: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 16,
        padding: 16,
    },
    eventImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 12,
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    eventDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
});