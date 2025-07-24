import React, { useState, useEffect } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    Button,
} from 'react-native';
import type { Band } from '../types/band';
import type { Users } from '../types/users';
import type { Owner } from '../types/owner';
import type { Event } from '../types/event';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
    const [user, setUser] = useState<Users | null>(null);
    const [band, setBand] = useState<Band | null>(null);
    const [owner, setOwner] = useState<Owner | null>(null);
    const [favorites, setFavorites] = useState<Band[]>([]);
    const [eventFavorites, setEventFavorites] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'artist' | 'owner' | 'favorites' | 'eventFavorites'>('personal');

    useEffect(() => {
        const init = async () => {
            const raw = await AsyncStorage.getItem('beatzone_user');
            if (!raw) return;
            const userParsed = JSON.parse(raw);
            const id = userParsed.id;

            // const id = "4a04abf4-ae3d-45bb-8b9c-ed76b23e86ed";

            fetchUserInfo(id);
            fetchUserBand(id);
            fetchOwner(id);
            fetchFavorites(id);
            fetchEventFavorites(id);
        };
        init();
    }, []);


    const fetchUserInfo = async (id: string) => {
        console.log(`Fetching user info for ID: ${id}`);


        try {
            const res = await fetch(`${API_URL}/user/${id}`);
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUserBand = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/user/getBand/${id}`);
            const data = await res.json();
            setBand(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOwner = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/owner/${id}`);
            const data = await res.json();
            setOwner(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFavorites = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/favorites/${id}`);
            const data = await res.json();
            setFavorites(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEventFavorites = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/favorites-event/${id}`);
            const data = await res.json();
            setEventFavorites(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        if (!user) {
            Alert.alert('Erreur', 'Utilisateur non chargé');
            return;
        }
        try {
            await fetch(`${API_URL}/user/update/${user.id_user}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (user.role === 'artist' && band) {
                await fetch(`${API_URL}/band/update/${band.id_band}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(band),
                });
            }

            if (user.role === 'owner' && owner) {
                await fetch(`${API_URL}/owner/update/${owner.id_owner}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(owner),
                });
            }

            Alert.alert('Succès', 'Modifications enregistrées');
            setIsEditing(false);
        } catch (err) {
            Alert.alert('Erreur', 'Problème lors de la sauvegarde');
        }
    };

    if (!user) {
        return <Text className="text-center mt-20 text-lg text-gray-500">Chargement...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: user.avatar_url || 'https://placekitten.com/200/200' }} style={styles.avatar} />
                <Text style={styles.username}>{user.pseudo}</Text>

                <Button title={isEditing ? 'Annuler' : 'Modifier'} onPress={() => setIsEditing(!isEditing)} />
                {isEditing && <Button title="Enregistrer" onPress={handleSave} />}
            </View>

            {/* Onglets */}
            <View style={styles.tabs}>
                <TabButton title="Perso" active={activeTab === 'personal'} onPress={() => setActiveTab('personal')} />
                {user.role === 'artist' && <TabButton title="Artiste" active={activeTab === 'artist'} onPress={() => setActiveTab('artist')} />}
                {user.role === 'owner' && <TabButton title="Owner" active={activeTab === 'owner'} onPress={() => setActiveTab('owner')} />}
                <TabButton title="Favoris" active={activeTab === 'favorites'} onPress={() => setActiveTab('favorites')} />
                <TabButton title="Événements" active={activeTab === 'eventFavorites'} onPress={() => setActiveTab('eventFavorites')} />
            </View>

            {/* Contenu des onglets */}
            {activeTab === 'personal' && (
                <>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={user.email}
                        onChangeText={(text) => setUser({ ...user, email: text })}
                        editable={isEditing}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        value={user.bio}
                        onChangeText={(text) => setUser({ ...user, bio: text })}
                        editable={isEditing}
                        multiline
                        style={[styles.input, { height: 100 }]}
                    />
                </>
            )}

            {activeTab === 'artist' && band && (
                <>
                    <Text style={styles.label}>Nom de scène</Text>
                    <TextInput
                        value={band.nom}
                        onChangeText={(text) => setBand({ ...band, nom: text })}
                        editable={isEditing}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        value={band.description}
                        onChangeText={(text) => setBand({ ...band, description: text })}
                        editable={isEditing}
                        multiline
                        style={[styles.input, { height: 80 }]}
                    />
                </>
            )}

            {activeTab === 'owner' && owner && (
                <>
                    <Text style={styles.label}>Nom de l'établissement</Text>
                    <TextInput
                        value={owner.nom_etablissement}
                        onChangeText={(text) => setOwner({ ...owner, nom_etablissement: text })}
                        editable={isEditing}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Adresse</Text>
                    <TextInput
                        value={owner.adresse}
                        onChangeText={(text) => setOwner({ ...owner, adresse: text })}
                        editable={isEditing}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Ville</Text>
                    <TextInput
                        value={owner.ville}
                        onChangeText={(text) => setOwner({ ...owner, ville: text })}
                        editable={isEditing}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Code postal</Text>
                    <TextInput
                        value={owner.code_postal}
                        onChangeText={(text) => setOwner({ ...owner, code_postal: text })}
                        editable={isEditing}
                        style={styles.input}
                    />
                </>
            )}

            {activeTab === 'favorites' && (
                <>
                    <Text style={styles.label}>Groupes favoris</Text>
                    {favorites.length === 0 ? (
                        <Text style={styles.empty}>Aucun favori</Text>
                    ) : (
                        favorites.map((b) => (
                            <View key={b.id_band} style={styles.card}>
                                <Text style={styles.bold}>{b.nom}</Text>
                                <Text>{b.avoir?.map((a) => a.genre.type_musique).join(', ')}</Text>
                            </View>
                        ))
                    )}
                </>
            )}

            {activeTab === 'eventFavorites' && (
                <>
                    <Text style={styles.label}>Événements favoris</Text>
                    {eventFavorites.length === 0 ? (
                        <Text style={styles.empty}>Aucun événement</Text>
                    ) : (
                        eventFavorites.map((ev) => (
                            <View key={ev.id_event} style={styles.card}>
                                <Text style={styles.bold}>{ev.titre}</Text>
                                <Text>{ev.id_owner} — {ev.debut}</Text>
                            </View>
                        ))
                    )}
                </>
            )}
        </ScrollView>
    );
}

type TabButtonProps = {
    title: string;
    onPress: () => void;
    active: boolean;
};

const TabButton = ({ title, onPress, active }: TabButtonProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.tabButton, active && styles.tabActive]}>
        <Text style={{ color: active ? '#fff' : '#000' }}>{title}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f0f4f8' },
    header: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    username: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    tabs: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16, flexWrap: 'wrap' },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#ddd',
        borderRadius: 20,
        margin: 4,
    },
    tabActive: {
        backgroundColor: '#4f46e5',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 12,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    empty: {
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 10,
    },
    loading: {
        padding: 40,
        textAlign: 'center',
    }
});