// src/components/EventDetails.tsx
import type { Event } from "../types/event";
import { addToFavorites } from "../services/favoriteService";
import  supabase  from "../register/supabaseClient";
import React, { useState, useEffect } from "react";



interface EventDetailsProps {
    event: Event;
    showInfosComplementaires?: boolean;
    showArtists?: boolean;
    showActions?: boolean;
    showViewMoreButton?: boolean;
}

function formatHour(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
}

function extractGenresFromEvent(event: Event): string[] {
    const genres = new Set<string>();

    event.jouer?.forEach((passage) => {
        passage.band?.avoir?.forEach((a) => {
            const genre = a.genre?.type_musique;
            if (genre) genres.add(genre);
        });
    });

    return Array.from(genres);
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

export default function EventDetails({
    event,
    showInfosComplementaires = false,
    showArtists = true,
    showActions = true,
    showViewMoreButton = true,
}: EventDetailsProps) {
    const status = getEventStatus(event);
    const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      setUserId(data.user.id);
    } else {
      setUserId(null);
    }
  };

  fetchUser();
}, []);

    return (
        <>
        <img src={event.image_url} alt={event.titre} className="w-full h-60 object-cover" />
        <div className="p-6 space-y-2">
            <h2 className="text-2xl font-bold">{event.titre}</h2>

            {status && (
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                <span>{status.emoji}</span>
                <span>{status.label}</span>
            </div>
            )}

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
            <p>
                <span className="font-semibold">🎭 Genre :</span>{" "}
                {extractGenresFromEvent(event).join(", ") || "Non spécifié"}
            </p>
            <p>
                <span className="font-semibold">💸 Entrée :</span>{" "}
                {event.prix > 0 ? `${event.prix} €` : <span className="text-green-600 font-semibold">Gratuit</span>}
            </p>

            {showArtists && event.jouer && event.jouer.length > 0 && (
            <div>
                <p className="font-semibold">🎤 Artiste(s) :</p>
                <ul className="pl-4 list-disc">
                {event.jouer.map(({ band, debut_passage, fin_passage }) => (
                    <li key={band.id_band}>
                    {band.nom}
                    {(debut_passage && fin_passage) && (
                        <> — {formatHour(new Date(debut_passage))} → {formatHour(new Date(fin_passage))}</>
                    )}
                    </li>
                ))}
                </ul>
            </div>
            )}

            </div>

            {showInfosComplementaires && event.infos_complementaires && (
            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-1">ℹ️ Infos complémentaires :</h3>
                <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                {event.infos_complementaires}
                </div>
            </div>
            )}

            {showActions && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mt-4">
                <a
                    onClick={() => {
                        const bandId = event.jouer?.[0]?.band?.id_band;
                        if (!bandId) {
                        console.error("Aucun groupe trouvé pour cet événement");
                        return;
                        }

                        addToFavorites(userId, bandId)
                        .then(() => alert("Ajouté aux favoris !"))
                        .catch((err) => alert("Erreur : " + err?.response?.data?.error || err.message));
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    >
                    💖 Je suis intéressé
                </a>

                {showViewMoreButton && (
                    <a
                        href={`/event/${event.id_event}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        🔎 Voir plus d'infos
                    </a>
                )}

                <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                🗺️ Itinéraire
                </a>
            </div>
            )}
        </div>
        </>
    );
}