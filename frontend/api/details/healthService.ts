import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface HealthProps {
  id: number;
  name: string;
  description: string;
  place: string;
  date: string;
  pet: number;
  created_at: string;
}

export type HealthInput = Pick<HealthProps, "name" | "description" | "place" | "date"> & {
  date: Date;
};

class HealthService {
  async getAll(pageParam: string, pet_id: number): Promise<CursorPaginatedProps<HealthProps>> {
    try {
      const url = pageParam || `v1/pets/${pet_id}/records/health/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(health_id: number): Promise<HealthProps> {
    try {
      const response = await axios.get(`v1/health/${health_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(pet_id: number, payload: HealthInput) {
    try {
      const response = await axios.post(`v1/pets/${pet_id}/records/health/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(health_id: number, payload: HealthInput) {
    try {
      const response = await axios.put(`v1/health/${health_id}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(health_id: number) {
    try {
      const response = await axios.delete(`v1/health/${health_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new HealthService();
