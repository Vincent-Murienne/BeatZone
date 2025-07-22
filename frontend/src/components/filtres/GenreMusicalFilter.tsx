interface GenreMusicalFilterProps {
    value: string;
    genres: string[];
    onChange: (value: string) => void;
}

export default function GenreMusicalFilter({ value, genres, onChange }: GenreMusicalFilterProps) {
    return (
        <div>
            <label htmlFor="genre-filter" className="sr-only">Filtrer par genre</label>
            <select
                id="genre-filter"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
            >
                <option value="all">Tous les genres</option>
                {genres.map((genre) => (
                <option key={genre} value={genre}>
                    {genre}
                </option>
                ))}
            </select>
        </div>
    );
}
