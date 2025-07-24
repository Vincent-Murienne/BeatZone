import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import PublicRoute from '../auth/guards/PublicRoute'
import BandDetailsPage from '../pages/BandDetailsPage'
import ListBandPage from '../pages/ListBandPage'
import LandingPage from '../pages/LandingPage'
import MapPage from '../pages/MapPage'
import EventDetailsPage from '../pages/EventDetailsPage'
import ProtectedRoute from '../auth/guards/ProtectedRoute'
import ArtistDashboardPage from '../pages/ArtistDashboardPage'
import ArtistRoute from '../auth/guards/ArtistRoute'
import ProfilePage from '../pages/ProfilePage'
import AuthCallback from '../auth/callback'
import MainNavbar from '../components/Navbar/MainNavbar'
import EventsPage from '../pages/EventPage'
import CGU from '../components/LandingPage/CGU'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/cgu" element={<CGU />} />
                <Route path="/map" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <MapPage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/events" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <EventsPage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/event/:id" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <EventDetailsPage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/bands" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <ListBandPage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/band/:id" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <BandDetailsPage />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/artist-dashboard" element={
                    <ArtistRoute>
                        <>
                            <MainNavbar />
                            <ArtistDashboardPage />
                        </>
                    </ArtistRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <>
                            <MainNavbar />
                            <ProfilePage />
                        </>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
