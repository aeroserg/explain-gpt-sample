import {
  Api
} from "./contracts/contract";
import type{
  MessageRequest,
  StartConversationRequest,
} from "./contracts/contract";
import { useAuthStore } from "@/store/auth/authStore";

export const ContractService = new Api({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  securityWorker: () => {
    const token = useAuthStore.getState().auth?.access_token;
    if(token) {
      return {
        headers: {
          "jwt-token": token,
        }
      }
    }
    return {};
  }
});

export const initNewDialog = async ({
  baseReq,
  token,
}: {
  baseReq: StartConversationRequest;
  token: string;
}) => {
  return await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v2/topics/start/stream/`,
    {
      headers: {
        "jwt-token": token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(baseReq),
    }
  );
};

export const sendMessage = async ({
  id,
  req,
  token,
}: {
  id: number;
  req: MessageRequest;
  token: string;
}) => {
  return ContractService.api.processUserMessageStreamingApiV2TopicsTopicIdMessageStreamPost(
    id,
    req,
    {
      headers: { "jwt-token": token },
      format: null as any,
    }
  );
};
