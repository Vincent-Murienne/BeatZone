import type { Band } from "../types/band";
import { Link } from "react-router-dom";

type BandCardProps = {
    bands: Band[];
};

export default function BandCard({ bands }: BandCardProps) {
    if (!bands || bands.length === 0) return null;

    return (
        <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Artistes / Groupes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bands.map((band) => (
            <Link
                to={`/band/${band.id_band}`}
                key={band.id_band}
                className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
            >
                <img
                src={band.image_url}
                alt={band.nom}
                className="w-full h-48 object-cover rounded-xl mb-3"
                />
                <h3 className="text-lg font-bold">{band.nom}</h3>
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
            </Link>
            ))}
        </div>
        </div>
    );
}
