import { useContext } from "react";
import AuthContext from "./AuthContext";
import type { AuthContextType } from "./types";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}; 