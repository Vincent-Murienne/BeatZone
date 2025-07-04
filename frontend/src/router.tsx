import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MapPage from "./pages/MapPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BandDetailsPage from "./pages/BandDetailsPage";
// import LoginPage from "../pages/LoginPage";
// import Dashboard from "../pages/Dashboard";
// import ConcertsPage from "../pages/ConcertsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
            <Route path="/band/:id" element={<BandDetailsPage />} />
        </Routes>
        </BrowserRouter>
    );
}
