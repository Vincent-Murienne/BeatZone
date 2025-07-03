import type { Event } from "../types/event";

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

const getEventStatus = (event: Event): { label: string; emoji: string } | null => {
  const now = new Date();
  const debut = new Date(event.debut);
  const fin = new Date(event.fin);

  if (debut <= now && now <= fin) {
    return { label: "En cours", emoji: "🟢" };
  } else if (now < debut) {
    return { label: "À venir", emoji: "🔜" };
  } else {
    return { label: "Terminé", emoji: "⚪" };
  }
};

function formatHour(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
}


const EventModal = ({ event, onClose }: EventModalProps) => {
  const status = getEventStatus(event);

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden pointer-events-auto">
        <img
          src={event.image_url}
          alt={event.titre}
          className="w-full h-60 object-cover"
        />
        <div className="p-6 space-y-2">
          <h2 className="text-2xl font-bold">{event.titre}</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            {status ? (
              <>
                <span>{status.emoji}</span>
                <span>{status.label}</span>
              </>
            ) : null}
          </div>

          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          <div className="space-y-1 text-gray-700 text-sm mt-4">
            <p><span className="font-semibold">📍 Adresse :</span> {event.adresse}, {event.code_postal} {event.ville}</p>
            <p>
              <span className="font-semibold">🗓️ Horaires :</span> Du{" "}
              <span className="font-medium">{new Date(event.debut).toLocaleDateString()}</span> à{" "}
              <span className="font-medium">{formatHour(new Date(event.debut))}</span>
              {" "}jusqu'au{" "}
              <span className="font-medium">{new Date(event.fin).toLocaleDateString()}</span> à{" "}
              <span className="font-medium">{formatHour(new Date(event.fin))}</span>
            </p>
            <p><span className="font-semibold">🎭 Genre :</span> {event.genre}</p>
            <p>
              <span className="font-semibold">💸 Entrée :</span>{" "}
              {event.prix > 0 ? `${event.prix} €` : <span className="text-green-600 font-semibold">Gratuit</span>}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mt-4">
            <a
              onClick={() => alert("Vous êtes intéressé par cet événement !")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              💖 Je suis intéressé
            </a>

            <a
              href={`/events/${event.id_event}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              🔎 Voir plus d'infos
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              🗺️ Itinéraire
            </a>
          </div>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;