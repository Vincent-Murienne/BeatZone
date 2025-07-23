import { useState } from 'react';
import './register.css';
import supabase from './supabaseClient';

function Register() {

    const [userType, setUserType] = useState<'artist' | 'user' | 'owner' | null>(null);
    const [step, setStep] = useState(1);

    // Étape 2 states
    const [artistEmail, setArtistEmail] = useState('');
    const [artistPassword, setArtistPassword] = useState('');
    const [artistMemberName, setArtistMemberName] = useState('');

    const [userPseudo, setUserPseudo] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPassword, setOwnerPassword] = useState('');
    const [ownerLastName, setOwnerLastName] = useState('');
    const [ownerFirstName, setOwnerFistName] = useState('');

    // Étape 3 states
    const [artistNameBand, setArtistNameBand] = useState('');
    const [artistMusic, setArtistMusic] = useState('');
    const [artistVille, setArtisteville] = useState('');
    const [artistPays, setArtistPays] = useState('');

    const [ownerBusinessName, setOwnerBusinessName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerVille, setOwnerVille] = useState('');
    const [ownerCp, setOwnerCp] = useState('');



    console.log('userType:', userType);
    // Soumission du formulaire
    const handleSubmit = async () => {
        // Construire l'objet avec les données selon le type d'utilisateur

        console.log('Submitting form...');

        let payload;

        if (userType === 'artist') {
            payload = {
                type: 'artist',
                pseudo: artistMemberName,
                email: artistEmail,
                password: artistPassword,
                bandName: artistNameBand,
                music: artistMusic,
                city: artistVille,
                country: artistPays,
            };
        } else if (userType === 'user') {
            payload = {
                type: 'user',
                pseudo: userPseudo,
                email: userEmail,
                password: userPassword,
            };
        } else if (userType === 'owner') {

            payload = {
                type: 'owner',
                pseudo: ownerFirstName + ' ' + ownerLastName,
                email: ownerEmail,
                password: ownerPassword,
                businessName: ownerBusinessName,
                address: ownerAddress,
                city: ownerVille,
                postalCode: ownerCp,
            };

        } else {

            return; // Pas de type sélectionné
        }

        console.log('Payload:', payload);
        try {
            const response = await fetch(`http://localhost:3000/api/register`, {
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
            alert('Inscription réussie !');
            // Eventuellement rediriger ou reset le formulaire
        } catch (error) {
            alert('Erreur réseau ou serveur');
            console.error(error);
        }

    };

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
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative">
                {/* Arrière-plan bulles */}
                <div className="absolute inset-0 overflow-hidden z-0">
                    <div className="absolute w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl -top-20 -left-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
                    <div className="absolute w-64 h-64 bg-indigo-200 rounded-full opacity-30 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
                </div>

                {/* Contenu principal */}
                <div className="relative w-full max-w-3xl min-w-[800px] z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"></div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Inscription</h1>
                            <p className="text-gray-600">Créez votre compte BeatZone</p>
                        </div>

                        {/* Étapes d'inscription */}
                        <form method="POST" className="space-y-6">
                            {step === 1 && (
                                <div>
                                    <p className="font-medium mb-4 text-center">Vous êtes :</p>
                                    <div className="flex flex-col space-y-4">
                                        <label className={`w-full h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2 
                                ${userType === 'artist'
                                                ? 'bg-purple-100 text-black border-purple-800 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)]'
                                                : 'bg-gray-100 text-black border-transparent'}`}>
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="artist"
                                                className="hidden"
                                                checked={userType === 'artist'}
                                                onChange={() => setUserType('artist')}
                                            />
                                            Un groupe / artiste
                                        </label>
                                        <label className={`w-full h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2 
                                ${userType === 'user'
                                                ? 'bg-purple-100 text-black border-purple-800 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)]'
                                                : 'bg-gray-100 text-black border-transparent'}`}>
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="user"
                                                className="hidden"
                                                checked={userType === 'user'}
                                                onChange={() => setUserType('user')}
                                            />
                                            Un utilisateur
                                        </label>
                                        <label className={`w-full h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2 
                                ${userType === 'owner'
                                                ? 'bg-purple-100 text-black border-purple-800 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)]'
                                                : 'bg-gray-100 text-black border-transparent'}`}>
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="owner"
                                                className="hidden"
                                                checked={userType === 'owner'}
                                                onChange={() => setUserType('owner')}
                                            />
                                            Un organisateur
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        disabled={!userType}
                                        className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <>
                                    {userType === 'artist' ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Nom du groupe"
                                                value={artistMemberName}
                                                onChange={(e) => setArtistMemberName(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Adresse email"
                                                value={artistEmail}
                                                onChange={(e) => setArtistEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                autoComplete='new-email'
                                                required
                                            />
                                            <input
                                                type="password"
                                                placeholder="Mot de passe"
                                                value={artistPassword}
                                                onChange={(e) => setArtistPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                autoComplete='new-password'
                                                required
                                            />
                                        </>
                                    ) : userType === 'user' ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Pseudo"
                                                value={userPseudo}
                                                onChange={(e) => setUserPseudo(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Adresse email"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                autoComplete='new-email'
                                                required
                                            />
                                            <input
                                                type="password"
                                                placeholder="Mot de passe"
                                                value={userPassword}
                                                onChange={(e) => setUserPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                autoComplete='new-password'
                                                required
                                            />
                                        </>
                                    ) : userType === 'owner' ? (
                                        <>
                                            {/* À compléter pour owner */}
                                            <div className="flex gap-4 mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={ownerFirstName}
                                                    onChange={(e) => setOwnerFistName(e.target.value)}
                                                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={ownerLastName}
                                                    onChange={(e) => setOwnerLastName(e.target.value)}
                                                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={ownerEmail}
                                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                    autoComplete='new-email'
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={ownerPassword}
                                                    onChange={(e) => setOwnerPassword(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                                    autoComplete='new-password'
                                                    required
                                                />
                                            </div>
                                        </>

                                    ) : null}

                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 text-sm text-gray-600 hover:underline"
                                        >
                                            Retour
                                        </button>

                                        {userType === 'user' ? (
                                            <button
                                                type="submit"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSubmit();
                                                }}
                                                className="py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                            >
                                                Créer un compte
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setStep(3)}
                                                disabled={!userType}
                                                className="py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                            >
                                                Suivant
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    {userType === 'artist' ? (
                                        <>
                                            <div className="mb-4">
                                                <textarea
                                                    placeholder="Nom du groupe"
                                                    value={artistNameBand}
                                                    onChange={(e) => setArtistNameBand(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    rows={4}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Genre musical"
                                                    value={artistMusic}
                                                    onChange={(e) => setArtistMusic(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Ville"
                                                    value={artistVille}
                                                    onChange={(e) => setArtisteville(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Pays"
                                                    value={artistPays}
                                                    onChange={(e) => setArtistPays(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>

                                            {/* Ajoute d'autres réseaux si besoin */}
                                        </>
                                    ) : userType === 'owner' ? (
                                        <>
                                            {/* À compléter selon ce que tu veux pour owner */}
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Nom de l'établissement"
                                                    value={ownerBusinessName}
                                                    onChange={(e) => setOwnerBusinessName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Adresse"
                                                    value={ownerAddress}
                                                    onChange={(e) => setOwnerAddress(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Ville"
                                                    value={ownerVille}
                                                    onChange={(e) => setOwnerVille(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Code postal"
                                                    value={ownerCp}
                                                    onChange={(e) => setOwnerCp(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </>
                                    ) : null}

                                    <div className="flex justify-between mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-4 py-2 text-sm text-gray-600 hover:underline"
                                        >
                                            Retour
                                        </button>
                                        <button
                                            type="submit"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit();
                                            }}
                                            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        >
                                            Créer un compte
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>

                        {/* Lien vers la connexion */}
                        <p className="text-center text-gray-600 text-sm mt-8">
                            Déjà un compte ?{' '}
                            <a href="/login" className="text-purple-600 hover:text-purple-500 transition-colors font-medium">
                                Se connecter
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
            </div >
        </>
    );
}

export default Register;
