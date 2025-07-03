import { Event } from "../types/event";

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.titre}
          className="w-full h-60 object-cover"
        />
        <div className="p-6 space-y-2">
          <h2 className="text-2xl font-bold">{event.titre}</h2>
          <p className="text-gray-700">{event.description}</p>
          <p className="text-sm text-gray-600">{event.adresse}</p>
          <p className="text-sm text-gray-600">
            Du {new Date(event.debut).toLocaleString()} au{" "}
            {new Date(event.fin).toLocaleString()}
          </p>
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
