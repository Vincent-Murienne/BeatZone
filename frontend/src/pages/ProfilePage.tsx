import { useState, useEffect } from 'react';
import type { Users } from '../types/users';
import type { Band, BandWithGenre } from '../types/band';

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
    const [user, setUser] = useState<Users | null>(null);
    const [band, setBand] = useState<BandWithGenre | null>(null);

    const [activeTab, setActiveTab] = useState<'personal' | 'artist'>('personal');

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


    useEffect(() => {
        const userId: any = localStorage.getItem('beatzone_user');

        if (userId) {
            const userlocal = JSON.parse(userId);
            fetchUserInfo(userlocal.id);
            FetchUserBand(userlocal.id);
        }
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white relative">
                        <div className="flex items-center justify-between">
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
                        </div>
                    )}

                    {/* Contenu principal */}
                    <div className="p-8">
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
                                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    disabled
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
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        placeholder="Décrivez-vous en quelques mots..."
                                        disabled
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
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Genre musical</label>
                                        <input
                                            type="text"
                                            value={band?.avoir?.map(item => item.genre.type_musique).join(', ') ?? ''}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Description</label>
                                    <textarea
                                        value={''}
                                        rows={6}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
