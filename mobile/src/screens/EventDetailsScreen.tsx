import { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { Event } from "../types/event";
import EventDetails from "../components/EventDetails";
import BandCard from "../components/BandCard";
import Constants from "expo-constants";

export default function EventDetailsScreen() {
    const [event, setEvent] = useState<Event | null>(null);
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const fetchEvent = async () => {
        try {
            const res = await fetch(`${API_URL}/event/${id}`);
            const data = await res.json();
            setEvent(data);
        } catch (err) {
            console.error("Erreur lors du chargement de l'événement :", err);
        }
        };
        fetchEvent();
    }, [id]);

    if (!event) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Chargement de l'événement...</Text>
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

        <EventDetails
            event={event}
            showInfosComplementaires={true}
            showArtists={true}
            showActions={true}
            showViewMoreButton={false}
        />

        {event.jouer && event.jouer.length > 0 && (
            <View style={styles.bandCardContainer}>
                <BandCard bands={event.jouer.map((j) => j.band)} />
            </View>
        )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        color: "#666",
        fontSize: 16,
    },
    backButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginBottom: 16,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    bandCardContainer: {
        marginTop: 24,
    },
});
