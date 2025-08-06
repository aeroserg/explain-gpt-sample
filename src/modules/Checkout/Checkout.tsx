import { useEffect, useState } from "react";

import { Button, Loader } from "@/libs/ui";
import { useAuthStore } from "@/store/auth/authStore";

import BenefitsIcon from "@/assets/icons/sub-benefits-icon.svg?react";
import UCassaLogo from "@/assets/icons/u-cassa-icon.svg?react";

import { useUserStore } from "@/store/user/userStore";
import { ContractService } from "@/api/apiService";
import { utils } from "@/libs/utils";

export default function Checkout() {
  const { auth } = useAuthStore();
  const { subscription } = useUserStore();

  const [subLink, setSubLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSubLink = async (token: string, subId: number) => {
      const resposne =
        await ContractService.api.createPaymentApiV2PaymentsSubscriptionIdPost(
          subId,
          { headers: { "jwt-token": token } }
        );
      const data = await resposne.json();
      setSubLink(data);
      setIsLoading(false);
    };

    if (auth && subscription?.id) {
      getSubLink(auth.access_token, subscription.id);
    }
  }, [auth?.access_token]);

  return (
    <div className="max-w-[891px]">
      <h1 className="text-[32px] font-bold mb-[20px]">Корзина</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="flex items-start flex-wrap gap-[28px] justify-left">
          <li className="max-w-[418px] lg:pt-[45px] lg:px-[60px] lg:pb-[34px] p-6 border-[2px] border-border rounded-normal grow">
            <p className="font-semibold text-[26px] text-left leading-[31px] mb-[74px]">
              {subscription?.name}
            </p>
            <ul className="mb-[50px]">
              <li className="flex gap-3">
                <BenefitsIcon />
                Подписка{" "}
                {subscription?.is_unlimited
                  ? "безлимитная"
                  : `действует ${subscription?.day_gap || 30} дней`}
              </li>
            </ul>
            <p className="text-right ">
              <span className="font-extrabold text-[44px]">
                {utils.formatCurrency(subscription?.price || 1000)}
              </span>
            </p>
          </li>
          <li className="max-w-[418px] px-[40px] py-[30px] border-[2px] border-border rounded-normal grow">
            <p className="font-semibold text-[24px] text-left leading-[31px] mb-[14px]">
              Оплата
            </p>
            <div className="flex mb-[40px] justify-between">
              <span className="font-semibold text-[20px]">Итого:</span>
              <span className="font-semibold text-[20px]">
                {utils.formatCurrency(subscription?.price || 1000)}
              </span>
            </div>
            <Button
              className="rounded-normal p-5 !h-[50px]"
              onClick={() => window.open(subLink, "_blank")}
            >
              <UCassaLogo width={100} height={35} />
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
}
