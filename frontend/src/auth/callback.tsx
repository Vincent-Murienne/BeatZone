import { useEffect, useState } from "react";
import supabase from "../register/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import type { User } from "./context/types";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { saveUserToStorage } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function handleAuth() {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (!session) {
                    console.error("Aucune session trouvée");
                    navigate("/login");
                    return;
                }

                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                if (user) {
                    const formattedUser: User = {
                        id: user.id,
                        email: user.email || '',
                        pseudo: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                        role: 'user',
                        avatar_url: user.user_metadata?.avatar_url,
                        bio: user.user_metadata?.bio || ''
                    };

                    saveUserToStorage(formattedUser);
                    navigate("/");
                } else {
                    throw new Error("Utilisateur non trouvé");
                }
            } catch (error) {
                console.error("Erreur lors de l'authentification:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        }

        handleAuth();
    }, [navigate, saveUserToStorage]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {loading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-600">Finalisation de la connexion...</p>
                </div>
            ) : (
                <p className="text-gray-600">Redirection en cours...</p>
            )}
        </div>
    );
}
