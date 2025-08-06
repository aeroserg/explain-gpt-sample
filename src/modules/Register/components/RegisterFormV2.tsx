import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { ContractService } from "@/api/apiService";
import { Loader } from "@/components/ui/loader";
import { Input, Button } from "@/libs/ui";
import { UserAuthForm } from "@/modules/Login/components/LoginForm";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/store/auth/authStore";

export const RegisterFormV2 = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, touchedFields, dirtyFields, isValid },
  } = useForm<UserAuthForm>({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const password = watch("password");

  const { login } = useAuthStore();

  const onSubmit = async (data: UserAuthForm) => {
    setIsLoading(true);
    setRegisterError("");
    try {
      const response = await ContractService.api.createUserApiV2UsersPost(data);

      if (!response.ok) {
          setRegisterError(
            "Ошибка регистрации на сервере, повторите попытку позже."
          );
      } else {
        const auth = response.data;
        login(auth);
        navigate(AppRoutes.Main);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      if (error.status === 409) {
        setError("email", {
          type: "server",
          message: "Email уже зарегистрирован",
        });
      } else {
        setRegisterError(
          "Ошибка регистрации на сервере, повторите попытку позже."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSuccessState = (name: keyof UserAuthForm) => {
    return touchedFields[name] && dirtyFields[name] && !errors[name];
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[10px] w-full"
    >
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Это поле необходимо заполнить",
        }}
        render={({ field }) => (
          <Input
            placeholder="Ваше имя"
            disabled={isLoading}
            error={errors.name?.message}
            success={getSuccessState("name")}
            {...field}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Это поле необходимо заполнить",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Неверно указан email",
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Email"
            disabled={isLoading}
            error={errors.email?.message}
            success={getSuccessState("email")}
            {...field}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Это поле необходимо заполнить",
          minLength: {
            value: 6,
            message: "Минимум 6 символов",
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Введите пароль"
            type={isPasswordVisible ? "text" : "password"}
            disabled={isLoading}
            error={errors.password?.message}
            success={getSuccessState("password")}
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
      <Controller
        name="confirm"
        control={control}
        rules={{
          required: "Это поле необходимо заполнить",
          validate: (value) => value === password || "Пароли не совпадают",
        }}
        render={({ field }) => (
          <Input
            placeholder="Введите пароль повторно"
            type={isConfirmPasswordVisible ? "text" : "password"}
            disabled={isLoading}
            error={errors.confirm?.message}
            success={getSuccessState("confirm")}
            icon={
              <button
                type="button"
                onClick={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                {isConfirmPasswordVisible ? (
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
      <div className="flex flex-col mt-[10px] gap-[10px]">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="h-[44px] rounded-[8px] text-white"
        >
          {isLoading ? <Loader variant="dots" /> : "Зарегистрироваться"}
        </Button>
        {registerError && (
          <p className="text-red-500 text-[14px] text-center">
            {registerError}
          </p>
        )}
        <Button
          type="button"
          variant="rounded"
          color="secondary"
          className="h-[44px]"
          onClick={() => navigate(AppRoutes.Login)}
        >
          У меня уже есть аккаунт
        </Button>
      </div>
    </form>
  );
}; 