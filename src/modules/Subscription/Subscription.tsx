import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import BenefitsIcon from "@/assets/icons/sub-benefits-icon.svg?react";

import { Button, Loader } from "@/libs/ui";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/store/auth/authStore";
import { utils } from "@/libs/utils";
import { ContractService } from "@/api/apiService";
import { useUserStore } from "@/store/user/userStore";

interface Subscription {
  created_at: string;
  day_gap: number;
  id: number;
  is_unlimited: boolean | null;
  is_visible: boolean | null;
  name: string;
  price: number;
}

export default function Subscription() {
  const { auth } = useAuthStore();
  const { setSubscription } = useUserStore();
  const navigate = useNavigate();

  const [subList, setSubList] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSubList = async (token: string) => {
      const resposne =
        await ContractService.api.getSubscriptionListApiV2SubscriptionsGet({
          headers: { "jwt-token": token },
        });
      const data = await resposne.json();
      setSubList(data);
      setIsLoading(false);
    };

    if (auth?.access_token) {
      getSubList(auth.access_token);
    }
  }, [auth?.access_token]);

  function handleSubSelection(sub: Subscription) {
    setSubscription(sub);
    navigate(AppRoutes.Checkout);
  }

  return (
    <div className="max-w-[891px]">
      <h1 className="text-[32px] font-bold lg:mb-[20px] mb-[16px] lg:mt-0 mt-10">Управление подпиской</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="flex flex-wrap lg:gap-[28px] gap-4 justify-left">
          {subList.length &&
            subList
              .filter((sub) => sub.is_visible || sub.is_visible === null)
              .map((sub) => (
                <li
                  key={sub.id}
                  className="max-w-[418px] lg:pt-[45px] lg:px-[60px] lg:pb-[34px] p-6 border-[2px] border-border rounded-normal grow"
                >
                  <p className="font-semibold text-[26px] text-center leading-[31px] lg:mb-[74px] mb-[40px]">
                    {sub.name}
                  </p>
                  <p className="text-center lg:mb-[74px] mb-[36px]">
                    <span className="font-extrabold lg:text-[64px] text-[45px]">
                      {utils.formatCurrency(sub.price)}
                    </span>
                  </p>
                  <ul className="lg:mb-[50px] mb-[36px]">
                    <li className="flex gap-3">
                      <BenefitsIcon />
                      Подписка{" "}
                      {sub.is_unlimited
                        ? "безлимитная"
                        : `действует ${sub.day_gap || 30} дней`}
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleSubSelection(sub)}
                    className="rounded-normal"
                  >
                    Перейти к оформлению
                  </Button>
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
