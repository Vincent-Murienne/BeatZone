import { useEffect, useState } from "react";
import supabase from "../register/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Session } from '@supabase/supabase-js'

export default function AuthCallback() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        async function handleAuth() {
            console.log("Début de la récupération de l'utilisateur");
            try {
                // Récupérer la session depuis l'URL de callback OAuth
                supabase.auth.getSession().then(({ data: { session } }) => {
                    setSession(session || null);
                });
                //     if(sessionError) throw sessionError;
                // console.log("Session récupérée depuis Supabase:", sessionData, sessionError);

                // if (!sessionData.session) {
                //     console.log("Aucune session trouvée dans l'URL - redirection vers login");
                //     setLoading(false);
                //     navigate("/login");
                //     return;
                // }

                // console.log("Session récupérée depuis l'URL:", sessionData.session);

                // Optionnel : récupérer les infos utilisateur
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                if (userData.user) {
                    console.log("Utilisateur connecté:", userData.user);
                    // Sauvegarde user dans contexte ou localStorage ici
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la session:", error);
                alert("Erreur lors de la récupération de la session");
            } finally {
                setLoading(false);
                console.log("Fin script callback et connexion google");
                navigate("/login"); // Redirige vers la home ou une autre page après connexion
            }
        }

        handleAuth();
    }, [navigate]);


    return (
        <div className="p-8 text-center">
            {loading ? <p>Connexion en cours...</p> : <p>Redirection...</p>}
        </div>
    );
}
