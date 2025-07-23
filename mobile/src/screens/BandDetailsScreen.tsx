import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Linking,
    ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addBandToFavorites, removeBandFromFavorites } from "../services/favoriteService";
import type { Band } from "../types/band";
import type { Event } from "../types/event";
import EventCard from "../components/EventCard";
import { FontAwesome } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BandDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as { id: string };
    
    const [band, setBand] = useState<Band | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingBand, setLoadingBand] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAddFavorite = async () => {
        try {
            const userRaw = await AsyncStorage.getItem("beatzone_user");
            if (!userRaw) {
                Alert.alert("Erreur", "Vous devez être connecté pour ajouter un favori.");
                return;
            }
            
            let userId;
            try {
                userId = JSON.parse(userRaw).id;
            } catch {
                Alert.alert("Erreur", "Utilisateur invalide.");
                return;
            }
            
            await addBandToFavorites(userId, band.id_band);
            setIsFavorite(true);
            Alert.alert("Succès", "Groupe ajouté aux favoris !");
        } catch (err: any) {
            if (err.message?.includes("duplicate key") || err.message?.includes("Déjà en favori")) {
                setIsFavorite(true);
                Alert.alert("Information", "Ce groupe est déjà dans vos favoris.");
            } else {
                Alert.alert("Erreur", err.message || "Impossible d'ajouter le favori");
            }
        }
    };

    const handleRemoveFavorite = async () => {
        try {
            const userRaw = await AsyncStorage.getItem("beatzone_user");
            if (!userRaw) {
                Alert.alert("Erreur", "Vous devez être connecté pour supprimer un favori.");
                return;
            }
            
            let userId;
            try {
                userId = JSON.parse(userRaw).id;
            } catch {
                Alert.alert("Erreur", "Utilisateur invalide.");
                return;
            }
            
            await removeBandFromFavorites(userId, band.id_band);
            setIsFavorite(false);
            Alert.alert("Succès", "Groupe retiré des favoris !");
        } catch (err: any) {
            Alert.alert("Erreur", err.message || "Impossible de retirer le favori");
        }
    };

    const handleSocialLinkPress = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
        }
    };

    useEffect(() => {
        const fetchBand = async () => {
            try {
                const res = await axios.get(`${API_URL}/band/${id}`);
                setBand(res.data);
            } catch (error) {
                console.error("Erreur lors du chargement du groupe :", error);
            } finally {
                setLoadingBand(false);
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_URL}/band/${id}/events`);
                setEvents(res.data);
            } catch (error) {
                console.error("Erreur lors du chargement des événements :", error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchBand();
        fetchEvents();
    }, [id]);

    useEffect(() => {
        if (!band) return;
        
        const checkFavorite = async () => {
            try {
                const userRaw = await AsyncStorage.getItem("beatzone_user");
                if (!userRaw) return;
                
                let userId;
                try {
                    userId = JSON.parse(userRaw).id;
                } catch {
                    return;
                }
                
                const response = await fetch(`${API_URL}/favorites/${userId}`);
                const data = await response.json();
                const found = data.some((b: any) => b.id_band === band.id_band);
                setIsFavorite(found);
            } catch (error) {
                console.error("Erreur lors de la vérification des favoris:", error);
            }
        };
        
        checkFavorite();
    }, [band]);

    if (loadingBand || loadingEvents) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>
                    {loadingBand ? "Chargement du groupe..." : "Chargement des événements..."}
                </Text>
            </View>
        );
    }

    if (!band) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Groupe introuvable.</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const socialLinks = band.band_socials?.[0];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header avec bouton retour */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Retour à la liste</Text>
                </TouchableOpacity>
            </View>

            {/* Titre et bouton favori */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{band.nom}</Text>
                <TouchableOpacity
                    style={[
                        styles.favoriteButton,
                        { backgroundColor: isFavorite ? "#ef4444" : "#10b981" }
                    ]}
                    onPress={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                >
                    <Text style={styles.favoriteButtonText}>
                        {isFavorite ? "❌ Retirer des favoris" : "💖 Ajouter aux favoris"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Image principale */}
            <Image
                source={{ uri: band.image_url }}
                style={styles.mainImage}
                resizeMode="cover"
            />

            {/* Informations principales */}
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Description :</Text>
                <Text style={styles.infoText}>{band.description}</Text>
                
                <Text style={styles.infoLabel}>Ville :</Text>
                <Text style={styles.infoText}>{band.ville}, {band.pays}</Text>
                
                <Text style={styles.infoLabel}>Créé le :</Text>
                <Text style={styles.infoText}>
                    {new Date(band.cree_le).toLocaleDateString("fr-FR")}
                </Text>
            </View>

            {/* Genres musicaux */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genres musicaux :</Text>
                {band.avoir && band.avoir.length > 0 ? (
                    <View style={styles.genresContainer}>
                        {band.avoir.map((a, index) =>
                            a.genre?.type_musique ? (
                                <View key={index} style={styles.genreBadge}>
                                    <Text style={styles.genreText}>
                                        {a.genre.type_musique}
                                    </Text>
                                </View>
                            ) : null
                        )}
                    </View>
                ) : (
                    <Text style={styles.noDataText}>Aucun genre renseigné.</Text>
                )}
            </View>

            {/* Membres */}
            {band.membres && band.membres.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Membres du groupe :</Text>
                    {band.membres.map((membre) => (
                        <View key={membre.id_member} style={styles.memberCard}>
                            <View style={styles.memberInfo}>
                                {membre.image_url ? (
                                    <Image
                                        source={{ uri: membre.image_url }}
                                        style={styles.memberImage}
                                    />
                                ) : (
                                    <View style={styles.memberImagePlaceholder}>
                                        <Text style={styles.placeholderText}>N/A</Text>
                                    </View>
                                )}
                                <View style={styles.memberDetails}>
                                    <Text style={styles.memberName}>
                                        {membre.prenom} {membre.nom}
                                    </Text>
                                    {membre.detenir?.length ? (
                                        <Text style={styles.memberRole}>
                                            {membre.detenir
                                                .map((d) => d.role?.instrument)
                                                .filter(Boolean)
                                                .join(", ")}
                                        </Text>
                                    ) : (
                                        <Text style={styles.noRoleText}>
                                            Aucun instrument renseigné
                                        </Text>
                                    )}
                                    <Text style={styles.memberBio}>{membre.bio}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Réseaux sociaux */}
            {socialLinks && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Réseaux sociaux :</Text>
                    <View style={styles.socialContainer}>
                        {socialLinks.spotify_url && typeof socialLinks.spotify_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.spotify_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="spotify" size={30} color="#1DB954" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.deezer_url && typeof socialLinks.deezer_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.deezer_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="music" size={30} color="#FF5500" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.youtube_url && typeof socialLinks.youtube_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.youtube_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="youtube-play" size={30} color="#FF0000" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.instagram_url && typeof socialLinks.instagram_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.instagram_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="instagram" size={30} color="#E4405F" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.facebook_url && typeof socialLinks.facebook_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.facebook_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="facebook" size={30} color="#1877F2" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.tiktok_url && typeof socialLinks.tiktok_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.tiktok_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="music" size={30} color="#000000" />
                            </TouchableOpacity>
                        )}
                        {socialLinks.site_web_url && typeof socialLinks.site_web_url === "string" && (
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(socialLinks.site_web_url as string)}
                                style={styles.socialButton}
                            >
                                <FontAwesome name="globe" size={30} color="#3b82f6" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Événements */}
            <EventCard events={events} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6b7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#ef4444',
        marginBottom: 20,
        textAlign: 'center',
    },
    header: {
        padding: 16,
        paddingTop: 50,
    },
    backButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    titleContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    favoriteButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    favoriteButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 24,
        marginHorizontal: 16,
    },
    infoSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginTop: 8,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 8,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    genreBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    genreText: {
        color: '#1e40af',
        fontSize: 12,
        fontWeight: '500',
    },
    noDataText: {
        fontSize: 14,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    memberCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    memberImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
    },
    memberImagePlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    placeholderText: {
        color: '#6b7280',
        fontSize: 12,
    },
    memberDetails: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    memberRole: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    noRoleText: {
        fontSize: 14,
        color: '#9ca3af',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    memberBio: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    socialContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    socialButton: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});