import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/event";
import EventDetails from "../components/EventDetails";

const API_URL = import.meta.env.VITE_API_URL;

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
        try {
            const res = await fetch(`${API_URL}/event/${id}`);
            const data = await res.json();
            setEvent(data);
        } catch (err) {
            console.error("Erreur lors du chargement de l'événement :", err);
        }
        };
        fetchEvent();
    }, [id]);

    if (!event) return <p className="p-4">Chargement de l'événement...</p>;

    return (
        <div>
        <div className="max-w-4xl mx-auto p-6">
            <div className="p-4 flex justify-start">
            <button
                onClick={() => navigate("/map")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
                Retour à la liste
            </button>
            </div>

            <EventDetails
            event={event}
            showInfosComplementaires={true}
            showArtists={true}
            showActions={true}
            showViewMoreButton={false}
            />
        </div>
        </div>
    );
}
