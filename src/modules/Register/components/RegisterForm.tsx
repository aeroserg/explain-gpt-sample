import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { ContractService } from "@/api/apiService";
import { Input, Button } from "@/libs/ui";
import { UserAuthForm } from "@/modules/Login/components/LoginForm";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/store/auth/authStore";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserAuthForm>({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const password = watch("password");

  const { login } = useAuthStore();

  const onSubmit = async (data: UserAuthForm) => {
    setIsLoading(true);
    try {
      const response = await ContractService.api.createUserApiV2UsersPost(data);
      if (response.status === 400) {
        setRegisterError("Неверный логин или пароль");
        return;
      }
      const auth = await response.json();
      login(auth);
      navigate(AppRoutes.Main);
    } catch {
      setRegisterError(
        "Ошибка авторизации на сервере, повторите попытку позже."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[16px] w-full"
    >
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Поле обязательно",
        }}
        render={({ field }) => (
          <Input
            placeholder="Ваше имя"
            disabled={isLoading}
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Поле обязательно",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Некорректный e-mail",
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Логин или e-mail"
            disabled={isLoading}
            error={errors.email?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Введите пароль",
          minLength: {
            value: 6,
            message: "Минимум 6 символов",
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Пароль"
            type="password"
            disabled={isLoading}
            error={errors.password?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="confirm"
        control={control}
        rules={{
          required: "Подтвердите пароль",
          validate: (value) => value === password || "Пароли не совпадают",
        }}
        render={({ field }) => (
          <Input
            placeholder="Подтверждение пароля"
            type="password"
            disabled={isLoading}
            error={errors.confirm?.message}
            {...field}
          />
        )}
      />
      <Button
        variant="pill"
        className="mb-[10px]"
        type="submit"
        disabled={isLoading}
      >
        Зарегистрироваться
      </Button>
      {registerError && (
        <p className="text-red-500 text-[14px] text-center">{registerError}</p>
      )}
      <Link
        to={AppRoutes.Login}
        className="block text-[14px] text-blue-500 hover:underline text-center"
      >
        У меня уже есть аккаунт
      </Link>
    </form>
  );
};
