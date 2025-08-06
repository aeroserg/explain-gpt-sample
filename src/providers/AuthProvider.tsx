import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth/authStore";
import { AppRoutes } from "@/routes/AppRoutes";
import { SuspenseFallback } from "@/layouts/components";
import { AuthUser } from "@/api/contracts";

type TGUser = {
  id: number;
  username?: string;
  photo_url?: string;
  first_name: string;
  last_name?: string;
  auth_date: number;
  hash: string;
};

const loginWithTg = async (params: URLSearchParams): Promise<AuthUser> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/v2/users/tg/auth?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error();
  }

  return await response.json();
};

const authRoutes = [AppRoutes.Login, AppRoutes.Register];

export const AuthProvider = () => {
  const { auth, login, loginOAuth, setAuthError } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState(!auth);

  useEffect(() => {
    const isAuthRoute = authRoutes.includes(pathname as AppRoutes);
    const params = new URLSearchParams(location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const status = params.get("status");

    if (status === "409") {
      setAuthError("Пользователь с данным email уже зарегистрирован");
      setTimeout(() => setAuthError(undefined), 3000);
    }

    if (access_token && refresh_token) {
      loginOAuth({ access_token, refresh_token });
      navigate(isAuthRoute ? AppRoutes.Main : pathname);
      setIsChecking(false);
    }

    const processTgAuth = async (hash: string) => {
      const token = hash.replace("#tgAuthResult=", "");
      try {
        const { id, auth_date, ...rest }: TGUser = JSON.parse(atob(token));
        const params = new URLSearchParams({
          id: String(id),
          auth_date: String(auth_date),
          ...rest,
        });
        // TODO: Поменять на ContractService
        const res = await loginWithTg(params);
        login(res);
        navigate(AppRoutes.Main);
      } catch {
        setAuthError(
          "Ошибка авторизации через Telegram, попробуйте другой способ или повторите попытку позже"
        );
      } finally {
        setIsChecking(false);
      }
    };

    const hash = window.location.hash;

    if (hash.startsWith("#tgAuthResult=") && !auth) {
      processTgAuth(hash);
      return;
    }

    if (!auth) {
      navigate(isAuthRoute ? pathname : AppRoutes.Login);
      setIsChecking(false);
      return;
    }

    navigate(isAuthRoute ? AppRoutes.Main : pathname);
  }, [auth, pathname]);

  if (isChecking) {
    return <SuspenseFallback />;
  }

  return <Outlet />;
};
