import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import AuthCallback from '../auth/callback'
import PublicRoute from '../auth/guards/PublicRoute'
import ProtectedRoute from '../auth/guards/ProtectedRoute'
import MainPage from '../pages/MainPage'

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
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
