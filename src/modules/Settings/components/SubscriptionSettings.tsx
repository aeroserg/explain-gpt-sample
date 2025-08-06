import { useState, useEffect } from 'react';
import { Input } from '@/libs/ui';
import { ChevronLeft } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { ContractService } from '@/api/apiService';
import { Subscription, UserLimitResponse } from '@/api/contracts';
import { useUIStore } from '@/store/ui/uiStore';

/**
 * Renders a single subscription item with its details.
 */
const SubscriptionItem = ({ name, expiry, requestsUsed, requestsTotal, isUnlimited }: { name: string, expiry: string, requestsUsed?: number | null, requestsTotal?: number | null, isUnlimited: boolean }) => (
    <div className="border border-[#EDF0F5] rounded-md p-2 px-3">
        <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-[12px] leading-[18px] tracking-[-0.022em] text-[#2A2A2A]">{name}</p>
            <p className="text-[10px] leading-[15px] tracking-[-0.022em] text-[#2A2A2A]">до {new Date(expiry).toLocaleDateString()}</p>
        </div>
        <p className="text-[10px] leading-[15px] tracking-[-0.022em] text-[#2A2A2A]">
            {isUnlimited ? 'Безлимитное количество запросов' : `Доступные запросы: ${requestsUsed} из ${requestsTotal}`}
        </p>
    </div>
);

/**
 * Component for managing user subscriptions, including viewing active subscriptions,
 * browsing available packages, activating promo codes, and purchasing new subscriptions.
 */
const SubscriptionSettings = () => {
    const { subscriptionSettingsView, setSubscriptionSettingsView } = useUIStore();
    const [promoCode, setPromoCode] = useState('');
    const [isActivating, setIsActivating] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

    const [activeSubscriptions, setActiveSubscriptions] = useState<UserLimitResponse[]>([]);
    const [availableSubscriptions, setAvailableSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    /**
     * Fetches the user's active subscriptions from the API.
     */
    const fetchActiveSubscriptions = async () => {
        setIsLoading(true);
        try {
            const limitsRes = await ContractService.api.getUserLimitsByUidApiV2LimitsGet();
            setActiveSubscriptions(limitsRes.data);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetches the list of available subscription packages from the API.
     */
    const fetchAvailableSubscriptions = async () => {
        if (availableSubscriptions.length > 0) return;
        setIsLoadingAvailable(true);
        try {
            const subsRes = await ContractService.api.getSubscriptionListApiV2SubscriptionsGet();
            setAvailableSubscriptions(subsRes.data.filter(s => s.is_visible));
        } catch (error) {
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    useEffect(() => {
        fetchActiveSubscriptions();
    }, []);

    useEffect(() => {
        if (subscriptionSettingsView === 'available') {
            fetchAvailableSubscriptions();
        }
    }, [subscriptionSettingsView]);

    /**
     * Handles the activation of a promotional code.
     */
    const handleActivatePromo = async () => {
        if (!promoCode.trim()) return;

        setIsActivating(true);
        setPromoError('');

        try {
            await ContractService.api.usePromoByUidApiV2PromosUsePromoNamePost(promoCode);
            setPromoCode('');
            await fetchActiveSubscriptions();
        } catch (error) {
            setPromoError('Неверный промокод');
        } finally {
            setIsActivating(false);
        }
    };

    /**
     * Initiates the subscription purchase process for the selected package.
     */
    const handleBuySubscription = async () => {
        if (!selectedPackage) return;

        setIsPurchasing(true);
        try {
            const response = await ContractService.api.createPaymentApiV2PaymentsSubscriptionIdPost(selectedPackage);
            const paymentUrl = response.data;
            if (paymentUrl) {
                window.open(paymentUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
        } finally {
            setIsPurchasing(false);
        }
    };
    
    const isButtonDisabled = isActivating || !promoCode.trim();
    const buttonColor = promoError ? '#FF3D40' : isButtonDisabled ? '#B7CFFF' : '#3D7EFF';

    if (isLoading && subscriptionSettingsView === 'active') {
        return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }

    if (subscriptionSettingsView === 'available') {
        if (isLoadingAvailable) {
            return (
                <div className="flex flex-col h-full text-[#2B2B2B]">
                     <button onClick={() => setSubscriptionSettingsView('active')} className="flex items-center gap-1 text-[10px] leading-[15px] text-[#929292] mb-2">
                        <ChevronLeft size={12} strokeWidth={1} className="text-[#929292]" />
                        Назад
                    </button>
                    <div className="flex justify-center items-center h-full"><Loader /></div>
                </div>
            );
        }
        return (
            <div className="flex flex-col h-full text-[#2B2B2B]">
                <button onClick={() => setSubscriptionSettingsView('active')} className="flex items-center gap-1 text-[10px] leading-[15px] text-[#929292] mb-2">
                    <ChevronLeft size={12} strokeWidth={1} className="text-[#929292]" />
                    Назад
                </button>

                <h3 className="font-medium text-[14px] leading-[21px] tracking-[-0.022em] mb-3">Доступные подписки</h3>

                <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {availableSubscriptions.map((pkg) => {
                        const isSelected = selectedPackage === pkg.id;
                        const requestsText = pkg.is_unlimited ? "Безлимитное количество запросов" : `${pkg.requests_limit} Запросов`;

                        return (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id ?? null)}
                                className={`rounded-md p-2 px-3 cursor-pointer border ${
                                    isSelected ? 'bg-[#3D7EFF] border-[#3D7EFF]' : 'border-[#EDF0F5] bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <p className={`font-medium text-[12px] leading-[18px] ${isSelected ? 'text-white' : 'text-[#2A2A2A]'}`}>{pkg.name}</p>
                                    <p className={`font-medium text-[12px] leading-[18px] ${isSelected ? 'text-white' : 'text-[#2A2A2A]'}`}>{pkg.price} ₽ / {pkg.day_gap} дней</p>
                                </div>
                                <div
                                    className={`mt-4 px-2 py-1 flex items-center justify-center text-[8px] leading-[10px] tracking-[-0.03em] rounded w-fit ${
                                        isSelected ? 'bg-white text-[#3D7EFF]' : 'bg-[#3D7EFF] text-white'
                                    }`}
                                >
                                    {requestsText}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={handleBuySubscription}
                    disabled={!selectedPackage || isPurchasing}
                    className={`w-full h-[30px] mt-4 text-white text-[12px] leading-[15px] tracking-[-0.03em] rounded-md flex items-center justify-center ${
                        selectedPackage ? 'bg-[#3D7EFF]' : 'bg-[#B7CFFF]'
                    } disabled:opacity-50`}
                >
                    {isPurchasing ? <Loader variant="dots" size="sm" className="text-white" /> : 'Купить'}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full text-[#2B2B2B]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[14px] leading-[21px] tracking-[-0.022em]">К доступным подпискам</h3>
                <button
                    onClick={() => setSubscriptionSettingsView('available')}
                    className="w-[75px] h-[30px] bg-[#3D7EFF] text-white text-[10px] leading-[12px] tracking-[-0.03em] rounded-md hover:bg-[#3D7EFF]/90 flex items-center justify-center"
                >
                    Перейти
                </button>
            </div>

            <p className="font-medium text-[14px] leading-[21px] tracking-[-0.022em] mb-3">Все активные подписки</p>

            <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                {activeSubscriptions.length > 0 ? (
                    activeSubscriptions.map((sub, index) => (
                        <SubscriptionItem
                            key={index}
                            name="Пакет запросов ExplainLAW"
                            expiry={sub.date_expire}
                            requestsUsed={sub.available_requests}
                            requestsTotal={sub.requests}
                            isUnlimited={sub.is_unlimited}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">У вас нет активных подписок.</p>
                )}
            </div>

            <div className="pt-4">
                <div className="flex items-start gap-2 w-full">
                    <div className="flex-1 flex flex-col">
                        <Input
                            placeholder="Промокод"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className={`h-[30px]! text-[12px] bg-[#EDF0F5]! placeholder:text-[#929292] ${promoError ? 'border border-[#FF3D40] placeholder:text-[#FF3D40]' : 'border-none'}`}
                        />
                        {promoError && (
                            <p className="mt-1 text-[10px] leading-[15px] tracking-[-0.022em] text-[#FF3D40]">{promoError}</p>
                        )}
                    </div>
                    <button
                        onClick={handleActivatePromo}
                        disabled={isButtonDisabled}
                        style={{ backgroundColor: buttonColor }}
                        className="w-[89px] h-[30px] text-white text-[10px] leading-[12px] tracking-[-0.03em] rounded-md flex items-center justify-center disabled:opacity-50"
                    >
                        {isActivating ? <Loader variant="dots" size="sm" className="text-white" /> : 'Активировать'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSettings; 