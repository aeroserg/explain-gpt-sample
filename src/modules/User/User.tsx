import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button, Loader, Input } from "@/libs/ui";

import EditIcon from "@/assets/icons/edit-icon.svg?react";
import CrossIcon from "@/assets/icons/cross-icon.svg?react";
import { AppRoutes } from "@/routes/AppRoutes";
import { useChatStore } from "@/store/chat/chatStore";
import { useAuthStore } from "@/store/auth/authStore";
import { UserEditForm } from "./components/UserEditForm";
import { ContractService } from "@/api/apiService";
import { useUserStore } from "@/store/user/userStore";
import { NonPasswordUser, Subscription } from "@/api/contracts";

export default function User() {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { limits, getLimits, limitsAreLoading, setLimits } = useChatStore();

  const {
    userInfo,
    isEditing,
    isLoading,
    setUserInfo,
    setIsEditing,
    setIsLoading,
  } = useUserStore();

  const [promocode, setPromocode] = useState("");

  const [promocodeResponse, setPromocodeResponse] = useState<
    Subscription | undefined
  >();
  const [promocodeError, setPromocodeError] = useState("");
  const [promocodeResponseisLoading, setPromocodeResponseisLoading] =
    useState(false);

  const sendPromocode = async () => {
    if (!auth?.access_token) return;
    setPromocodeResponseisLoading(true);
    setPromocodeError("");
    try {
      const response =
        await ContractService.api.usePromoByUidApiV2PromosUsePromoNamePost(
          promocode,
          { headers: { "jwt-token": auth.access_token } }
        );
      if (response.status >= 400 && response.status < 500) {
        setPromocodeError("Неверный промокод");
        return;
      }

      const promocodeResponse = response.data;

      setPromocodeResponse(promocodeResponse);
      setPromocodeError("");
      if (promocodeResponse.requests_limit) {
        setLimits(promocodeResponse.requests_limit);
      }
    } catch {
      setPromocodeError(
        "Ошибка на сервере, попробуйте повторить попытку позже"
      );
    } finally {
      setPromocodeResponseisLoading(false);
    }
  };

  useEffect(() => {
    const getInfo = async (token: string) => {
      const response = await ContractService.api.getUserApiV2UsersSelfGet({
        headers: { "jwt-token": token },
      });
      const data: NonPasswordUser = await response.json();
      setUserInfo(data);
      setIsLoading(false);
    };

    if (auth?.access_token) {
      getInfo(auth.access_token);
    }
  }, [isLoading]);

  useEffect(() => {
    if (auth?.access_token) {
      getLimits(auth.access_token);
    }
  }, [auth]);

  return (
    <div className="max-w-[676px] no-scrollbar">
      <h1 className="text-[32px] font-bold mb-[20px] lg:mt-0 mt-10">Управление аккаунтом</h1>
      <div className="bg-card border-border border-[2px] lg:rounded-normal lg:px-[40px] lg:py-[30px] lg:mb-[30px] p-4 mb-4 rounded-small">
        <div className="flex justify-between mb-[24px]">
          <h2 className="lg:text-[28px] text-[22px] font-bold">Профиль</h2>
          {isEditing && (
            <CrossIcon role="button" onClick={() => setIsEditing(false)} />
          )}
        </div>
        {isLoading ? (
          <Loader />
        ) : isEditing ? (
          <UserEditForm />
        ) : (
          <>
            <div className="flex justify-between items-center mb-[18px]">
              <p className="lg:text-[21px] text-[16px] text-blue-gray-dark">
                Email:{" "}
                <span className="text-foreground">{userInfo?.email}</span>
              </p>
              <EditIcon
                role="button"
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="lg:text-[21px] text-[16px] text-blue-gray-dark">
                Имя:{" "}
                <span className="text-foreground">{userInfo?.name || "-"}</span>
              </p>

              <EditIcon
                role="button"
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </>
        )}
      </div>
      <div className="bg-card border-border border-[2px] lg:rounded-normal lg:px-[40px] lg:py-[30px] lg:mb-[30px] p-4 mb-4 rounded-small">
        <h2 className="lg:text-[28px] text-[22px] font-bold mb-[24px]">Подписка</h2>
        {limitsAreLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between items-center text-blue-gray-dark mb-[18px]">
              <span className="lg:text-[21px] text-[16px]">
                Запросы ExplainLAW:{" "}
                {limits?.is_unlimited
                  ? "Без лимита"
                  : limits?.available_requests}
              </span>
            </div>
            <Button
              variant="pill"
              color="secondary"
              onClick={() => navigate(AppRoutes.Subscription)}
            >
              <span className="text-foreground">Сменить подписку</span>
            </Button>
          </>
        )}
      </div>

      <div className="bg-card border-border border-[2px] lg:rounded-normal lg:px-[40px] lg:py-[30px] lg:mb-[30px] p-4 mb-4 rounded-small">
        <h2 className="lg:text-[28px] text-[22px] font-bold mb-[24px]">Промокод</h2>
        <Input
          placeholder="Введите промокод"
          className="mb-[12px]"
          disabled={promocodeResponseisLoading}
          onChange={(e) => setPromocode(e.target.value)}
        />
        {promocodeResponseisLoading ? (
          <Loader />
        ) : (
          <Button
            disabled={promocodeResponseisLoading}
            variant="pill"
            className="mb-[12px]"
            onClick={sendPromocode}
          >
            Применить
          </Button>
        )}
        {promocodeResponse && (
          <p className="text-green-500">Промокод применён</p>
        )}
        {promocodeError && <p className="text-red-500">{promocodeError}</p>}
      </div>
      <div className="bg-card border-border border-[2px] lg:rounded-normal lg:px-[40px] lg:py-[30px] p-4 rounded-small">
        <h2 className="lg:text-[28px] text-[22px] font-bold mb-[24px]">Поддержка</h2>
        <p className="lg:text-[21px] text-[16px]">
          Столкнулись с проблемой? Обратитесь за помощью в наш{" "}
          <a
            className="text-blue-key"
            href="https://t.me/explain_info"
            target="_blank"
          >
            сервис поддержки
          </a>
          !
        </p>
      </div>
      {/* <div className="bg-card border-border border-[2px] rounded-normal px-[40px] py-[30px]">
          <h2 className="lg:text-[28px] text-[22px] font-bold mb-[24px]">Подписка</h2>
          <div className="flex justify-between items-center text-blue-gray-dark mb-[18px]">
            <span className="lg:text-[21px] text-[16px]">У вас пока нет подписки</span>
          </div>
          <Button variant="pill">Купить подписку</Button>
        </div> */}
    </div>
  );
}
