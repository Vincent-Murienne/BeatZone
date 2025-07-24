import { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/useAuth';
import type { Event } from '../types/event';
import type { EventStatus } from '../types/event';
import EventCard from '../components/EventCard';

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [status, setStatus] = useState<EventStatus>('current');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `${import.meta.env.VITE_API_URL}/events/${status}`;
            
            if (user?.role === 'artist' && user.band?.id_band) {
                url = `${import.meta.env.VITE_API_URL}/events/artist/${user.band.id_band}/${status}`;
            } else if (user?.role === 'owner' && user.id_owner) {
                url = `${import.meta.env.VITE_API_URL}/events/owner/${user.id_owner}/${status}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            console.log("Données reçues:", data);

            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors du chargement des événements');
            }
            
            setEvents(data);
        } catch (error: any) {
            console.error('Erreur:', error);
            setError(error.message || 'Impossible de charger les événements');
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
}, [status, user]);

    const getStatusLabel = (statusType: EventStatus): string => {
        switch (statusType) {
            case 'current': return 'En cours';
            case 'upcoming': return 'À venir';
            case 'past': return 'Passés';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user?.role === 'artist' ? 'Mes événements' : 
                         user?.role === 'owner' ? 'Mes événements organisés' : 
                         'Tous les événements'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {user?.role === 'artist' ? 'Les événements auxquels vous participez' :
                         user?.role === 'owner' ? 'Les événements que vous organisez' :
                         'Découvrez tous les événements'}
                    </p>
                </div>

                {/* Filtres */}
                <div className="flex justify-center space-x-4 mb-8">
                    {(['current', 'upcoming', 'past'] as EventStatus[]).map((statusType) => (
                        <button
                            key={statusType}
                            onClick={() => setStatus(statusType)}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                status === statusType 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {getStatusLabel(statusType)}
                        </button>
                    ))}
                </div>

                {/* Gestion des erreurs */}
                {error && (
                    <div className="text-center text-red-600 mb-8">
                        {error}
                    </div>
                )}

                {/* Liste des événements */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard 
                                key={event.id_event} 
                                event={event} 
                                showActions={true}
                                showViewMoreButton={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">
                            Aucun événement {getStatusLabel(status).toLowerCase()} trouvé
                            {user?.role === 'artist' ? ' pour votre groupe' :
                             user?.role === 'owner' ? ' organisé par vous' :
                             ''}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}