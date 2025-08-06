"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/libs/utils/shadcnUtils';
import ChatHeader from '../modules/NewChat/ChatHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '../modules/NewChat/Sidebar';
import SettingsModal from '@/modules/Settings/SettingsModal';
import { useUIStore } from '@/store/ui/uiStore';

/**
 * @component ChatPageLayout
 * @description Provides the main layout structure for chat pages, including the sidebar, header, and main content area for chat messages and input.
 */
export const ChatPageLayout: React.FC = () => {
  const { isSettingsModalOpen, closeSettingsModal } = useUIStore();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full p-[5px] box-border">
        <Sidebar />
        <div className={cn("sm:pl-[5px] flex-1 flex flex-col")}>
          <ChatHeader />
          <main className="flex-1 flex flex-col overflow-hidden bg-[var(--color-background-card)] rounded-xl border-1 border-[var(--color-border)] z-10 sm:z-0 relative">
            <Outlet />
          </main>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />
    </SidebarProvider>
  );
}; 