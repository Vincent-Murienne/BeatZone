import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from '../register/register'
import Login from '../login/login'
import AuthCallback from '../auth/callback'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
