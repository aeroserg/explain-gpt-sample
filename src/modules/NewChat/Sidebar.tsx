"use client";

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/store/auth/authStore";
import { useTopicsStore } from "@/store/topics/topicsStore";
import { useChatStore } from "@/store/chat/chatStore";
import { utils } from "@/libs/utils";
import { Loader } from "@/components/ui/loader";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import SvgIcon from "@/components/ui/SvgIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TopicsType, TopicStatusRequest, AssistantType } from "@/api/contracts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/store/ui/uiStore";

/**
 * @component Sidebar
 * @description Renders the chat application sidebar. It displays model-specific chat topics fetched from the server, allows new chat creation, and provides navigation. The sidebar is collapsible and responsive.
 */
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { auth, isRefreshing } = useAuthStore();
  const {
    setMessages,
    setPersistedId,
    pickedModel,
  } = useChatStore();
  const { getTopics, topics, topicsAreLoading, topicsError, lastLoadedType } =
    useTopicsStore();

  const { openSettingsModal } = useUIStore();
  const { id: routeId } = useParams<{ id: string }>();
  const { setOpenMobile, isMobile, toggleSidebar, open } = useSidebar();
  const isCollapsed = !open;

  /**
   * Determines the `TopicsType` based on the provided `AssistantType`.
   * This is used to fetch the correct set of topics for the selected model.
   * @param model - The assistant model type.
   * @returns The corresponding topics type.
   */
  const getTopicsTypeForModel = (model: AssistantType): TopicsType => {
    switch (model) {
      case AssistantType.ExplainLaw:
        return TopicsType.Law;
      case AssistantType.ExplainGpt:
        return TopicsType.Gpt;
      case AssistantType.ExplainEstate:
        return TopicsType.Estate;
      default:
        return TopicsType.All;
    }
  };

  useEffect(() => {
    if (!auth?.access_token) {
      return;
    }

    if (pickedModel) {
      const requiredTopicsType = getTopicsTypeForModel(pickedModel);
      if (lastLoadedType !== requiredTopicsType && !topicsAreLoading) {
        getTopics(auth.access_token, requiredTopicsType, TopicStatusRequest.Active);
      }
    } else if (routeId && !topicsAreLoading && lastLoadedType !== TopicsType.All) {
      getTopics(auth.access_token, TopicsType.All, TopicStatusRequest.Active);
    }
  }, [auth?.access_token, pickedModel, routeId, topicsAreLoading, lastLoadedType, getTopics]);

  /**
   * Navigates to the main page to start a new chat.
   * It clears any existing messages and resets the chat state.
   */
  const handleNewChat = () => {
    setMessages([]);
    setPersistedId(undefined);
    if (isMobile) setOpenMobile(false);
    navigate(AppRoutes.Main);
  };

  /**
   * Handles clicking on a topic in the sidebar.
   * Navigates to the chat page for the selected topic.
   * @param topicId - The ID of the topic to open.
   */
  const handleTopicClick = (topicId: number) => {
    navigate(`${AppRoutes.ChatWithId.replace(":id", topicId.toString())}`);
    if (isMobile) setOpenMobile(false);
  };

  /**
   * Navigates to the subscription page.
   */
  const handleUpgradePlan = () => {
    openSettingsModal('subscription');
    if (isMobile) setOpenMobile(false);
  }

  const isLoading = isRefreshing || topicsAreLoading;

  const processedTopics = React.useMemo(() => {
    if (!topics) return [];
    return topics.map(group => {
      return { ...group, displayDate: utils.formatDate(group.date) };
    }).filter(group => group.displayDate !== null || group.topics.length > 0);
  }, [topics]);

  return (
    <ShadcnSidebar
      collapsible="icon"
      className={`rounded-2xl mt-[-2px] border-1 border-[var(--color-border)] m-0 sm:m-[5px] transition-all duration-200 shrink-0 group/sidebar h-[calc(100vh-10px)]`}
    >
      <SidebarHeader
        className={`flex flex-row items-center border-b-0 h-auto 
                    ${isMobile ? 'justify-end' : 'justify-between'}
                    group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:py-2.5 group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:border-b-0`}
      >
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`p-5 text-[var(--color-neutral-text)] bg-[var(--color-neutral-bg)] hover:bg-[var(--color-neutral-bg-hover)] rounded-md h-8 w-8
                            ${isCollapsed ? 'group-data-[state=collapsed]/sidebar:w-full' : ''}`}
          >
            <SvgIcon src="/icons/sidebar.svg" className="h-4 w-4" />
          </Button>
        )}
        <div
          className={`flex items-center gap-[5px] ${isCollapsed && !isMobile ? 'hidden' : ''}`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-[var(--color-neutral-text)] bg-[var(--color-neutral-bg)] hover:bg-[var(--color-neutral-bg-hover)] px-3 py-[20px] h-8 rounded-md flex items-center gap-[7px]"
          >
            <SvgIcon src="/icons/new-chat.svg" className="h-4 w-4" />
            <span className="whitespace-nowrap font-medium" style={{ letterSpacing: "-0.03em" }}>Новый чат</span>
          </Button>
        </div>
      </SidebarHeader>

      <div className={`flex-1 overflow-y-hidden pt-[10px] ${isCollapsed && !isMobile ? 'pl-0' : 'pl-0'}`}>
        <SidebarContent className={`h-full pr-0 scrollbar-thin scrollbar-thumb-[var(--color-neutral-bg)] hover:scrollbar-thumb-[var(--color-neutral-bg-hover)] ${isCollapsed && !isMobile ? 'p-0' : 'pr-[2px] pl-[5px]'}`}>
          <ScrollArea className="h-full w-full">
            <SidebarMenu className={`flex flex-col ${(!processedTopics.length || (isCollapsed && !isMobile)) ? 'gap-1 items-center' : 'gap-0.5 px-1'}`}>
              {isLoading && (
                <SidebarMenuItem className="flex justify-center items-center h-full p-2">
                  <Loader variant="dots" />
                </SidebarMenuItem>
              )}
              {!isLoading && topicsError && (
                <SidebarMenuItem className="flex justify-center items-center h-full p-2">
                  <Loader variant="dots" />
                </SidebarMenuItem>
              )}
              {!isLoading && !topicsError && processedTopics.length === 0 && (
                <SidebarMenuItem className="p-1">
                </SidebarMenuItem>
              )}

              {processedTopics.map(({ date, topics: dateTopics, displayDate }) => (
                (displayDate || dateTopics.length > 0) &&
                <SidebarGroup key={date || 'no-date-group'} className={`p-0 my-1 first:mt-0 ${isCollapsed && !isMobile ? 'w-full flex flex-col pl-[6px]' : ''}`}>
                  {displayDate && !(isCollapsed && !isMobile) && (
                    <SidebarGroupLabel
                      className={`px-[10px] py-1.5 text-sm font-semibold text-[var(--color-neutral-text)] ${isCollapsed && !isMobile ? 'hidden' : ''}`}
                    >
                      {displayDate}
                    </SidebarGroupLabel>
                  )}
                  {dateTopics.map((topic) => (
                    <SidebarMenuItem key={topic.id} className={`p-0 h-auto ${isCollapsed && !isMobile ? 'w-auto' : 'w-full'}`}>
                      <SidebarMenuButton
                        onClick={() => handleTopicClick(topic.id)}
                        isActive={Number(routeId) === topic.id}
                        className={`font-normal rounded-lg group justify-start 
                                              data-[collapsed=true]:justify-center data-[collapsed=true]:h-9 data-[collapsed=true]:w-9 data-[collapsed=true]:p-2
                                              ${Number(routeId) === topic.id
                            ? "bg-[var(--color-sidebar-item-active-bg)]! text-[var(--color-sidebar-item-active-text)]! hover:bg-[var(--color-sidebar-item-active-bg)]! hover:text-[var(--color-sidebar-item-active-text)]!"
                            : "text-[var(--color-sidebar-item-text)] hover:bg-[var(--color-sidebar-item-bg-hover)]"}
                                              ${isCollapsed && !isMobile ? 'data-[collapsed=true]:p-[20px]! ml-[2px]' : 'w-full max-w-[330px] h-auto px-[10px] py-[9.5px]'}`}
                        data-collapsed={isCollapsed && !isMobile}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FileText className={`h-5 w-5 ${!(isCollapsed && !isMobile) ? 'hidden' : ''}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{topic.topic_name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span
                          className={`truncate ${isCollapsed && !isMobile ? 'hidden' : ''}`}
                          style={{ letterSpacing: "-0.02em" }}
                        >
                          {topic.topic_name || "Без названия"}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroup>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </div>

      <SidebarFooter
        className={`p-[20px] mt-auto shrink-0 group-data-[state=collapsed]/sidebar:p-1.5 group-data-[state=collapsed]/sidebar:py-2.5`}
      >
        <Button
          onClick={handleUpgradePlan}
          variant="ghost"
          className={`w-full flex items-center justify-start h-auto p-0 hover:bg-transparent group-data-[state=collapsed]/sidebar:w-auto group-data-[state=collapsed]/sidebar:justify-center`}
        >
          <img
            src="/icons/update-plan.svg"
            alt="Обновить план"
            width={40}
            height={40}
          />
          <div className={`text-left overflow-hidden ml-[10px] group-data-[state=collapsed]/sidebar:hidden`}>
            <p className="text-[var(--color-neutral-text)] font-normal" style={{ letterSpacing: "-0.03em" }}>Обновить план</p>
            <p className="text-[10px] text-[var(--color-text-strong)] font-normal" style={{ letterSpacing: "-0.03em" }}>Больше доступа к функциям</p>
          </div>
        </Button>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export { Sidebar }; 