import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth/authStore";
import { AppRoutes } from "@/routes/AppRoutes";
import { useTheme } from "@/providers/ThemeProvider";
import SvgIcon from '@/components/ui/SvgIcon';
import { useUIStore } from "@/store/ui/uiStore";

export const SimplifiedHeader: React.FC = () => {
    const navigate = useNavigate();
    const { auth, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    
    const { openSettingsModal } = useUIStore();


    const handleSettingsClick = () => {
        openSettingsModal();
        setIsDropdownOpen(false);
    }

    const handleLogout = () => {
        logout();
        navigate(AppRoutes.Login);
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

    return (
        <header className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2 md:gap-[10px]">
                <div className="relative" ref={dropdownRef}>
                    <div onClick={handleToggleDropdown} className="flex items-center gap-2 cursor-pointer">
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