import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AuthUser } from "@/api/contracts";
import { jwtDecode } from "jwt-decode";
import { ContractService } from "@/api/apiService";
import { useTopicsStore } from "@/store/topics/topicsStore";
import { useChatStore } from "@/store/chat/chatStore";

const AUTH_LS_KEY = "egpt-user";

interface UserLoginSchema {
  auth: AuthUser | null;
  isRefreshing: boolean;
  refreshTimeout: ReturnType<typeof setTimeout> | null;
  _initialized: boolean;
  authError?: string;
  init: () => void;
  setAuthError: (err: string | undefined) => void;
  refresh: () => Promise<void>;
  logout: () => void;
  login: (auth: AuthUser) => void;
  loginOAuth: (tokens: { access_token: string; refresh_token: string }) => void;
  scheduleRefresh: (access: string) => void;
}

export const useAuthStore = create<UserLoginSchema>()(
  immer((set, get) => ({
    isRefreshing: false,
    auth: null,
    refreshTimeout: null,
    _initialized: false,
    setAuthError: (err) => {
      set((state) => {
        state.authError = err;
      });
    },
    loginOAuth: async (tokens) => {
      try {
        const res = await ContractService.api.getUserApiV2UsersSelfGet({
          headers: { "jwt-token": tokens.access_token },
        });
        const auth: AuthUser = { ...tokens, ...res.data };
        localStorage.setItem(AUTH_LS_KEY, JSON.stringify(auth));
        set((state) => {
          state.auth = auth;
        });
      } catch {
        set((state) => {
          state.authError =
            "Ошибка авторизации, попробуйте другой способ или повторите попытку позже";
        });
      }
    },
    init: () =>
      set((state) => {
        const auth = localStorage.getItem(AUTH_LS_KEY);
        if (auth) {
          state.auth = JSON.parse(auth);
          get().refresh();
        }
        state._initialized = true;
      }),
    logout: () => {
      const timeout = get().refreshTimeout;
      if (timeout) clearTimeout(timeout);
      set((state) => {
        state.auth = null;
      });
      localStorage.clear();

      useChatStore.getState().reset();
      useTopicsStore.getState().reset();
    },
    refresh: async () => {
      set((state) => {
        state.isRefreshing = true;
      });
      try {
        const auth = localStorage.getItem(AUTH_LS_KEY);
        if (!auth) {
          get().logout();
          return;
        }
        const { access_token, refresh_token } = JSON.parse(auth);
        const res =
          await ContractService.api.refreshTokenApiV2UsersTokenRefreshPost({
            headers: {
              "jwt-token": access_token,
              "refresh-token": refresh_token,
            },
          });
        if (!res.ok) {
          throw new Error();
        }
        const data = await res.json();
        const newToken = data.access_token;
        set((state) => {
          if (state.auth) {
            state.auth.access_token = data.access_token;
          }
        });
        get().scheduleRefresh(newToken);
      } catch {
        get().logout();
      } finally {
        set((state) => {
          state.isRefreshing = false;
        });
      }
    },
    scheduleRefresh: (accessToken: string) => {
      const { exp } = jwtDecode(accessToken);
      if (exp) {
        const delay = exp * 1000 - new Date().getTime();
        const refreshTimeout = setTimeout(() => {
          get().refresh();
        }, delay);
        set({ refreshTimeout });
      }
    },
    login: (auth: AuthUser) => {
      localStorage.setItem(AUTH_LS_KEY, JSON.stringify(auth));
      set((state) => {
        state.auth = auth;
      });
      get().scheduleRefresh(auth.access_token);
    },
  }))
);
