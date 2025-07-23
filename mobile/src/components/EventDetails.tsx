import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import type { Event } from '../types/event';
import { useNavigation } from "@react-navigation/native";

interface EventDetailsProps {
    event: Event;
    showInfosComplementaires?: boolean;
    showArtists?: boolean;
    showActions?: boolean;
    showViewMoreButton?: boolean;
}

function formatHour(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
}

function extractGenresFromEvent(event: Event): string[] {
    const genres = new Set<string>();
    event.jouer?.forEach((passage) => {
        passage.band?.avoir?.forEach((a) => {
        const genre = a.genre?.type_musique;
        if (genre) genres.add(genre);
        });
    });
    return Array.from(genres);
}

const getEventStatus = (event: Event): { label: string; emoji: string } | null => {
    const now = new Date();
    const debut = new Date(event.debut);
    const fin = new Date(event.fin);

    if (debut <= now && now <= fin) {
        return { label: 'En cours', emoji: '🟢' };
    } else if (now < debut) {
        return { label: 'À venir', emoji: '🔜' };
    } else {
        return { label: 'Terminé', emoji: '⚪' };
    }
};

export default function EventDetails({
    event,
    showInfosComplementaires = false,
    showArtists = true,
    showActions = true,
    showViewMoreButton = true,
}: EventDetailsProps) {
    const status = getEventStatus(event);
    const navigation = useNavigation<any>();

    return (
        <View>
        <Image source={{ uri: event.image_url }} style={styles.image} />

        <View style={styles.container}>
            <Text style={styles.title}>{event.titre}</Text>

            {status && (
            <View style={styles.status}>
                <Text style={styles.statusText}>
                {status.emoji} {status.label}
                </Text>
            </View>
            )}

            <Text style={styles.description}>{event.description}</Text>

            <View style={styles.section}>
            <Text style={styles.item}><Text style={styles.label}>📍 Adresse :</Text> {event.owner?.adresse}, {event.owner?.code_postal} {event.owner?.ville}</Text>
            <Text style={styles.item}>
                <Text style={styles.label}>🗓️ Horaires :</Text> Du {new Date(event.debut).toLocaleDateString()} à {formatHour(new Date(event.debut))} jusqu'au {new Date(event.fin).toLocaleDateString()} à {formatHour(new Date(event.fin))}
            </Text>
            <Text style={styles.item}>
                <Text style={styles.label}>🎭 Genre :</Text> {extractGenresFromEvent(event).join(', ') || 'Non spécifié'}
            </Text>
            <Text style={styles.item}>
                <Text style={styles.label}>💸 Entrée :</Text>{' '}
                {event.prix > 0 ? `${event.prix} €` : <Text style={styles.gratuit}>Gratuit</Text>}
            </Text>

            {showArtists && event.jouer?.length > 0 && (
                <View style={styles.artists}>
                <Text style={styles.label}>🎤 Artiste(s) :</Text>
                {event.jouer.map(({ band, debut_passage, fin_passage }) => (
                    <Text key={band.id_band} style={styles.artist}>
                    {band.nom}
                    {debut_passage && fin_passage &&
                        ` — ${formatHour(new Date(debut_passage))} → ${formatHour(new Date(fin_passage))}`}
                    </Text>
                ))}
                </View>
            )}
            </View>

            {showInfosComplementaires && event.infos_complementaires && (
            <View style={styles.complementary}>
                <Text style={styles.label}>ℹ️ Infos complémentaires :</Text>
                <Text style={styles.complementaryText}>{event.infos_complementaires}</Text>
            </View>
            )}

            {showActions && (
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#22C55E' }]} onPress={() => alert("Vous êtes intéressé par cet événement !")}>
                <Text style={styles.buttonText}>💖 Je suis intéressé</Text>
                </TouchableOpacity>

                {showViewMoreButton && (
                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3B82F6' }]}
                onPress={() => navigation.navigate("EventDetails", { id: event.id_event })}
                >
                <Text style={styles.buttonText}>🔎 Voir plus d'infos</Text>
                </TouchableOpacity>
                )}

                <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6366F1' }]}
                onPress={() => {
                    const lat = event.owner?.latitude;
                    const lng = event.owner?.longitude;
                    if (lat && lng) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
                    Linking.openURL(url);
                    }
                }}
                >
                <Text style={styles.buttonText}>🗺️ Itinéraire</Text>
                </TouchableOpacity>
            </View>
            )}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    status: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        alignSelf: 'flex-start',
        marginVertical: 6,
    },
    statusText: {
        color: '#374151',
        fontWeight: '600',
    },
    description: {
        color: '#374151',
        marginBottom: 12,
    },
    section: {
        marginTop: 8,
    },
    item: {
        marginBottom: 6,
        color: '#374151',
    },
    label: {
        fontWeight: '600',
    },
    gratuit: {
        color: '#16A34A',
        fontWeight: 'bold',
    },
    artists: {
        marginTop: 8,
    },
    artist: {
        marginLeft: 12,
        color: '#374151',
    },
    complementary: {
        marginTop: 12,
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 10,
    },
    complementaryText: {
        color: '#374151',
    },
    actions: {
        marginTop: 16,
        gap: 10,
    },
    button: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
