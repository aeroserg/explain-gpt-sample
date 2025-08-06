import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TopicsListSchema, TopicsType, TopicStatusRequest } from "@/api/contracts";
import { ContractService } from "@/api/apiService";

interface TopicsStateSchema {
  topicsAreLoading: boolean;
  topicsError?: string;
  topics?: TopicsListSchema[];
  lastLoadedType?: TopicsType;
  setTopicsAreLoading: (loading: boolean) => void;
  setTopics: (topics: TopicsListSchema[]) => void;
  /* createTopic: (
    text: string,
    assistant_type: AssistantType,
    token: string,
    attachments?: string[]
  ) => Promise<void>; */
  getTopics: (token: string, topicType: TopicsType, status: TopicStatusRequest) => Promise<void>;
  reset: () => void;
}

export const useTopicsStore = create<TopicsStateSchema>()(
  immer((set) => ({
    topicsAreLoading: false,
    setTopics: (topics) =>
      set((state) => {
        state.topics = topics;
      }),
    setTopicsAreLoading: (areLoading) => {
      set((state) => {
        state.topicsAreLoading = areLoading;
      });
    },
    reset: () => {
      set((state) => {
        state.topics = undefined;
        state.topicsAreLoading = false;
        state.topicsError = undefined;
        state.lastLoadedType = undefined;
      });
    },
    getTopics: async (token, topicType, status) => {
      set((state) => {
        state.topicsAreLoading = true;
        state.topicsError = undefined;
      });
      try {
        const response = await ContractService.api.getTopicListApiV2TopicsTopicTypeStatusGet(
          status,
          topicType,
          {
            topics_type: topicType,
            folder_id: undefined,
          },
          {
            headers: { "jwt-token": token },
          }
        );

        if (!response.ok) {
          let errorDetail = "Ошибка загрузки чатов, повторите попытку позже.";
          try {
            const errorData = await response.json();
            if (errorData && errorData.detail) {
              errorDetail = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
            } else {
              errorDetail = `Ошибка ${response.status}: ${response.statusText}`;
            }
          } catch (e) {
            errorDetail = `Ошибка ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorDetail);
        }
        
        const data = await response.json();
        set((state) => {
          state.topics = data;
          state.topicsError = undefined;
          state.lastLoadedType = topicType;
        });
      } catch (error: any) {
        set((state) => {
          state.topicsError = error.message || "Ошибка загрузки чатов, повторите попытку позже.";
        });
      } finally {
        set((state) => {
          state.topicsAreLoading = false;
        });
      }
    },
    /*
    createTopic: async (
      text: string, // TS6133
      assistant_type: AssistantType, // TS6133
      token: string, // TS6133
      attachments?: string[] // TS6133
    ) => {
      try {
        const messageRequestProperties: string[] = []; // TS6133

        const response =
          await ContractService.api.newTopicStreamingApiV2TopicsTopicIdStartStreamPost(
          ); // TS2554

        if (!response.ok) {
          throw Error();
        }

        const data = await response.json();
        set((state) => {
          if (state.topics) {
            state.topics = [...state.topics, data];
          } else {
            state.topics = [data];
          }
          state.topicsError = undefined;
        });
      } catch {
        set((state) => {
          state.topicsError = "Ошибка создания чата, повторите попытку позже.";
        });
      } finally {
        set((state) => {
          state.topicsAreLoading = false;
        });
      }
    },*/
  }))
);
