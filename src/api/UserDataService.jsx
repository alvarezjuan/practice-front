/**
 * Declaracion de dependencias
 */
import backend from "./backend";

/**
 * Componente de Acceso a API de /api/users
 */
class UserDataService {

    async auth(email, pwd) {
        const response = await backend.post("/users/auth",
            JSON.stringify({ email, pwd })
        );
        return response?.data;
    }
};

export default new UserDataService();