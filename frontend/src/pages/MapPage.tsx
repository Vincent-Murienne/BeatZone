// pages/MapPage.tsx
import { useState } from "react";
import Mapbox from "../components/MapComponent";
import EventModal from "../components/EventModal";
import type { Event } from "../types/event";

export default function MapPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <main>
            <Mapbox onEventSelect={(event) => setSelectedEvent(event)} />
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </main>
    );
}
