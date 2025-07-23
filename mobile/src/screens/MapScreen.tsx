import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapComponent from '../components/MapComponent';
import EventModal from '../components/EventModal';
import type { Event } from '../types/event';
import type { Region } from 'react-native-maps';
import { useNavigationState } from '@react-navigation/native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MapScreen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const [region, setRegion] = useState<Region>({
        latitude: 48.8534,
        longitude: 2.3488,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
    });

    useEffect(() => {
    if (currentRoute === 'EventDetails') {
        setSelectedEvent(null); // ferme le modal
    }
    }, [currentRoute]);


    useEffect(() => {
        (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            setUserLocation(loc.coords);
            setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
            });
        }
        })();
    }, []);

    useEffect(() => {
    fetch(`${API_URL}/events`)
        .then((res) => res.json())
        .then((data) => {
        console.log('[DEBUG] Events:', data);
        setEvents(data);
        })
        .catch(console.warn);
    }, []);

    return (
        <View style={styles.container}>
        <MapComponent
            events={events}
            region={region}
            onRegionChange={setRegion}
            userLocation={userLocation}
            onEventSelect={setSelectedEvent}
        />

        {selectedEvent && (
            <EventModal
                event={selectedEvent}
                visible={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
