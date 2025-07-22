import type { Event } from "../types/event";
import { Link } from "react-router-dom";

type EventCardProps = {
    events: Event[];
};

export default function EventCard({ events }: EventCardProps) {
    if (!events || events.length === 0) return null;

    return (
        <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Événements du groupe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map((event) => (
            <Link
                to={`/event/${event.id_event}`}
                key={event.id_event}
                className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
            >
                <img
                src={event.image_url}
                alt={event.titre}
                className="w-full h-48 object-cover rounded-xl mb-3"
                />
                <h3 className="text-lg font-bold">{event.titre}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
            </Link>
            ))}
        </div>
        </div>
    );
}
