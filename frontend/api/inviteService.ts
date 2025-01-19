import axios from "@/api";
import { CursorPaginatedProps } from "@/api/types/commonTypes";
import { handleApiError } from "@/api/handlers/errorHandler";

export interface InviteProps {
  id: string;
  invited: string;
  status: {
    name: string;
    label: string;
  };
  created_at: string;
}

export interface MeInviteProps {
  id: string;
  family: string;
  status: {
    name: string;
    label: string;
  };
  created_at: string;
}

class InviteService {
  async getFamilyAll(
    pageParam: string,
    family_id: number,
    status: string = "pending"
  ): Promise<CursorPaginatedProps<InviteProps>> {
    try {
      const url = pageParam || `v1/family/${family_id}/members/invites/?status=${status}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async getUserAll(pageParam: string): Promise<CursorPaginatedProps<MeInviteProps>> {
    try {
      const url = pageParam || `v1/me/invites/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async invite(family_id: string, username: string): Promise<InviteProps> {
    try {
      const response = await axios.post(`v1/family/${family_id}/members/invites/`, {
        user: username,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async getFamily(invite_id: number): Promise<InviteProps> {
    try {
      const response = await axios.get(`v1/invites/${invite_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async getUser(invite_id: number): Promise<MeInviteProps> {
    try {
      const response = await axios.get(`v1/me/invites/${invite_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async accept(invite_id: string): Promise<MeInviteProps> {
    try {
      const response = await axios.patch(`v1/me/invites/${invite_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async decline(invite_id: string): Promise<MeInviteProps> {
    try {
      const response = await axios.delete(`v1/me/invites/${invite_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }

  async deleteInvite(invite_id: string): Promise<InviteProps> {
    try {
      const response = await axios.delete(`v1/invites/${invite_id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Wystąpił problem, Spróbuj ponownie.");
    }
  }
}

export default new InviteService();
