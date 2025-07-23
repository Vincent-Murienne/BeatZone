import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { addBandToFavorites, removeBandFromFavorites } from "../services/favoriteService";
import type { Band } from "../types/band";
import {
    FaSpotify,
    FaDeezer,
    FaYoutube,
    FaInstagram,
    FaFacebook,
    FaTiktok,
    FaGlobe
} from "react-icons/fa";

export default function BandDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [band, setBand] = useState<Band | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleAddFavorite = async () => {
        const userRaw = localStorage.getItem("beatzone_user");
        if (!userRaw) {
            alert("Vous devez être connecté pour ajouter un favori.");
            return;
        }
        let userId;
        try {
            userId = JSON.parse(userRaw).id;
        } catch {
            alert("Utilisateur invalide.");
            return;
        }
        try {
            await addBandToFavorites(userId, band.id_band);
            setIsFavorite(true);
            alert("Groupe ajouté aux favoris !");
        } catch (err: any) {
            if (err.message?.includes("duplicate key") || err.message?.includes("Déjà en favori")) {
                setIsFavorite(true);
                alert("Ce groupe est déjà dans vos favoris.");
            } else {
                alert("Erreur : " + (err.message || "Impossible d'ajouter le favori"));
            }
        }
    };
    const handleRemoveFavorite = async () => {
        const userRaw = localStorage.getItem("beatzone_user");
        if (!userRaw) {
            alert("Vous devez être connecté pour supprimer un favori.");
            return;
        }
        let userId;
        try {
            userId = JSON.parse(userRaw).id;
        } catch {
            alert("Utilisateur invalide.");
            return;
        }
        try {
            await removeBandFromFavorites(userId, band.id_band);
            setIsFavorite(false);
            alert("Groupe retiré des favoris !");
        } catch (err: any) {
            alert("Erreur : " + (err.message || "Impossible de retirer le favori"));
        }
    };
    useEffect(() => {
        const fetchBand = async () => {
            const API_URL = import.meta.env.VITE_API_URL;
        try {
                    const res = await axios.get(`${API_URL}/band/${id}`);
            setBand(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement du groupe :", error);
        } finally {
            setLoading(false);
        }
        };

        fetchBand();
    }, [id]);

    useEffect(() => {
    if (!band) return;
    const userRaw = localStorage.getItem("beatzone_user");
    if (!userRaw) return;
    let userId;
    try {
        userId = JSON.parse(userRaw).id;
    } catch {
        return;
    }
    // Vérifie si le groupe est déjà en favori
    fetch(`${import.meta.env.VITE_API_URL}/favorites/${userId}`)
        .then(res => res.json())
        .then(data => {
            const found = data.some((b: any) => b.id_band === band.id_band);
            setIsFavorite(found);
        });
}, [band]);

    if (loading) return <p>Chargement...</p>;
    if (!band) return <p>Groupe introuvable.</p>;

    const socialLinks = band.band_socials?.[0];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 flex justify-start">
            <button
                onClick={() => navigate("/map")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
                Retour à la liste
            </button>
        </div>
        <h1 className="text-3xl font-bold mb-4">{band.nom}</h1>
        <div className="mb-4">
            {isFavorite ? (
                <button
                    onClick={handleRemoveFavorite}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    ❌ Retirer des favoris
                </button>
            ) : (
                <button
                    onClick={handleAddFavorite}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                    💖 Ajouter aux favoris
                </button>
            )}
        </div>
        <img
            src={band.image_url}
            alt={band.nom}
            className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <p className="text-gray-700 mb-2">
            <strong>Description :</strong> {band.description}
        </p>
        <p className="text-gray-600 mb-2">
            <strong>Ville :</strong> {band.ville}, {band.pays}
        </p>
        <p className="text-gray-600 mb-4">
            <strong>Créé le :</strong>{" "}
            {new Date(band.cree_le).toLocaleDateString("fr-FR")}
        </p>

        {/* Genres musicaux */}
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Genres musicaux :</h2>
            {band.avoir && band.avoir.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {band.avoir.map((a, index) =>
                a.genre?.type_musique ? (
                    <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                    {a.genre.type_musique}
                    </span>
                ) : null
                )}
            </div>
            ) : (
            <p className="text-sm text-gray-500">Aucun genre renseigné.</p>
            )}
        </div>

        {/* Membres */}
        {band.member && band.member.length > 0 && (
            <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Membres du groupe :</h2>
            <ul className="space-y-4">
                {band.member.map((membre) => (
                <li
                    key={membre.id_member}
                    className="p-4 border rounded-lg shadow-sm bg-white"
                >
                    <div className="flex items-start gap-4">
                    {membre.image_url ? (
                        <img
                        src={membre.image_url}
                        alt={`${membre.prenom} ${membre.nom}`}
                        className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        N/A
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-base">
                        {membre.prenom} {membre.nom}
                        </p>
                        {membre.detenir?.length ? (
                        <p className="text-sm text-gray-600">
                            {membre.detenir
                            .map((d) => d.role?.instrument)
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        ) : (
                        <p className="text-sm text-gray-400 italic">
                            Aucun instrument renseigné
                        </p>
                        )}
                        <p className="text-sm mt-1 text-gray-500">{membre.bio}</p>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            
            </div>
        )}
        
        {/* Réseaux sociaux */}
        {socialLinks && (
            <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Réseaux sociaux :</h2>
            <div className="flex flex-wrap gap-4 text-2xl text-blue-600">
                {socialLinks.spotify_url && (
                <a href={socialLinks.spotify_url} target="_blank" rel="noreferrer">
                    <FaSpotify />
                </a>
                )}
                {socialLinks.deezer_url && (
                <a href={socialLinks.deezer_url} target="_blank" rel="noreferrer">
                    <FaDeezer />
                </a>
                )}
                {socialLinks.youtube_url && (
                <a href={socialLinks.youtube_url} target="_blank" rel="noreferrer">
                    <FaYoutube />
                </a>
                )}
                {socialLinks.instagram_url && (
                <a href={socialLinks.instagram_url} target="_blank" rel="noreferrer">
                    <FaInstagram />
                </a>
                )}
                {socialLinks.facebook_url && (
                <a href={socialLinks.facebook_url} target="_blank" rel="noreferrer">
                    <FaFacebook />
                </a>
                )}
                {socialLinks.tiktok_url && (
                <a href={socialLinks.tiktok_url} target="_blank" rel="noreferrer">
                    <FaTiktok />
                </a>
                )}
                {socialLinks.site_web_url && (
                <a href={socialLinks.site_web_url} target="_blank" rel="noreferrer">
                    <FaGlobe />
                </a>
                )}
            </div>
            </div>
        )}
        </div>
    );
}
