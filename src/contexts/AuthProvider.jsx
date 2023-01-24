/**
 * Declaracion de dependencias
 */
import { createContext, useState } from "react";

const AuthContext = createContext({});

/**
 * Componente de Proveedor de Contexto de Autenticacion
 */
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;