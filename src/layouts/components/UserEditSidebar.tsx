import classNames from "classnames";
import { Link, useLocation, useNavigate } from "react-router";

import { AppRoutes } from "@/routes/AppRoutes";
import LogoutIcon from "@/assets/icons/logout-icon.svg?react";

import { useAuthStore } from "@/store/auth/authStore";
import { useTopicsStore } from "@/store/topics/topicsStore";
import { useChatStore } from "@/store/chat/chatStore";

interface UserEditSidebarProps {
  onItemClick?: () => void;
}

const items: Array<{ path: AppRoutes; label: string }> = [
  { path: AppRoutes.User, label: "Управление аккаунтом" },
  { path: AppRoutes.Subscription, label: "Управление подпиской" },
];

export const UserEditSidebar = ({ onItemClick }: UserEditSidebarProps) => {
  const { auth, logout } = useAuthStore();
  const { setMessages } = useChatStore();
  const { setTopics } = useTopicsStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setTopics([]);
    setMessages([]);
    navigate(AppRoutes.Login);
    onItemClick?.();
  };

  const handleNavigate = (to: AppRoutes) => {
    navigate(to);
    onItemClick?.();
  };

  return (
    <aside className="basis-[323px] h-screen bg-background lg:px-[16px] lg:py-[62px] px-[8px] py-[16px]">
      <header className="mb-[51px] flex justify-between items-center">
        <div
          className="flex items-center gap-[10px] cursor-pointer"
          onClick={() => handleNavigate(AppRoutes.User)}
        >
          <div className="w-[31px] h-[31px] rounded-full bg-blue-gray-light flex items-center justify-center"></div>
          <span className="font-medium">{auth?.email || auth?.name}</span>
        </div>
        <LogoutIcon role="button" className="cursor-pointer" onClick={handleLogout} />
      </header>

      <ul className="flex flex-col gap-[13px]">
        <li>
          <Link
            to={AppRoutes.Main}
            className={classNames(
              "flex bg-blue-gray-even-lighter py-[12px] justify-center rounded-small text-black-key"
            )}
            onClick={onItemClick}
          >
            На главную
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.path}
              className={classNames(
                "flex bg-blue-gray-even-lighter py-[12px] justify-center rounded-small",
                { "text-blue-key": pathname === item.path }
              )}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
