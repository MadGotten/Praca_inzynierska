import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface VaccinationProps {
  id: number;
  name: string;
  description: string;
  date: string;
  pet: number;
  created_at: string;
}

export type VaccinationInput = Pick<VaccinationProps, "name" | "description" | "date"> & {
  date: Date;
};

class VaccinationService {
  async getAll(pageParam: string, pet_id: number): Promise<CursorPaginatedProps<VaccinationProps>> {
    try {
      const url = pageParam || `v1/pets/${pet_id}/records/vaccinations/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(vaccination_id: number): Promise<VaccinationProps> {
    try {
      const response = await axios.get(`v1/vaccinations/${vaccination_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(pet_id: number, payload: VaccinationInput) {
    try {
      const response = await axios.post(`v1/pets/${pet_id}/records/vaccinations/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(vaccination_id: number, payload: VaccinationInput) {
    try {
      const response = await axios.put(`v1/vaccinations/${vaccination_id}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(vaccination_id: number) {
    try {
      const response = await axios.delete(`v1/vaccinations/${vaccination_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new VaccinationService();
