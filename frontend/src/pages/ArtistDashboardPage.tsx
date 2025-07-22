import { useEffect, useState } from "react";
// import MainNavbar from "../components/Navbar/MainNavbar";
import { useAuth } from "../auth/context/useAuth";
import type { Event } from "../types/event";
import type { Band } from "../types/band";
import AddEventModal from "../components/AddEventModal";

const API_URL = import.meta.env.VITE_API_URL;

type Invitation = {
  id: string;
  event: Event;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
};

export default function ArtistDashboardPage() {
  const { user, getUserById } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'invitations'>('events');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [artistEvents, setArtistEvents] = useState<Event[]>([]);
  const [artistProfile, setArtistProfile] = useState<Band | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  
  const fetchArtistData = async () => {
    if (!user?.id) return;

    try {
      // Récupérer le profil de l'artiste
      const profileRes = await fetch(`${API_URL}/band/${user.id}`);
      const profileData = await profileRes.json();
      setArtistProfile(profileData);

      // Récupérer les événements de l'artiste
      const eventsRes = await fetch(`${API_URL}/band/${profileData.id_band}/events`);
      console.log(eventsRes);
      const eventsData = await eventsRes.json();
      setArtistEvents(eventsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchArtistData();
    }
  }, [user]);

  const handleInvitationResponse = async (invitationId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await fetch(`${API_URL}/invitations/${invitationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Mettre à jour la liste des invitations
        setInvitations(invitations.map(inv => 
          inv.id === invitationId ? { ...inv, status } : inv
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la réponse à l'invitation:", error);
    }
  };

  const handleEventAdded = () => {
    fetchArtistData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return <div>Vous devez être connecté en tant qu'artiste pour accéder à cette page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <MainNavbar /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Artiste</h1>
          {artistProfile && (
            <p className="mt-2 text-gray-600">{artistProfile.nom}</p>
          )}
        </div>

        {/* Navigation entre les onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mes Événements
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`${
                activeTab === 'invitations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative`}
            >
              Invitations
              {invitations.filter(inv => inv.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                  {invitations.filter(inv => inv.status === 'pending').length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'events' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mes Événements</h2>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {artistEvents.map((event) => (
                  <li key={event.id_event}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{event.titre}</h3>
                        <span className="px-2 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
                          {event.prix}€
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {event.adresse}, {event.ville}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Du {formatDate(event.debut)} au {formatDate(event.fin)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invitations</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <li key={invitation.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        {/* <h3 className="text-lg font-medium text-gray-900">
                          {invitation.event.nom}
                        </h3> */}
                        <div className="flex space-x-2">
                          {invitation.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Refuser
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-1 text-sm rounded-full ${
                              invitation.status === 'accepted' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invitation.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {invitation.event.adresse}, {invitation.event.ville}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Du {formatDate(invitation.event.debut)} au {formatDate(invitation.event.fin)}
                        </p>
                        {invitation.message && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{invitation.message}"
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modal d'ajout d'événement */}
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          onEventAdded={handleEventAdded}
        />
      </div>
    </div>
  );
} 