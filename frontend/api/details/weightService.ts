import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface WeightProps {
  id: number;
  date: string;
  weight: string;
  pet: number;
  created_at: string;
}

export type WeightInput = Pick<WeightProps, "date" | "weight"> & {
  date: Date;
};

class WeightService {
  async getAll(pageParam: string, pet_id: number): Promise<CursorPaginatedProps<WeightProps>> {
    try {
      const url = pageParam || `v1/pets/${pet_id}/records/weights/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(weight_id: number): Promise<WeightProps> {
    try {
      const response = await axios.get(`v1/weights/${weight_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(pet_id: number, payload: WeightInput) {
    try {
      const response = await axios.post(`v1/pets/${pet_id}/records/weights/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(weight_id: number, payload: WeightInput) {
    try {
      const response = await axios.put(`v1/weights/${weight_id}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(weight_id: number) {
    try {
      const response = await axios.delete(`v1/weights/${weight_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new WeightService();
