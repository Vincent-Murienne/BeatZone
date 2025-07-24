import type { Event } from "../types/event";
import { Link } from "react-router-dom";

type EventCardProps = {
  event: Event;
  showActions?: boolean;
  showViewMoreButton?: boolean;
};

export default function EventCard({ event }: EventCardProps) {
  if (!event) return null;

  return (
    <Link
      to={`/event/${event.id_event}`}
      className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={event.image_url}
        alt={event.titre}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-bold">{event.titre}</h3>
      <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
        <p className="text-lg font-bold mt-2">
          Début : {new Date(event.debut).toLocaleDateString()} <br/> 
          Fin : {new Date(event.fin).toLocaleDateString()}</p>
    </Link>
  );
}
