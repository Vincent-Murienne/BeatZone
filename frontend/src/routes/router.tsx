import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
// import LoginPage from "../pages/LoginPage";
// import Dashboard from "../pages/Dashboard";
// import ConcertsPage from "../pages/ConcertsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
        </BrowserRouter>
    );
}
