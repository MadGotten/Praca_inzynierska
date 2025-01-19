import Axios, { AxiosError } from "axios";

export const handleApiError = (error: any) => {
  if (Axios.isAxiosError(error)) {
    if (error.response) {
      const errorMessage = error.response.data.detail || error.response.data;
      throw new AxiosError(errorMessage || "Niespodziewany błąd");
    }
  }
};
