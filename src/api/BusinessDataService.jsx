/**
 * Declaracion de dependencias
 */
import backend from "./backend";

/**
 * Componente de Acceso a API de /api/business
 */
class BusinessDataService {

    async getAll() {
        const response = await backend.get('/business');
        return response?.data.business;
    }

    async getBusinessAndProducts() {
        const response = await backend.get('/business/bap');
        return response?.data.business;
    }

    async postEmailBusinessAndProducts(data) {
        const response = await backend.post('/business/bap2mail',
            JSON.stringify(data)
        );
        return response?.data;
    }

    async get(id) {
        const response = await backend.get(`/business/${id}`);
        return response?.data;
    }

    async create(data) {
        const response = await backend.post(`/business`,
            JSON.stringify(data)
        );
        return response?.data;
    }

    async update(id, data) {
        const response = await backend.put(`/business/${id}`,
            JSON.stringify(data)
        );
        return response?.data;
    }

    async delete(id) {
        const response = await backend.delete(`/business/${id}`);
        return response?.data;
    }
};

export default new BusinessDataService();