
import {  Outlet } from "react-router";
import { ResponsiveUserEditSidebar } from "./components/ResponsiveUserEditSidebar";
export const UserEditLayout = () => {


  return (
    <div className="flex h-screen">
      <ResponsiveUserEditSidebar />
      <main className="bg-white grow lg:py-[125px] lg:px-[105px] p-6 overflow-y-scroll no-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};
