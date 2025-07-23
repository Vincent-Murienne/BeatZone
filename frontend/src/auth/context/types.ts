export type User = {
  id: string;
  email: string; 
  pseudo?: string;
  avatar_url?: string;
  bio?: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  saveUserToStorage: (userData: User | null) => void;
  getUserById: (id: string) => Promise<User | null>;
}; 