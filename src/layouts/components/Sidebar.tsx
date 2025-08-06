import { useNavigate } from "react-router";
import { AppRoutes } from "@/routes/AppRoutes";
import { useState } from "react";

import LogoutIcon from "@/assets/icons/logout-icon.svg?react";
import PlusModelIcon from "@/assets/icons/model-selection-icon.svg?react";
import DropDownIcon from "@/assets/icons/drop-down-icon.svg?react";

import { AssistantType } from "@/api/contracts";

import { useAuthStore } from "@/store/auth/authStore";
import { useTopicsStore } from "@/store/topics/topicsStore";
import { useChatStore } from "@/store/chat/chatStore";

import { utils } from "@/libs/utils";
import { Loader } from "@/libs/ui";

import { Topic } from "./Topic";

const modelsMap: Record<string, string> = {
  [AssistantType.ExplainGpt]: "ExplainGPT",
  [AssistantType.ExplainEstate]: "ExplainEstate",
  [AssistantType.ExplainLaw]: "ExplainLaw",
  [AssistantType.ExplainImg]: "ExplainImg",
};

interface SidebarProps {
  onItemClick?: () => void;
}


export const Sidebar = ({ onItemClick }: SidebarProps) =>{
  const navigate = useNavigate();
  const { auth, logout, isRefreshing } = useAuthStore();
  const {
    pickedModel,
    setPickedModel,
    setMessages,
    setPersistedId,
    persistedId,
  } = useChatStore();
  const { topics, topicsAreLoading, topicsError, setTopics } =
    useTopicsStore();

  const [openDropdown, setOpenDropdown] = useState(false);

  const isLoading = isRefreshing || topicsAreLoading;
  const showTopics = topics && topics?.length > 0 && !isLoading && !topicsError;
  const showNoTopics =
    topics && !isLoading && !topicsError && topics.length === 0;

  const onLogout = () => {
    logout();
    navigate(AppRoutes.Login);
    setTopics([]);
    setMessages([]);
  };

  const handleSelect = (model: AssistantType) => {
    setPickedModel(model);
    setOpenDropdown(false);
    if (persistedId) {
      setPersistedId(undefined);
    }
    onItemClick?.(); // закрыть меню
  };

  const onPrepareNewModel = () => {
    setMessages([]);
    navigate(AppRoutes.Main);
    setOpenDropdown(false);
    onItemClick?.(); // закрыть меню
  };

  const onNavigateToUser = () => {
    navigate(AppRoutes.User);
    onItemClick?.(); // закрыть меню
  };

  return (
    <aside className="lg:max-w-[324px] bg-background flex-grow pt-[62px] lg:px-4 lg:pb-4 p-3 h-screen overflow-y-scroll no-scrollbar">
      <header className="mb-[51px] flex justify-between items-center">
        <div
          className="flex items-center gap-[10px] cursor-pointer"
          // onClick={() => navigate(AppRoutes.User)}
          onClick={onNavigateToUser}
        >
          <div className="w-[31px] h-[31px] rounded-full bg-blue-gray-light flex items-center justify-center"></div>
          <span className="font-medium">{auth?.email || auth?.name}</span>
        </div>
        <LogoutIcon
          role="button"
          onClick={() => {
            onLogout();
            onItemClick?.(); 
          }}
          style={{ cursor: "pointer" }}
        />
      </header>

      <div className="relative my-10 flex items-center justify-center cursor-pointer">
        <PlusModelIcon role="button" onClick={onPrepareNewModel} />
        <button className="flex items-center gap-2 px-3 py-1 rounded-m transition">
          {modelsMap[pickedModel ?? AssistantType.ExplainGpt]}
        </button>

        <div
          className="relative"
          onClick={() => setOpenDropdown((prev) => !prev)}
        >
          <button className="text-sm hover:opacity-80 transition">
            <DropDownIcon className="cursor-pointer" />
          </button>

          {openDropdown && (
            <div className="absolute top-full right-0 mt-3 bg-white border rounded shadow-md z-10 w-max overflow-hidden">
              {[
                AssistantType.ExplainGpt,
                AssistantType.ExplainLaw,
                AssistantType.ExplainEstate,
              ].map((model) => (
                <div
                  key={model}
                  onClick={() => handleSelect(model)}
                  className="px-4 py-4 text-sm cursor-pointer hover:bg-gray-100"
                  
                >
                  {modelsMap[model]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTopics &&
        topics.map(({ date, topics }) => (
          <div className="mb-[20px]" key={date}>
            <p className="p1 font-medium mb-[20px]">{utils.formatDate(date)}</p>
            <div className="flex flex-col gap-[10px]">
              {topics.map((topic) => {
                const { assistant_type, topic_name, id } = topic;
                return (
                  <Topic key={id} assistantType={assistant_type} topicId={id} onClick={onItemClick}>
                    {topic_name}
                  </Topic>
                );
              })}
            </div>
          </div>
        ))}
      {showNoTopics && <p>Здесь пока пусто, начните диалог с любой моделью</p>}
      {topicsAreLoading && <Loader />}
      {topicsError}
    </aside>
  );
};
