import { useState, useEffect } from 'react';
import type { Users } from '../types/users';
import type { Band } from '../types/band';
import { useNavigate } from 'react-router-dom';
import type { Owner } from '../types/owner';

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
    const [user, setUser] = useState<Users | null>(null);
    const [band, setBand] = useState<Band | null>(null);
    const [owner, setOwner] = useState<Owner | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [favorites, setFavorites] = useState<Band[]>([]);
    const [eventFavorites, setEventFavorites] = useState<any[]>([]);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'personal' | 'artist' | 'owner' | 'favorites' | 'eventFavorites'>('personal');

    const fetchUserInfo = async (userId: any) => {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        try {
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            setUser(data);
            return data;
        } catch (error) {
            console.error("Error fetching user info:", error);
            return null;
        }
    };


    const FetchUserBand = async (userId: string) => {
        console.log("ID reçu dans /user/getBand/:id =", userId);
        const response = await fetch(`${API_URL}/user/getBand/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        try {
            if (!response.ok) {
                throw new Error('Failed to fetch user band');
            }
            const data = await response.json();
            setBand(data.data);
            console.log("Band data fetched:", data);
            return data;
        } catch (error) {
            console.error("Error fetching user band:", error);
            return null;
        }
    }


    const fetchOwner = async (userId: string) => {
        console.log("ID reçu dans =", userId);
        const response = await fetch(`${API_URL}/owner/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        
        try {
            if (!response.ok) {
                throw new Error('Failed to fetch owner info');
            }
            const data = await response.json();
            setOwner(data);
            console.log("Owner data fetched:", data);
            return data;
        } catch (error) {
            console.error("Error fetching owner info:", error);
            return null;
        }
    }


    const handleSave = async () => {
        try {
            // 1. Update user
            console.log("Sending to backend (user):", user);
            const resUser = await fetch(`${API_URL}/user/update/${user?.id_user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!resUser.ok) {
                throw new Error('Erreur lors de la mise à jour de l’utilisateur');
            }

            // 2. Update owner
            if (user?.role === 'owner' && owner) {
                console.log("Sending to backend (owner):", owner);
                const resOwner = await fetch(`${API_URL}/owner/update/${owner.id_owner}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(owner),
                });

                if (!resOwner.ok) {
                    throw new Error('Erreur lors de la mise à jour de l’établissement');
                }
            }

            // 3. Update artist / band
            if (user?.role === 'artist' && band) {
                console.log("user:", user);
                console.log("Sending to backend (band):", band);
                const resBand = await fetch(`${API_URL}/band/update/${band.id_band}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(band),
                });

                if (!resBand.ok) {
                    throw new Error('Erreur lors de la mise à jour du groupe');
                }
            }

            alert("Modifications enregistrées avec succès !");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };



    const fetchFavorites = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/favorites/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des favoris');
            }

            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error('Erreur fetchFavorites :', error);
        }
    };
    const fetchEventFavorites = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/favorites-event/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des événements favoris');
            }
            const data = await response.json();
            setEventFavorites(data);
        } catch (error) {
            console.error('Erreur fetchEventFavorites :', error);
        }
    };
    useEffect(() => {
        const userId: any = localStorage.getItem('beatzone_user');

        if (userId) {
            const userlocal = JSON.parse(userId);
            fetchUserInfo(userlocal.id);
            FetchUserBand(userlocal.id);
            fetchOwner(userlocal.id);
            fetchFavorites(userlocal.id);
            fetchEventFavorites(userlocal.id);

        }
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white relative">
                        <div className="flex items-center justify-between">
                            {/* Avatar + Pseudo */}
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <img
                                        src={user ? user.avatar_url : '/default-avatar.png'}
                                        alt="Avatar"
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {user ? user.pseudo : 'Chargement...'}
                                    </h1>
                                </div>
                            </div>

                            {/* Bouton Modifier */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
                                >
                                    {isEditing ? 'Annuler' : 'Modifier mes informations'}
                                </button>

                                {isEditing && (
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                                    >
                                        Enregistrer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Onglets */}
                    {user && (
                        <div className="flex space-x-4 px-8 pt-4">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'personal' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                    }`}
                            >
                                Informations personnelles
                            </button>

                            {user.role === 'artist' && (
                                <button
                                    onClick={() => setActiveTab('artist')}
                                    className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'artist' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                        }`}
                                >
                                    Informations artiste
                                </button>
                            )}

                            {user.role === 'owner' && (
                                <button
                                    onClick={() => setActiveTab('owner')}
                                    className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'owner' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                        }`}
                                >
                                    Informations organisateur
                                </button>
                            )}
                            {/* Onglet Favoris (visible pour tous les rôles) */}
                            <button
                                onClick={() => setActiveTab('favorites')}
                                className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'favorites' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                    }`}
                            >
                                Groupe Favoris
                            </button>
                            <button
                                onClick={() => setActiveTab('eventFavorites')}
                                className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'eventFavorites' ? 'bg-white text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
                            >
                                Event Favoris
                            </button>
                        </div>
                    )}

                    {/* Contenu principal */}
                    <div className="p-8">
                        <form>
                            {activeTab === 'personal' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Infos perso */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                                            Informations personnelles
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                                    <input
                                                        type="email"
                                                        value={user?.email || ''}
                                                        className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                        onChange={(e) => setUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                                            À propos de moi
                                        </h2>
                                        <textarea
                                            value={user?.bio || ''}
                                            rows={8}
                                            placeholder="Décrivez-vous en quelques mots..."
                                            className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                            onChange={(e) => setUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Onglet artiste */}
                            {activeTab === 'artist' && user?.role === 'artist' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2">
                                        Informations artiste
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Nom d'artiste</label>
                                            <input
                                                type="text"
                                                value={band ? band.nom : ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                onChange={(e) => setBand(prev => prev ? { ...prev, nom: e.target.value } : null)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Genre musical</label>
                                            <input
                                                type="text"
                                                value={band?.avoir?.map(a => a.genre.type_musique).join(', ') ?? ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Description</label>
                                        <textarea
                                            value={band?.description ?? ''}
                                            rows={6}
                                            className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                            onChange={(e) => setBand(prev => prev ? { ...prev, description: e.target.value } : null)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* Onglet owner */}
                            {activeTab === 'owner' && user?.role === 'owner' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2">
                                        Informations établissement
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Nom de l’établissement</label>
                                            <input
                                                type="text"
                                                value={owner?.nom_etablissement ?? ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                onChange={(e) => setOwner(prev => prev ? { ...prev, nom_etablissement: e.target.value } : null)}
                                                disabled={!isEditing} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Adresse</label>
                                            <input
                                                type="text"
                                                value={owner?.adresse ?? ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                onChange={(e) => setOwner(prev => prev ? { ...prev, adresse: e.target.value } : null)}
                                                disabled={!isEditing} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Ville</label>
                                            <input
                                                type="text"
                                                value={owner?.ville ?? ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                onChange={(e) => setOwner(prev => prev ? { ...prev, ville: e.target.value } : null)}
                                                disabled={!isEditing} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Code postal</label>
                                            <input
                                                type="text"
                                                value={owner?.code_postal ?? ''}
                                                className={`w-full mt-1 px-3 py-2 border ${isEditing ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded-lg`}
                                                onChange={(e) => setOwner(prev => prev ? { ...prev, code_postal: e.target.value } : null)}
                                                disabled={!isEditing} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                        {/* Favoris */}
                        {activeTab === 'favorites' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2">
                                    Mes favoris 💖
                                </h2>
                                {(favorites?.length ?? 0) === 0 ? (
                                    <p className="text-gray-600">Aucun favori pour l’instant.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {favorites.map((band) => (
                                            <li
                                                key={band.id_band}
                                                className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
                                                onClick={() => navigate(`/band/${band.id_band}`)}
                                            >
                                                <p className="font-semibold">{band.nom}</p>
                                                <p className="text-sm text-gray-600">{band.avoir?.map(a => a.genre.type_musique).join(', ')}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {activeTab === 'eventFavorites' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-pink-200 pb-2">
                                    Mes événements favoris 💖
                                </h2>
                                {(eventFavorites?.length ?? 0) === 0 ? (
                                    <p className="text-gray-600">Aucun événement favori pour l’instant.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {eventFavorites.map((event) => (
                                            <li
                                                key={event.id_event}
                                                className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
                                                onClick={() => navigate(`/event/${event.id_event}`)}
                                            >
                                                <p className="font-semibold">{event.titre}</p>
                                                <p className="text-sm text-gray-600">{event.lieu} — {event.debut}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
