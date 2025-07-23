import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { ReactNode } from 'react';
import type { UserRole } from '../../types/role';
import type { User } from '../context/types';
import { useEffect, useState } from 'react';

interface ArtistRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ArtistRoute({ children, redirectTo = '/login' }: ArtistRouteProps) {
  const { user, loading, getUserById } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUserData = async () => {
    if (user?.id) {
      const userData = await getUserById(user.id);
      setUserData(userData)
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  const userRole = userData?.role as UserRole;
  if (userRole !== 'artist') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-4">
            Cette section est réservée aux artistes. Vous n'avez pas les permissions nécessaires pour y accéder.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 