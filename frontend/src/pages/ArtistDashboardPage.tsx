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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'invitations'>('events');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [artistEvents, setArtistEvents] = useState<Event[]>([]);
  const [artistProfile, setArtistProfile] = useState<Band | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  
  const fetchArtistData = async () => {
    if (!user?.id) return;

    try {
      const profileRes = await fetch(`${API_URL}/band/${user.id}`);
      const profileData = await profileRes.json();
      
      setArtistProfile(profileData);
      console.log(profileData);
      const eventsRes = await fetch(`${API_URL}/band/${profileData.id_band}/events`);
      const eventsData = await eventsRes.json();
      setArtistEvents(eventsData);
      console.log(eventsData);
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
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={artistProfile.image_url} 
                  alt={artistProfile.nom}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{artistProfile.nom}</h2>
                  <p className="text-gray-600">{artistProfile.ville}, {artistProfile.pays}</p>
                  <p className="text-gray-500 mt-1">{artistProfile.description}</p>
                  <div className="mt-2">
                    {artistProfile.avoir?.map((genre, index) => (
                      <span key={index} className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm mr-2">
                        {genre.genre.type_musique}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
                  <li key={event.id_event} className="hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={event.image_url} 
                            alt={event.titre}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{event.titre}</h3>
                            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                          </div>
                        </div>
                        {event.prix === 0 ? (
                          <span className="px-2 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                            Gratuit
                          </span>
                        ) : event.prix ? (
                          <span className="px-2 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
                            {event.prix}€
                          </span>
                        ) : null}
                      </div>
                      {event.debut && event.fin && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Du {formatDate(event.debut)} au {formatDate(event.fin)}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {artistEvents.length === 0 && (
                  <li className="px-4 py-4 sm:px-6">
                    <p className="text-gray-500">Aucun événement trouvé</p>
                  </li>
                )}
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
                        <div className="flex items-center space-x-4">
                          <img 
                            src={invitation.event.image_url} 
                            alt={invitation.event.titre}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{invitation.event.titre}</h3>
                            <p className="text-sm text-gray-500">{invitation.event.description}</p>
                          </div>
                        </div>
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
                      {invitation.event.debut && invitation.event.fin && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Du {formatDate(invitation.event.debut)} au {formatDate(invitation.event.fin)}
                          </p>
                        </div>
                      )}
                      {invitation.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{invitation.message}"
                        </p>
                      )}
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