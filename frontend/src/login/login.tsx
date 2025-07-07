import { useState } from 'react';
import './login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async () => {

        if (!email || !password) return;

        setIsLoading(true);

        console.log('Login form submitted');
        let payload;
        payload = {
            email: email,
            password: password
        }

        try {
            const response = await fetch(`http://localhost:3000/api/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Gérer les erreurs
                const errorData = await response.json();
                alert('Erreur : ' + errorData.message);
                return;
            }

            const data = await response.json();

            // Sauvegarder l'access_token
            localStorage.setItem('access_token', data.session.access_token);
            console.log('Access token saved:', data.session.access_token);

            alert('Connexion réussie !');

        } catch (error) {
            alert('Erreur réseau ou serveur');
            console.error(error);
        }

    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
                {/* Effet de particules en arrière-plan */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl -top-20 -left-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
                    <div className="absolute w-64 h-64 bg-indigo-200 rounded-full opacity-30 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
                </div>

                {/* Conteneur principal */}
                <div className="relative w-full max-w-3xl min-w-[800px]">
                    {/* Carte de connexion */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                                {/* <User className="w-8 h-8 text-white" /> */}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h1>
                            <p className="text-gray-600">Accédez à votre compte</p>
                        </div>

                        {/* Formulaire */}
                        <div className="space-y-6">
                            {/* Champ Email */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {/* <Mail className="w-5 h-5 text-gray-500" /> */}
                                </div>
                                <input
                                    type="email"
                                    placeholder="Adresse email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="new-email"
                                    required
                                />
                            </div>

                            {/* Champ Mot de passe */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {/* <Lock className="w-5 h-5 text-gray-500" /> */}
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mot de passe"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} */}
                                </button>
                            </div>

                            {/* Options */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mr-2 rounded border-gray-300 bg-gray-50 text-purple-500 focus:ring-purple-500 focus:ring-2"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Se souvenir de moi
                                </label>
                                <a href="#" className="text-purple-600 hover:text-purple-500 transition-colors">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            {/* Bouton de connexion */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || !email || !password}
                                className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Connexion...
                                    </div>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">ou</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Boutons sociaux */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button className="flex items-center justify-center py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Lien inscription */}
                        <p className="text-center text-gray-600 text-sm">
                            Pas encore de compte ?{' '}
                            <a href="/register" className="text-purple-600 hover:text-purple-500 transition-colors font-medium">
                                S'inscrire
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Login;