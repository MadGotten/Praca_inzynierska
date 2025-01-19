import axios from "@/api";
import Axios, { AxiosError } from "axios";
import { useTokenStore } from "@/store/tokenStore";
import { handleApiError } from "@/api/handlers/errorHandler";

interface userProps {
  username: string;
  password: string;
}

interface userRegisterProps extends userProps {
  email: string;
}

interface userVerifyProps {
  email: string;
  code: string;
}

export const loginUser = async ({ username, password }: userProps) => {
  try {
    const response = await axios.post("v1/users/login/", { username, password });
    return response.data;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      if (error.response) {
        throw new AxiosError(
          error.response.data || "Niespodziewany błąd",
          error.response.status.toString()
        );
      }
    }
    throw new Error("Wystąpił problem, Spróbuj ponownie.");
  }
};

export const registerUser = async ({ username, email, password }: userRegisterProps) => {
  try {
    const response = await axios.post("v1/users/register/", { username, email, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Wystąpił problem, Spróbuj ponownie.");
  }
};

export const verifyUser = async ({ email, code }: userVerifyProps) => {
  try {
    const response = await axios.post("v1/users/verify/", { email, code });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Wystąpił problem, Spróbuj ponownie.");
  }
};

export const resendVerifyUser = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post("v1/users/verify/resend/", { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Wystąpił problem, Spróbuj ponownie.");
  }
};

export const getRefreshToken = async () => {
  const refresh = useTokenStore.getState().refresh;
  try {
    const response = await axios.post("v1/token/refresh/", { refresh });
    if (response.status === 200) {
      useTokenStore.getState().setAllTokens(response.data);
      return response.data.access;
    } else if (response.status === 401) {
      useTokenStore.getState().clearTokens();
    }
  } catch (error) {
    return;
  }
};

export const logoutUser = async () => {
  useTokenStore.getState().clearTokens();
};
