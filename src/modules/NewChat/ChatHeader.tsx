"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/libs/utils/shadcnUtils";
import { useAuthStore } from "@/store/auth/authStore";
import { useChatStore } from "@/store/chat/chatStore";
import { AssistantType } from "@/api/contracts";
import { AppRoutes } from "@/routes/AppRoutes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/providers/ThemeProvider";
import SvgIcon from '@/components/ui/SvgIcon';
import { useUIStore } from "@/store/ui/uiStore";

/**
 * @interface Model
 * @description Defines the structure for a language model selectable in the chat header.
 * @property {string} id Unique identifier for the model.
 * @property {string} name Display name of the model.
 * @property {AssistantType} assistantType The type of assistant associated with the model.
 */
export interface Model {
  id: string;
  name:string;
  assistantType: AssistantType;
}

const models: Model[] = [
  { id: "ExplainLaw", name: "ExplainLAW", assistantType: AssistantType.ExplainLaw },
  { id: "ExplainGPT", name: "ExplainGPT", assistantType: AssistantType.ExplainGpt },
  { id: "ExplainEstate", name: "ExplainESTATE", assistantType: AssistantType.ExplainEstate },
];

const tabImagePaths = ['/tabs/1.png', '/tabs/2.png', '/tabs/3.png', '/tabs/1-dark.png', '/tabs/2-dark.png', '/tabs/3-dark.png'];

/**
 * @component ChatHeader
 * @description Renders the header of the chat interface. It allows model selection, displays user information, and provides actions like logout and theme toggling.
 */
const ChatHeader: React.FC = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuthStore();
  const { pickedModel, setPickedModel, setMessages, setPersistedId } = useChatStore();
  const { theme, toggleTheme } = useTheme();
  const { openSettingsModal } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    tabImagePaths.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate(AppRoutes.Login);
    setMessages([]);
    setPersistedId(undefined);
  };

  const handleModelSelect = (model: Model) => {
    setPickedModel(model.assistantType);
    setMessages([]);
    setPersistedId(undefined);
    navigate(AppRoutes.Main);
  };

  const currentSelectedModel = models.find(m => m.assistantType === pickedModel) || models[0];
  const currentModelIndex = models.indexOf(currentSelectedModel);

  const getBackgroundImage = () => {
    const baseIndex = currentModelIndex;
    const themeOffset = theme === 'dark' ? 3 : 0;
    return tabImagePaths[baseIndex + themeOffset];
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    openSettingsModal('account');
    setIsDropdownOpen(false);
  }

  return (
    <header className={cn(
      "flex items-center justify-between relative shrink-0 h-[55px] sm:h-[66px] mb-[-16px] z-0 sm:z-10"
    )}>
      <div className="flex items-center h-full flex-1">
        <SidebarTrigger className="mr-2 sm:hidden pb-[14px]" />
        <div className="flex h-full relative">
          {tabImagePaths.map((path) => (
            <div
              key={`bg-${path}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${path})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                opacity: path === getBackgroundImage() ? 1 : 0,
                transition: 'opacity 50ms linear',
                pointerEvents: 'none',
              }}
            />
          ))}
          {models.map((model) => {
            const isActive = currentSelectedModel.id === model.id;
            const spanTextColor = isActive ? "text-[var(--color-text-strong)]" : "text-[var(--color-text-subtle)]";

            return (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={cn(
                  "relative cursor-pointer flex flex-1 items-center justify-center h-full",
                  "group z-10"
                )}
              >
                <span
                  className={cn(
                    "relative block text-[10px] sm:text-[16px] font-semibold text-center",
                    "sm:px-[32px] px-5 pb-[10px]",
                    spanTextColor,
                    model.name === "ExplainESTATE" ? "pl-[20px]! pr-[35px]! sm:pl-[20px]! sm:pr-[55px]!" : "",
                    "hover:text-[var(--color-text-strong)]"
                  )}
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {model.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-[10px] pr-[5px]">
        <div className="relative" ref={dropdownRef}>
          <div onClick={handleToggleDropdown} className="flex items-center gap-2 cursor-pointer pb-[25px]">
            <span className="text-sm md:text-base font-medium hidden md:inline text-[var(--color-text-default)]" style={{ letterSpacing: "-0.02em" }}>
              {auth?.name || auth?.email}
            </span>
            <Avatar className="h-[40px] w-[40px] rounded-lg">
              <AvatarFallback className="rounded-lg text-xs bg-[var(--color-neutral-bg)] text-[var(--color-neutral-text)]">
                {auth?.name?.substring(0, 1).toUpperCase() || auth?.email?.substring(0, 1).toUpperCase() || ''}
              </AvatarFallback>
            </Avatar>
          </div>
          {isDropdownOpen && (
            <div className="fixed top-[55px] right-[5px] w-[140px] bg-[#2A2A2A] text-white rounded-lg border-none z-50">
              <div onClick={handleSettingsClick} className="text-xs px-[10px] py-1.5 pt-[10px] flex items-center cursor-pointer hover:bg-gray-700 hover:text-white rounded-t-lg">
                  <SvgIcon src="/icons/settings.svg" className="mr-2 h-4 w-4" preserveColors />
                  <span>Настройки</span>
              </div>
              <div onClick={() => { toggleTheme(); setIsDropdownOpen(false); }} className="text-xs px-[10px] py-1.5 flex items-center cursor-pointer hover:bg-gray-700 hover:text-white">
                <SvgIcon src={theme === 'dark' ? "/icons/light-theme.svg" : "/icons/dark-theme.svg"} className="mr-2 h-4 w-4" preserveColors />
                <span>{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</span>
              </div>
              <div onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="text-xs px-[10px] py-1.5 pb-[10px] flex items-center cursor-pointer hover:bg-gray-700 hover:text-white rounded-b-lg">
                <SvgIcon src="/icons/signout.svg" className="mr-2 h-4 w-4" preserveColors />
                <span>Выйти</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader; 