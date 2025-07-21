interface StatusEvenementFilterProps {
    value: "all" | "current" | "upcoming";
    onChange: (value: "all" | "current" | "upcoming") => void;
}

export default function StatusEvenementFilter({ value, onChange }: StatusEvenementFilterProps) {
    return (
        <div>
            <label htmlFor="status-filter" className="sr-only">Filtrer par statut</label>
            <select
                id="status-filter"
                value={value}
                onChange={(e) => onChange(e.target.value as "all" | "current" | "upcoming")}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
            >
                <option value="all">Tous les événements</option>
                <option value="current">En cours</option>
                <option value="upcoming">À venir</option>
            </select>
        </div>
    );
}
