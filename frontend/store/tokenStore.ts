import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface Tokens {
  access: string;
  refresh: string;
}

export interface TokenStore {
  access: string | null;
  refresh: string | null;
  user?: any;
  setAccessToken: (access: string) => void;
  setAllTokens: ({ access, refresh }: Tokens) => void;
  clearTokens: () => void;
}

export interface DecodedJWT extends JwtPayload {
  token_type: string;
  user_id: number;
  username?: string;
  email?: string;
}

const TokenStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await deleteItemAsync(name);
  },
};

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      access: "",
      refresh: "",
      user: null,
      setAccessToken: (access: string) => set({ access: access }),
      setAllTokens: ({ access, refresh }: Tokens) => {
        const jwt = jwtDecode<DecodedJWT>(refresh);
        const user = {
          id: jwt.user_id,
          username: jwt.username || null,
          email: jwt.email || null,
        };
        set({ access: access, refresh: refresh, user: user });
      },
      clearTokens: () => set({ access: null, refresh: null, user: null }),
    }),
    {
      name: "tokenStorage",
      storage: createJSONStorage(() => TokenStorage),
    }
  )
);
