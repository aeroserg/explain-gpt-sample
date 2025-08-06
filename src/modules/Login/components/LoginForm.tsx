import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { ContractService } from "@/api/apiService";
import { LoginUserRequest, UserProviderType } from "@/api/contracts/contract";
import TelegramIcon from "@/assets/icons/telegram-icon-2.svg?react";
import YandexIcon from "@/assets/icons/yandex-icon.svg?react";
// import VKIcon from "@/assets/icons/vk-icon.svg?react";
import GoogleIcon from "@/assets/icons/google-icon.svg?react";
import { Loader } from "@/components/ui/loader";
import { Button, Divider, Input } from "@/libs/ui";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/store/auth/authStore";

export interface UserAuthForm extends LoginUserRequest {
  name: string;
  confirm?: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isValid },
  } = useForm<UserAuthForm>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const redirectUri = location.origin;

  useEffect(() => {
    if (loginError) {
      setLoginError("");
      clearErrors(["email", "password"]);
    }
  }, [emailValue, passwordValue, clearErrors]);

  const { login, authError } = useAuthStore();

  const disasterError = authError || loginError;

  const onSubmit = async (data: UserAuthForm) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const response = await ContractService.api.loginUserApiV2UsersLoginPost(
        data
      );

      if (response.status === 400 || response.status === 401) {
        setError("email", { type: "manual" });
        setError("password", { type: "manual" });
        setLoginError("Неверный логин или пароль");
        return;
      }
      const auth = await response.json();
      login(auth);
      navigate(AppRoutes.Main);
    } catch {
      setError("email", { type: "manual" });
      setError("password", { type: "manual" });
      setLoginError("Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      <div className="flex flex-col gap-2.5">
        <Controller
          name="email"
          control={control}
          rules={{
            required: " ",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: " ",
            },
          }}
          render={({ field }) => (
            <Input
              placeholder="Email"
              autoComplete="username"
              disabled={isLoading}
              error={errors.email ? errors.email.message || " " : undefined}
              {...field}
            />
          )}
        />
        <div className="relative">
          <Controller
            name="password"
            control={control}
            rules={{
              required: " ",
            }}
            render={({ field }) => (
              <Input
                placeholder="Пароль"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading}
                error={
                  errors.password ? errors.password.message || " " : undefined
                }
                icon={
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                }
                {...field}
              />
            )}
          />
          <Link
            to="https://t.me/explain_info"
            className="absolute right-0 -bottom-5 text-xs text-gray-500 hover:underline"
            target="_blank"
          >
            Не помню пароль
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-0 mt-5">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          color={disasterError ? "danger" : "primary"}
        >
          {isLoading ? <Loader variant="dots" /> : disasterError || "Войти"}
        </Button>
        <Button
          type="button"
          color="secondary"
          onClick={() => navigate(AppRoutes.Register)}
          className="h-11 mt-2.5"
        >
          Создать аккаунт
        </Button>
      </div>

      <div className="flex items-center gap-5">
        <Divider className="bg-[#9EBFFF]" />
        <span className="text-[12px] text-[#9EBFFF]">или</span>
        <Divider className="bg-[#9EBFFF]" />
      </div>

      <div className="flex justify-between gap-5 mt-[-5px]">
        {/* TODO: Uncomment when VK Oauth handling is done on the backend side */}
        {/* <button
          className="hover:cursor-pointer"
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_BASE_URL}/api/v2/users/auth/${
                UserProviderType.Vk
              }?redirect_uri=${redirectUri}`,
              "_self"
            )
          }
        >
          <VKIcon width={48} height={48} />
        </button> */}
        <button
          className="hover:cursor-pointer"
          onClick={() =>
            window.open(
              `https://oauth.telegram.org/auth?bot_id=${
                import.meta.env.VITE_BOT_ID
              }&origin=${encodeURIComponent(
                location.origin
              )}&embed=1&request_access=write&lang=ru&return_to=${encodeURIComponent(
                `${location.origin.replace(/\/$/, "")}${AppRoutes.Login}`
              )}`,
              "_self"
            )
          }
        >
          <TelegramIcon width={48} height={48} />
        </button>
        <button
          className="hover:cursor-pointer"
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_BASE_URL}/api/v2/users/auth/${
                UserProviderType.Yandex
              }?redirect_uri=${redirectUri}`,
              "_self"
            )
          }
        >
          <YandexIcon width={48} height={48} />
        </button>
        <button
          className="hover:cursor-pointer"
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_BASE_URL}/api/v2/users/auth/${
                UserProviderType.Google
              }?redirect_uri=${redirectUri}`,
              "_self"
            )
          }
        >
          <GoogleIcon width={48} height={48} />
        </button>
      </div>
    </form>
  );
};
