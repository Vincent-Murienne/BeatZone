import LoginForm from "../login/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue</h1>
                    <p className="text-sm text-gray-600">Connectez-vous à votre compte</p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage