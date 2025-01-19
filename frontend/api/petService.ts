import axios from "@/api";
import { CursorPaginatedProps, PagePaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface PetProps {
  id: string;
  name: string;
  species: string;
  breed: string;
  description?: string;
  date_of_birth: any;
  weight: string;
}

export interface PetDetailProps extends PetProps {
  health: Array<number>;
  vaccinations: Array<number>;
  notes: Array<number>;
  weights: Array<string>;
  activities: Array<number>;
}

export interface DetailsItem {
  id: number;
  pet: number;
  name: string;
  detail_type: string;
  created_at: string;
}

export type PetCreateProps = Omit<PetProps, "id">;
export type PetEditProps = Omit<PetProps, "id" | "weight">;

class PetService {
  async getAll(
    pageParam: string,
    family_id: number
  ): Promise<CursorPaginatedProps<PetDetailProps>> {
    try {
      const url = pageParam || `v1/family/${family_id}/pets/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(pet_id: number): Promise<PetDetailProps> {
    try {
      const response = await axios.get(`v1/pets/${pet_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(id: number, payload: PetCreateProps): Promise<PetProps> {
    try {
      const response = await axios.post(`v1/family/${id}/pets/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(petId: number, payload: PetEditProps): Promise<PetDetailProps> {
    try {
      const response = await axios.put(`v1/pets/${petId}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(petId: number) {
    try {
      const response = await axios.delete(`v1/pets/${petId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async getRecords({
    pageParam,
    petId,
    limit,
  }: {
    pageParam?: string;
    petId: number;
    limit?: number;
  }): Promise<PagePaginatedProps<DetailsItem>> {
    try {
      let url = pageParam || `v1/pets/${petId}/records/`;
      if (limit) {
        url += `?limit=${limit}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new PetService();
