import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface NoteProps {
  id: number;
  name: string;
  description: string;
  pet: number;
  created_at: string;
}

export type NoteInput = Pick<NoteProps, "name" | "description">;

class NoteService {
  async getAll(pageParam: string, pet_id: number): Promise<CursorPaginatedProps<NoteProps>> {
    try {
      const url = pageParam || `v1/pets/${pet_id}/records/notes/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(note_id: number): Promise<NoteProps> {
    try {
      const response = await axios.get(`v1/notes/${note_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(pet_id: number, payload: NoteInput) {
    try {
      const response = await axios.post(`v1/pets/${pet_id}/records/notes/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(note_id: number, payload: NoteInput) {
    try {
      const response = await axios.put(`v1/notes/${note_id}/`, { ...payload });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(note_id: number) {
    try {
      const response = await axios.delete(`v1/notes/${note_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new NoteService();
