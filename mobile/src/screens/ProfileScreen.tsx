import React, { useState, useEffect } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
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
        <ScrollView className="p-4 bg-gray-100 min-h-screen">
            <View className="items-center mb-6">
                <Image
                    source={{ uri: user.avatar_url || 'https://placekitten.com/200/200' }}
                    className="w-24 h-24 rounded-full mb-3"
                />
                <Text className="text-2xl font-bold mb-2">{user.pseudo}</Text>
                <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                    className="bg-blue-500 px-4 py-2 rounded-full mb-2"
                >
                    <Text className="text-white">{isEditing ? 'Annuler' : 'Modifier'}</Text>
                </TouchableOpacity>
                {isEditing && (
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-green-600 px-4 py-2 rounded-full"
                    >
                        <Text className="text-white">Enregistrer</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Onglets */}
            <View className="flex-row flex-wrap justify-center mb-4">
                {['personal', 'artist', 'owner', 'favorites', 'eventFavorites'].map((tab) => {
                    if (tab === 'artist' && user.role !== 'artist') return null;
                    if (tab === 'owner' && user.role !== 'owner') return null;
                    const label = {
                        personal: 'Perso',
                        artist: 'Artiste',
                        owner: 'Owner',
                        favorites: 'Favoris',
                        eventFavorites: 'Événements',
                    }[tab];
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab as 'personal' | 'artist' | 'owner' | 'favorites' | 'eventFavorites')}
                            className={`m-1 px-3 py-2 rounded-full ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <Text className={activeTab === tab ? 'text-white' : 'text-black'}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Onglet Perso */}
            {activeTab === 'personal' && (
                <View>
                    <Text className="font-semibold mb-1">Email</Text>
                    <TextInput
                        className="bg-white p-2 rounded mb-3"
                        editable={isEditing}
                        value={user.email}
                        onChangeText={(text) => setUser({ ...user, email: text })}
                    />
                    <Text className="font-semibold mb-1">Bio</Text>
                    <TextInput
                        className="bg-white p-2 rounded h-24"
                        editable={isEditing}
                        multiline
                        value={user.bio}
                        onChangeText={(text) => setUser({ ...user, bio: text })}
                    />
                </View>
            )}

            {/* Onglet Artiste */}
            {activeTab === 'artist' && band && (
                <View>
                    <Text className="font-semibold mb-1">Nom d'artiste</Text>
                    <TextInput
                        className="bg-white p-2 rounded mb-3"
                        editable={isEditing}
                        value={band.nom}
                        onChangeText={(text) => setBand({ ...band, nom: text })}
                    />
                    <Text className="font-semibold mb-1">Description</Text>
                    <TextInput
                        className="bg-white p-2 rounded h-24"
                        editable={isEditing}
                        multiline
                        value={band.description}
                        onChangeText={(text) => setBand({ ...band, description: text })}
                    />
                </View>
            )}

            {/* Onglet Owner */}
            {activeTab === 'owner' && owner && (
                <View>
                    <Text className="font-semibold mb-1">Nom établissement</Text>
                    <TextInput
                        className="bg-white p-2 rounded mb-2"
                        editable={isEditing}
                        value={owner.nom_etablissement}
                        onChangeText={(text) => setOwner({ ...owner, nom_etablissement: text })}
                    />
                    <Text className="font-semibold mb-1">Adresse</Text>
                    <TextInput
                        className="bg-white p-2 rounded mb-2"
                        editable={isEditing}
                        value={owner.adresse}
                        onChangeText={(text) => setOwner({ ...owner, adresse: text })}
                    />
                    <Text className="font-semibold mb-1">Ville</Text>
                    <TextInput
                        className="bg-white p-2 rounded mb-2"
                        editable={isEditing}
                        value={owner.ville}
                        onChangeText={(text) => setOwner({ ...owner, ville: text })}
                    />
                    <Text className="font-semibold mb-1">Code postal</Text>
                    <TextInput
                        className="bg-white p-2 rounded"
                        editable={isEditing}
                        value={owner.code_postal}
                        onChangeText={(text) => setOwner({ ...owner, code_postal: text })}
                    />
                </View>
            )}

            {/* Onglet Favoris */}
            {activeTab === 'favorites' && (
                <View>
                    {favorites.length === 0 ? (
                        <Text className="italic text-gray-500">Aucun favori</Text>
                    ) : (
                        favorites.map((b) => (
                            <View key={b.id_band} className="bg-white p-3 rounded mb-2">
                                <Text className="font-bold">{b.nom}</Text>
                                <Text>{b.avoir?.map((a) => a.genre.type_musique).join(', ')}</Text>
                            </View>
                        ))
                    )}
                </View>
            )}

            {/* Onglet Event Favoris */}
            {activeTab === 'eventFavorites' && (
                <View>
                    {eventFavorites.length === 0 ? (
                        <Text className="italic text-gray-500">Aucun événement favori</Text>
                    ) : (
                        eventFavorites.map((ev) => (
                            <View key={ev.id_event} className="bg-white p-3 rounded mb-2">
                                <Text className="font-bold">{ev.titre}</Text>
                                <Text>{ev.id_owner} — {ev.debut}</Text>
                            </View>
                        ))
                    )}
                </View>
            )}
        </ScrollView>
    );
}
