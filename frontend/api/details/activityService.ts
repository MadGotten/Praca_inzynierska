import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface ActivityProps {
  id: number;
  name: string;
  duration: any;
  date: string;
  pet: number;
  created_at: string;
}

export type ActivityInput = Pick<ActivityProps, "name" | "duration" | "date"> & {
  date: Date;
};

class AcitvityService {
  async getAll(pageParam: string, pet_id: number): Promise<CursorPaginatedProps<ActivityProps>> {
    try {
      const url = pageParam || `v1/pets/${pet_id}/records/activities/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(activity_id: number): Promise<ActivityProps> {
    try {
      const response = await axios.get(`v1/activities/${activity_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(activity_id: number, payload: ActivityInput) {
    try {
      const response = await axios.post(`v1/pets/${activity_id}/records/activities/`, {
        ...payload,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(activity_id: number, payload: ActivityInput) {
    try {
      const response = await axios.put(`v1/activities/${activity_id}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(activity_id: number) {
    try {
      const response = await axios.delete(`v1/activities/${activity_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new AcitvityService();
