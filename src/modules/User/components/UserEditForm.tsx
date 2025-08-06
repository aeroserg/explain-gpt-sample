import { Controller, useForm } from "react-hook-form";

import { ContractService } from "@/api/apiService";
import { Button, Input } from "@/libs/ui";
import { useAuthStore } from "@/store/auth/authStore";
import { useUserStore } from "@/store/user/userStore";

type FormData = {
  name: string;
  email: string;
  password: string;
  telegram_username: string;
  telegram_id: number;
};

export const UserEditForm = () => {
  const { auth } = useAuthStore();
  const { setUserInfo, setIsEditing, userInfo } = useUserStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isLoading, isDirty, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { email: userInfo?.email || "", name: userInfo?.name || "" },
  });

  const onSubmit = async (data: FormData) => {
    if (auth?.access_token) {
      await ContractService.api.updateUserApiV2UsersPatch(data, {
        headers: { "jwt-token": auth.access_token },
      });
      reset(data);
      setUserInfo({ email: data.email, name: data.name, id: data.telegram_id });
      setIsEditing(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Обязательное поле",
          validate: {
            isValid: (val) =>
              new RegExp(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g
              ).test(val)
                ? true
                : "Некорректный формат email",
          },
        }}
        render={({ field }) => (
          <Input
            placeholder="Email"
            className="mb-[12px]"
            disabled={isLoading}
            error={errors.email?.message}
            {...field}
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Имя"
            className="mb-[12px]"
            disabled={isLoading}
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      <Button
        className="rounded-normal"
        type="submit"
        disabled={isLoading || !isDirty || isSubmitting}
      >
        Отправить
      </Button>
    </form>
  );
};
