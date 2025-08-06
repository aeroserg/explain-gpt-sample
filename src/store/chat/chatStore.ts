import { ContractService } from "@/api/apiService";
import { AssistantType, HistoryMessageResponse, Limit } from "@/api/contracts";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface PendingStreamRequestData {
  topicId: string;
  message: {
    text: string;
    attachments: string[]; // array of attachment IDs
    judicial_practice: boolean;
    web_search: boolean;
  };
  assistant_type: AssistantType;
}

interface ChatStateSchema {
  messages: HistoryMessageResponse[];
  messagesAreLoading: boolean;
  pickedModel?: AssistantType;
  inputText: string;
  persistedId?: string;
  messageError?: string;
  attachments?: File[];
  limits?: Limit;
  limitsAreLoading: boolean;
  pendingStreamRequestData?: PendingStreamRequestData;
  setInputText: (text: string) => void;
  setMessages: (topics: HistoryMessageResponse[]) => void;
  setMessageError: (error: string) => void;
  setMessagesAreLoading: (areLoading: boolean) => void;
  setPickedModel: (model: AssistantType) => void;
  setPersistedId: (id: string | undefined) => void;
  setAttachments: (attachments: File[]) => void;
  setLimits: (limits: number) => void;
  setPendingStreamRequestData: (data?: PendingStreamRequestData) => void;
  getMessages: (id: number, token: string) => Promise<void>;
  getLimits: (token: string) => Promise<void>;
  reset: () => void;
}

export const useChatStore = create<ChatStateSchema>()(
  immer((set) => ({
    messages: [],
    messagesAreLoading: false,
    pickedModel: undefined,
    inputText: "",

    limitsAreLoading: false,
    setLimits: (limits) => {
      set((state) => {
        if (state.limits?.available_requests) {
          const currLimits = state.limits.available_requests;
          state.limits.available_requests = currLimits + limits;
        }
      });
    },
    setInputText: (text: string) => {
      set((state) => {
        state.inputText = text;
      });
    },
    setMessages: (messages: HistoryMessageResponse[]) => {
      set((state) => {
        state.messages = messages;
      });
    },
    setMessageError: (error: string) => {
      set((state) => {
        state.messageError = error;
      });
    },
    setMessagesAreLoading: (areLoading: boolean) => {
      set((state) => {
        state.messagesAreLoading = areLoading;
      });
    },
    setPickedModel: (model: AssistantType) => {
      set((state) => {
        state.pickedModel = model;
      });
    },
    setPersistedId: (id: string | undefined) => {
      set((state) => {
        state.persistedId = id;
      });
    },
    setAttachments: (attachments: File[]) => {
      set((state) => {
        state.attachments = attachments;
      });
    },
    setPendingStreamRequestData: (data?: PendingStreamRequestData) => {
      set((state) => {
        state.pendingStreamRequestData = data;
      });
    },
    reset: () => {
      set((state) => {
        state.messages = [];
        state.messagesAreLoading = false;
        state.pickedModel = undefined;
        state.inputText = "";
        state.persistedId = undefined;
        state.messageError = undefined;
        state.attachments = undefined;
        state.limits = undefined;
        state.limitsAreLoading = false;
        state.pendingStreamRequestData = undefined;
      });
    },
    getMessages: async (id, token) => {
      try {
        const response =
          await ContractService.api.getTopicHistoryApiV2TopicsTopicIdHistoryGet(
            id,
            { headers: { "jwt-token": token } }
          );
        if (!response.ok) {
          throw Error();
        }
        const data = await response.json();
        set((state) => {
          state.messages = data;
          state.messageError = undefined;
        });
      } catch {
        set((state) => {
          state.messageError =
            "Ошибка загрузки сообщения, повторите попытку позже.";
        });
      } finally {
        set((state) => {
          state.messagesAreLoading = false;
        });
      }
    },
    getLimits: async (token) => {
      set((state) => {
        state.limitsAreLoading = true;
      });
      try {
        const response =
          await ContractService.api.getUserLimitsByUidApiV2LimitsGet({
            headers: { "jwt-token": token },
          });
        const data: Limit = await response.json();
        set((state) => {
          state.limits = data;
        });
      } catch {
      } finally {
        set((state) => {
          state.limitsAreLoading = false;
        });
      }
    },
  }))
);
