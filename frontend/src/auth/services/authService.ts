import { apiFetch } from "./api";
import type { User } from "../context/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiFetch<{ user: User; message: string }>(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Une erreur est survenue lors de la connexion");
  }
};
export const getUserById = async (id: string) => {
  try {
    const response = await apiFetch<User>(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Une erreur est survenue lors de la récupération de l'utilisateur");
  }
};


export const signup = async (email: string, password: string) => {
  return await apiFetch("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async () => {
  try {
    await apiFetch(`${API_URL}/logout`, {
      method: "POST",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Une erreur est survenue lors de la déconnexion");
  }
};

let authChangeCallback: ((user: User | null) => void) | null = null;

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  authChangeCallback = callback;
  return () => {
    authChangeCallback = null;
  };
}; 