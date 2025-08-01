import LoginForm from "../login/LoginForm";
import supabase from '../register/supabaseClient';

const LoginPage = () => {
    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback'
            }
        })

        if (error) {
            alert('Erreur OAuth: ' + error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue</h1>
                    <p className="text-sm text-gray-600">Connectez-vous à votre compte</p>
                </div>
                <LoginForm />
                {/* Lien vers la connexion */}
                <p className="text-center text-gray-600 text-sm mt-8">
                    Pas de compte ?{' '}
                    <a href="/register" className="text-purple-600 hover:text-purple-500 transition-colors font-medium">
                        Créer un compte
                    </a>
                </p>
                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
                {/* Boutons sociaux */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        onClick={handleGoogleSignup}
                    >
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
            </div>
        </div>
    )
}

export default LoginPage