import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import AccountSettings from './components/AccountSettings';
import SubscriptionSettings from './components/SubscriptionSettings';
import { cn } from '@/libs/utils/shadcnUtils';
import SvgIcon from '@/components/ui/SvgIcon';
import { useUIStore } from '@/store/ui/uiStore';


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A modal dialog for displaying user settings.
 * It includes tabs for navigating between account and subscription settings.
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settingsModalActiveTab, setSettingsModalActiveTab } = useUIStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-[600px] h-[500px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg border-none p-0"
        >
          <div className="relative px-4 py-4 border-b border-[#D9D9D9]">
            <h2 className="text-[#2B2B2B] font-semibold text-[18px] leading-[22px] tracking-[-0.03em]">
              Настройки
            </h2>
            
            <div 
              onClick={onClose}
              className="absolute right-4 top-4 cursor-pointer opacity-70 hover:opacity-100 focus:outline-none p-0 bg-transparent flex items-center justify-center"
            >
              <img src="/icons/close-icon.svg" />
            </div>
          </div>
          
          <div className="flex h-[calc(100%-73px)]">
            <div className="w-[120px] p-4 px-2 flex flex-col gap-2">
              <button
                className={cn(
                  "flex items-center w-full justify-start h-[27px] px-2 py-1 text-[14px] leading-[17px] tracking-[-0.02em] rounded-sm transition-colors gap-2",
                  settingsModalActiveTab === 'account' ? 
                    "bg-[#3D7EFF] text-white" : 
                    "bg-transparent text-black hover:bg-gray-100"
                )}
                onClick={() => setSettingsModalActiveTab('account')}
              >
                <SvgIcon src="/icons/user-icon.svg" className="h-4 w-4" />
                Аккаунт
              </button>
              <button
                className={cn(
                  "flex items-center w-full justify-start h-[27px] px-2 py-1 text-[14px] leading-[17px] tracking-[-0.02em] rounded-sm transition-colors gap-2",
                  settingsModalActiveTab === 'subscription' ? 
                    "bg-[#3D7EFF] text-white" : 
                    "bg-transparent text-black hover:bg-gray-100"
                )}
                onClick={() => setSettingsModalActiveTab('subscription')}
              >
                <SvgIcon src="/icons/subscription.svg" className="h-4 w-4" />
                Подписка
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto overscroll-contain">
              {settingsModalActiveTab === 'account' && <AccountSettings />}
              {settingsModalActiveTab === 'subscription' && <SubscriptionSettings />}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default SettingsModal; 