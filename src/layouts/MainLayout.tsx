import { Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SuspenseFallback } from "./components";
import { AppRoutes } from "@/routes/AppRoutes";
// import { ResponsiveSidebar } from "./components/ResponsiveSidebar"; // Deleted component

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== "default";

  return (
    <div className="flex h-screen">
      {/* <ResponsiveSidebar /> */}{/* Placeholder: Determine if MainLayout needs a sidebar and which one */}
      <main className="h-full grow lg:p-[60px] p-2 pb-4 pt-18">
        <div className="flex flex-col justify-between h-full mx-auto max-w-[1200px]">
          {canGoBack && (
            <button
              onClick={() => navigate(AppRoutes.Main)}
              className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm self-start"
            >
              Назад
            </button>
          )}
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};
