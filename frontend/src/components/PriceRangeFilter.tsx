import type { FC } from "react";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
    onChange: (range: [number, number]) => void;
    defaultMin?: number;
    defaultMax?: number;
}

const PriceRangeFilter: FC<PriceRangeFilterProps> = ({
    onChange,
    defaultMin = 0,
    defaultMax = 100,
}) => {
    const [min, setMin] = useState(defaultMin);
    const [max, setMax] = useState(defaultMax);

    useEffect(() => {
        onChange([min, max]);
    }, [min, max, onChange]);

    return (
        <div className="bg-white p-3 rounded-lg shadow-md text-sm w-60 space-y-2">
        <div className="font-medium text-gray-700">Filtrer par prix (€)</div>
        <div className="flex items-center justify-between space-x-2">
            <input
            type="number"
            value={min}
            min={0}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Min"
            />
            <span className="text-gray-500">—</span>
            <input
            type="number"
            value={max}
            min={0}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Max"
            />
        </div>
        </div>
    );
};

export default PriceRangeFilter;
