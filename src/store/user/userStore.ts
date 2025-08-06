import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { NonPasswordUser, Subscription } from "@/api/contracts";

interface UserStoreSchema {
  isLoading: boolean;
  isEditing: boolean;
  subscription?: Subscription;
  userInfo?: NonPasswordUser;
  setIsLoading: (isLoading: boolean) => void;
  setIsEditing: (isLoading: boolean) => void;
  setUserInfo: (info: NonPasswordUser) => void;
  setSubscription: (sub: Subscription) => void;
}

export const useUserStore = create<UserStoreSchema>()(
  immer((set) => ({
    isLoading: true,
    isEditing: false,
    setUserInfo(info) {
      set((state) => {
        state.userInfo = info;
      });
    },
    setIsLoading(isLoading) {
      set((state) => {
        state.isLoading = isLoading;
      });
    },
    setIsEditing(isEditing) {
      set((state) => {
        state.isEditing = isEditing;
      });
    },
    setSubscription(sub) {
      set((state) => {
        state.subscription = sub;
      });
    },
  }))
);
