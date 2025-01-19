import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface MemberProps {
  id: string;
  role: number;
  user: string;
}

class MemberService {
  async getAll(pageParam: string, family_id: number): Promise<CursorPaginatedProps<MemberProps>> {
    try {
      const url = pageParam || `v1/family/${family_id}/members/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async get(member_id: number): Promise<MemberProps> {
    try {
      const response = await axios.get(`v1/members/${member_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async update(member_id: number, role: number): Promise<MemberProps> {
    try {
      const response = await axios.put(`v1/members/${member_id}/`, { role });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new MemberService();
