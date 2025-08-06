import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { ChatPageLayout } from "@/layouts/ChatPageLayout";

import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "@/providers/AuthProvider";
import { UserEditLayout } from "@/layouts/UserEditLayout";
import { SuspenseFallback } from "@/layouts/components";
import MainPageWrapper from "@/modules/Main/MainPageWrapper";

const Main = lazy(async () => import("@/modules/Main"));

const Login = lazy(async () => import("@/modules/Login"));

const ChatPage = lazy(async () => import("@/modules/NewChat/ChatPage"));

const RegisterV2 = lazy(async () => import("@/modules/Register/RegisterV2"));

const User = lazy(async () => import("@/modules/User"));

const Subscription = lazy(async () => import("@/modules/Subscription"));

const Checkout = lazy(async () => import("@/modules/Checkout"));

const NotFound = lazy(async () => import("@/modules/NotFound"));

export const routes = () => createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: AppRoutes.Login,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: AppRoutes.Register,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <RegisterV2 />
          </Suspense>
        ),
      },
      {
        path: AppRoutes.Main,
        element: <MainPageWrapper />,
        children: [
          { index: true, element: <Main /> },
        ],
      },
      {
        path: AppRoutes.NewChat,
        element: <ChatPageLayout />,
        children: [
          { index: true, element: <ChatPage /> },
        ],
      },
      {
        path: AppRoutes.ChatWithId,
        element: <ChatPageLayout />,
        children: [
          { index: true, element: <ChatPage /> },
        ],
      },
      {
        path: AppRoutes.User,
        element: <UserEditLayout />,
        children: [{ index: true, element: <User /> }],
      },
      {
        path: AppRoutes.Subscription,
        element: <MainLayout />,
        children: [{ index: true, element: <Subscription /> }],
      },
      {
        path: AppRoutes.Checkout,
        element: <Checkout />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
