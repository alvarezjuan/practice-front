/**
 * Declaracion de dependencias
 */
import backend from "./backend";

/**
 * Componente de Acceso a API de /api/products
 */
class BusinessDataService {

    async getAll(id) {
        const response = await backend.get(`/products/forbusiness/${id}`);
        return response?.data.products;
    }

    async get(id) {
        const response = await backend.get(`/products/${id}`);
        return response?.data;
    }

    async create(id, data) {
        const response = await backend.post(`/products/forbusiness/${id}`,
            JSON.stringify(data)
        );
        return response?.data;
    }

    async update(id, data) {
        const response = await backend.put(`/products/${id}`,
            JSON.stringify(data)
        );
        return response?.data;
    }

    async delete(id) {
        const response = await backend.delete(`/products/${id}`);
        return response?.data;
    }
};

export default new BusinessDataService();