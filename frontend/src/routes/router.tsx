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
                {/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
                <Route path="/" element={
                    <LandingPage />
                } />
                <Route path="/map" element={
                    <ProtectedRoute>
                        <MapPage />
                    </ProtectedRoute>
                } />
                <Route path="/event/:id" element={
                    <ProtectedRoute>
                        <EventDetailsPage />
                    </ProtectedRoute>
                } />
                <Route path="/list-band" element={
                    <ProtectedRoute>
                        <ListBandPage />
                    </ProtectedRoute>
                } />
                <Route path="/band/:id" element={
                    <ProtectedRoute>
                        <BandDetailsPage />
                    </ProtectedRoute>
                } />
                <Route path="/artist-dashboard" element={
                    <ArtistRoute>
                        <ArtistDashboardPage />
                    </ArtistRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />

                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
