import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Band } from "../types/band";

export default function BandDetailsPage() {
    const { id } = useParams();
    const [band, setBand] = useState<Band | null>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchBand = async () => {
            try {
                const res = await fetch(`${API_URL}/band/${id}`);
                const data = await res.json();
                setBand(data);
            } catch (err) {
                console.error("Erreur lors du chargement du groupe :", err);
            }
        };
        fetchBand();
    }, [id, API_URL]);

    if (!band) return <p>Chargement...</p>;

    return (
        <div className="p-4">
        <img
            src={band.image_url}
            alt={band.nom}
            className="w-full h-64 object-cover rounded-xl mb-4"
        />
        <h1 className="text-3xl font-bold">{band.nom}</h1>
        <p className="text-gray-600">{band.genre}</p>
        <p className="mt-4">{band.description}</p>
        </div>
    );
}
