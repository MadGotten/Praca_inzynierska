import axios from "@/api";
import { MemberProps } from "@/api/memberService";
import { PetProps } from "@/api/petService";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface FamilyProps {
  id: string;
  name: string;
  owner: string;
  members: Array<number>;
  pets: Array<number>;
  members_total: number;
  pets_total: number;
}

export interface FamilyDetailProps {
  id: string;
  name: string;
  owner: string;
  members: MemberProps[];
  pets: PetProps[];
}

class FamilyService {
  async getAll({ pageParam }: { pageParam: string }): Promise<CursorPaginatedProps<FamilyProps>> {
    try {
      const url = pageParam || "v1/family/";
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(id: number): Promise<FamilyDetailProps> {
    try {
      const response = await axios.get(`v1/family/${id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async create(name: string): Promise<FamilyProps> {
    try {
      const response = await axios.post(`v1/family/`, { name });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(id: number, name: string): Promise<FamilyProps> {
    try {
      const response = await axios.put(`v1/family/${id}/`, { name });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async delete(id: number) {
    try {
      const response = await axios.delete(`v1/family/${id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async getRole(id: number) {
    try {
      const response = await axios.get(`v1/family/${id}/role/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new FamilyService();
