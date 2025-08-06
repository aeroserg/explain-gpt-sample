import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useChatStore } from "@/store/chat/chatStore";

import { useAuthStore } from "@/store/auth/authStore";
import { MessageList } from "@/libs/ui";

export default function Chat() {
  const { auth } = useAuthStore();
  const {
    messages,
    getMessages,
    messagesAreLoading,
    setMessages,
    setMessagesAreLoading,
    persistedId,
    setPersistedId,
  } = useChatStore();

  const { id } = useParams();

  useEffect(() => {
    if (auth?.access_token && typeof id === "string") {
      getMessages(Number(id), auth.access_token);
    }
  }, [id, auth?.access_token, getMessages]);

  useEffect(() => {
    setMessages([]);
    setMessagesAreLoading(true);
  }, [id]);

  useEffect(() => {
    if (persistedId) {
      setPersistedId(undefined);
    }
  }, [persistedId]);

  return <MessageList messages={messages} isLoading={messagesAreLoading} />;
}
