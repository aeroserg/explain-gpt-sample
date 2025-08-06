"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Model as ChatHeaderModel } from '@/modules/NewChat/ChatHeader';
import { useChatStore } from '@/store/chat/chatStore';
import { useAuthStore } from '@/store/auth/authStore';
import type { ChatMessage } from './ChatMessageArea';
import {
  HistoryMessageResponse,
  SenderRole,
  AttachmentResponse,
  ContentType,
  AssistantType,
  TopicsType,
  TopicStatusRequest,
  StartConversationRequest
} from "@/api/contracts";
import ChatMessageArea from './ChatMessageArea';
import ChatInputArea from './ChatInputArea';
import { utils } from "@/libs/utils";
import { ContractService, sendMessage as apiSendMessage } from "@/api/apiService";
import { useTopicsStore } from "@/store/topics/topicsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SendMessageParams {
  text: string;
  attachments?: Array<{ id: string; name: string; type: 'image' | 'document' }>;
  model: ChatHeaderModel;
  searchJudicialPractice?: boolean;
  searchInternet?: boolean;
}

const ChatPage: React.FC = () => {
  const { auth } = useAuthStore();
  const {
    messages,
    getMessages,
    messagesAreLoading,
    setMessages,
    setMessagesAreLoading,
    pickedModel,
    setPickedModel,
    getLimits,
    pendingStreamRequestData,
    setPendingStreamRequestData,
  } = useChatStore();
  const { id } = useParams<{ id: string }>();
  const { setTopics, topics, getTopics } = useTopicsStore();
  const [uploadError, setUploadError] = useState<{ title: string; message: string } | null>(null);
  const [streamingAssistantMessageId, setStreamingAssistantMessageId] = useState<string | null>(null);
  const assistantMessageStreamRef = useRef<string>("");
  const assistantMessageCreatedAtRef = useRef<string | null>(null);
  const initialStreamHandledForId = useRef<string | null>(null);
  const isProcessingInitialStream = useRef(false);
  const [initialJudicialPracticeForInput, setInitialJudicialPracticeForInput] = useState<boolean>(false);
  const [initialInternetSearchForInput, setInitialInternetSearchForInput] = useState<boolean>(false);

  /**
   * Effect to set the model based on the topic ID from the URL.
   * When a topic is opened directly, this finds the corresponding
   * topic information and sets the appropriate AI model in the store.
   */
  useEffect(() => {
    if (id && topics && !pickedModel) {
      for (const topicGroup of topics) {
        const foundTopic = topicGroup.topics.find(topic => topic.id === Number(id));
        if (foundTopic) {
          setPickedModel(foundTopic.assistant_type);
          break;
        }
      }
    }
  }, [id, topics, pickedModel, setPickedModel]);

  /**
   * Effect to fetch topics when the selected model changes.
   * It ensures that the sidebar displays the correct list of topics
   * corresponding to the currently active model.
   */
  useEffect(() => {
    if (pickedModel && auth?.access_token) {
      const getTopicsTypeForModel = (model: AssistantType): TopicsType => {
        switch (model) {
          case AssistantType.ExplainLaw: return TopicsType.Law;
          case AssistantType.ExplainGpt: return TopicsType.Gpt;
          case AssistantType.ExplainEstate: return TopicsType.Estate;
          default: return TopicsType.All;
        }
      };
      
      const requiredTopicsType = getTopicsTypeForModel(pickedModel);
      
      const { lastLoadedType, topicsAreLoading } = useTopicsStore.getState();
      if (lastLoadedType !== requiredTopicsType && !topicsAreLoading) {
        getTopics(auth.access_token, requiredTopicsType, TopicStatusRequest.Active);
      }
    }
  }, [pickedModel, auth?.access_token, getTopics]);

  /**
   * Effect to fetch messages for a topic.
   * This runs when the topic ID changes and ensures the chat history
   * for the selected topic is loaded.
   */
  useEffect(() => {
    if (id !== initialStreamHandledForId.current) {
      initialStreamHandledForId.current = null;
    }

    if (auth?.access_token && id && !pendingStreamRequestData && initialStreamHandledForId.current !== id) {
      setMessages([]);
      setMessagesAreLoading(true);
      getMessages(Number(id), auth.access_token);
    }
  }, [id, auth?.access_token, getMessages, pendingStreamRequestData, setMessages, setMessagesAreLoading]);

  /**
   * Effect to handle pending stream requests.
   * This is used when a new chat is initiated from the main page,
   * carrying over the initial message and settings to the new chat page.
   */
  useEffect(() => {
    if (pendingStreamRequestData && id && pendingStreamRequestData.topicId === id && auth?.access_token) {
      if (isProcessingInitialStream.current) {
        return;
      }
      isProcessingInitialStream.current = true;

      const { message: pendingMessage, assistant_type } = pendingStreamRequestData;

      if (pickedModel !== assistant_type) {
        setPickedModel(assistant_type);
      }

      if (id !== initialStreamHandledForId.current) {
        setInitialJudicialPracticeForInput(pendingMessage.judicial_practice ?? false);
        setInitialInternetSearchForInput(pendingMessage.web_search ?? false);
      }
      setMessagesAreLoading(true);

      assistantMessageCreatedAtRef.current = new Date().toISOString();
      assistantMessageStreamRef.current = "";
      const placeholderAssistantMessage: HistoryMessageResponse = {
        text: "",
        role: SenderRole.Assistant,
        created_at: assistantMessageCreatedAtRef.current,
        attachments: [],
      };

      const currentStoreMessages = useChatStore.getState().messages;
      let messagesToShow = [...currentStoreMessages];
      if (!messagesToShow.find(msg => msg.created_at === assistantMessageCreatedAtRef.current && msg.role === SenderRole.Assistant)) {
        messagesToShow.push(placeholderAssistantMessage);
      }
      setMessages(messagesToShow);
      setStreamingAssistantMessageId(assistantMessageCreatedAtRef.current);

      const messageProperties: string[] = [];
      if (pendingMessage.judicial_practice) messageProperties.push("judicial_practice");
      if (pendingMessage.web_search) messageProperties.push("web_search");

      const startConversationRequest: StartConversationRequest = {
        message: {
          text: pendingMessage.text,
          attachments: pendingMessage.attachments,
          properties: messageProperties.length > 0 ? messageProperties : [],
        },
        assistant_type: assistant_type,
      };

      ContractService.api.newTopicStreamingApiV2TopicsTopicIdStartStreamPost(
        Number(id),
        startConversationRequest,
        { headers: { "jwt-token": auth.access_token }, format: null as any }
      )
        .then(response => {
          utils.processChunk(
            response,
            undefined,
            handleChunkForStore,
            handleStreamEndForStore
          );
        })
        .catch(async (error) => {
          console.error("ChatPage: Error initiating initial stream from pending data:", error);
          console.error("ChatPage: Error status:", error.response?.status);
          console.error("ChatPage: Error details:", error);
          await handleStreamError(error);
          setMessagesAreLoading(false);
        })
        .finally(() => {
          initialStreamHandledForId.current = id;
          setPendingStreamRequestData(undefined);
          isProcessingInitialStream.current = false;
        });
    } else if (pendingStreamRequestData && id && pendingStreamRequestData.topicId !== id) {
      setPendingStreamRequestData(undefined);
    }
  }, [id, pendingStreamRequestData, auth?.access_token, setPendingStreamRequestData, setMessages, setMessagesAreLoading, pickedModel, setPickedModel]);

  /**
   * Handles incoming chunks of data from the message stream.
   * It appends the new chunk to the existing message content for the streaming assistant message.
   * @param chunk - A string containing a piece of the streamed response.
   */
  const handleChunkForStore = (chunk: string) => {
    if (!assistantMessageCreatedAtRef.current) return;
    assistantMessageStreamRef.current += chunk;
    setMessages(
      useChatStore.getState().messages.map(msg => 
        msg.created_at === assistantMessageCreatedAtRef.current && msg.role === SenderRole.Assistant
        ? {...msg, text: assistantMessageStreamRef.current}
        : msg
      )
    )
  };

  /**
   * Finalizes the message stream. It processes the complete response,
   * handles potential limit errors, resets streaming-related state,
   * and refreshes the topics list.
   */
  const handleStreamEndForStore = async () => {
    const result = assistantMessageStreamRef.current
    
    const isLimitError = result.includes(`{"detail":"User has 0 available requests"}`) ;
    console.log(result)
    if (isLimitError) {
      
      const currentMsgs = useChatStore.getState().messages;
      let filteredMsgs = currentMsgs.filter(
        (msg) => msg.created_at !== assistantMessageCreatedAtRef.current
      );
      const limitExceededMessage: HistoryMessageResponse & { type?: string } = {
          role: SenderRole.Assistant,
          created_at: new Date().toISOString(),
          text: "",
          attachments: [],
          type: 'limit_exceeded',
      };
      setMessages([...filteredMsgs, limitExceededMessage]);
    }

    setStreamingAssistantMessageId(null);
    assistantMessageCreatedAtRef.current = null;
    assistantMessageStreamRef.current = "";
    setMessagesAreLoading(false);
    if (id && auth?.access_token) {
      try {
        const reqHeaders = { headers: { "jwt-token": auth!.access_token } };
        const modelTopicsType = (() => {
          switch (pickedModel) {
            case AssistantType.ExplainLaw: return TopicsType.Law;
            case AssistantType.ExplainGpt: return TopicsType.Gpt;
            case AssistantType.ExplainEstate: return TopicsType.Estate;
            default: return TopicsType.All;
          }
        })();

        const topicsResponse = await ContractService.api.getTopicListApiV2TopicsTopicTypeStatusGet(
          TopicStatusRequest.Active,
          modelTopicsType,
          {
            topics_type: modelTopicsType,
            folder_id: undefined
          },
          reqHeaders
        );
        setTopics(await topicsResponse.json());
      } catch (topicsError) {
        console.error("Error fetching topics after stream end:", topicsError);
      }
    }
  };

  /**
   * Handles errors that occur during the message stream.
   * It ensures that partial messages are handled gracefully and displays
   * an error message, such as for expired limits.
   * @param error - The error object caught during the streaming process.
   */
  const handleStreamError = async (error: any) => {
    console.error("ChatPage: Stream error caught:", error);
    console.error("ChatPage: Error response:", error.response);
    console.error("ChatPage: Error response status:", error.response?.status);
  
    const currentMsgs = useChatStore.getState().messages;
  
    const streamingMessage = currentMsgs.find(
      (msg) => msg.created_at === assistantMessageCreatedAtRef.current
    );
  
    let finalMessages = currentMsgs;
  
    if (streamingMessage && !streamingMessage.text) {
      finalMessages = currentMsgs.filter(
        (msg) => msg.created_at !== assistantMessageCreatedAtRef.current
      );
    } else if (streamingMessage) {
      // If there's already some text, keep it but stop streaming.
      finalMessages = currentMsgs.map(msg => 
        msg.created_at === assistantMessageCreatedAtRef.current ? { ...msg, isStreaming: false } : msg // Assuming isStreaming is a property
      );
    }
  
    // Handle case where error is a Response object itself or has a response property
    let errorResponse = error.response || (error instanceof Response ? error : null);
    console.error("ChatPage: Processing error response:", errorResponse);
    
    if (errorResponse && (errorResponse.status === 402 || errorResponse.status === 403)) {
      console.error("ChatPage: Found 402 or 403 error, checking details");
      let showLimitExceeded = false;
      if (errorResponse.status === 402) {
        console.error("ChatPage: 402 error - showing limit exceeded");
        showLimitExceeded = true;
      } else if (errorResponse.status === 403) {
        console.error("ChatPage: 403 error - checking detail message");
        try {
          const errorBody = await errorResponse.clone().json(); 
          console.error("ChatPage: 403 error body:", errorBody);
          if (errorBody.detail === "User has 0 available requests") {
            console.error("ChatPage: 403 error confirmed - showing limit exceeded");
            showLimitExceeded = true;
          }
        } catch (e) {
          console.error("Failed to parse error response body for 403:", e);
        }
      }

      if (showLimitExceeded) {
        console.error("ChatPage: Adding limit exceeded message");
        const limitExceededMessage: HistoryMessageResponse & { type?: string } = {
          role: SenderRole.Assistant,
          created_at: new Date().toISOString(),
          text: "",
          attachments: [],
          type: 'limit_exceeded',
        };
        finalMessages.push(limitExceededMessage);
      }
    }
    
    console.error("ChatPage: Setting final messages:", finalMessages);
    setMessages(finalMessages);
  
    setStreamingAssistantMessageId(null);
    assistantMessageCreatedAtRef.current = null;
    assistantMessageStreamRef.current = "";
    setMessagesAreLoading(false);
  };

  /**
   * Sends a new message. It constructs the user message, sets up a placeholder for the
   * assistant's response, and initiates a streaming request to the backend.
   * @param messageParams - An object containing the message text, attachments, model, and search settings.
   */
  const handleSendMessage = async (messageParams: SendMessageParams) => {
    const { text, attachments, searchJudicialPractice, searchInternet } = messageParams;
    if (!auth?.access_token) return;

    const userMessage = utils.createUserMessage(text, attachments || []); 

    assistantMessageCreatedAtRef.current = new Date().toISOString();
    assistantMessageStreamRef.current = "";

    const placeholderAssistantMessage: HistoryMessageResponse = {
      text: "",
      role: SenderRole.Assistant,
      created_at: assistantMessageCreatedAtRef.current,
      attachments: [],
    };
    
    const currentMessages = useChatStore.getState().messages;
    setMessages([...currentMessages, userMessage, placeholderAssistantMessage]);

    setStreamingAssistantMessageId(assistantMessageCreatedAtRef.current);
    setMessagesAreLoading(true);

    const messageProperties: string[] = [];
    if (searchJudicialPractice) messageProperties.push("judicial_practice");
    if (searchInternet) messageProperties.push("web_search");

    try {
      const streamResponse = await apiSendMessage({
        id: Number(id),
        req: {
          text: text,
          attachments: attachments?.map(att => att.id) || [],
          properties: messageProperties.length > 0 ? messageProperties : [],
        },
        token: auth.access_token,
      });
      
      utils.processChunk(
        streamResponse,
        undefined,
        handleChunkForStore,
        handleStreamEndForStore
      );

    } catch (error: any) {
      await handleStreamError(error);
    } finally {
      if (auth?.access_token) getLimits(auth.access_token);
      // URL.revokeObjectURL for locally created attachment URLs is handled in ChatInputArea
    }
  };

  const chatMessages: ChatMessage[] = messages.map((msg, index) => ({
    id: `${msg.created_at}-${index}`,
    role: msg.role === SenderRole.User ? 'user' : 'assistant',
    content: msg.text,
    type: (msg as any).type,
    user: msg.role === SenderRole.User ? { name: "Вы", avatarFallback: "B" } : undefined,
    modelName: msg.role === SenderRole.Assistant ? 'ExplainGPT' : undefined,
    isStreaming: msg.created_at === streamingAssistantMessageId && msg.role === SenderRole.Assistant,
    attachments: msg.attachments?.map((att: AttachmentResponse) => {
      let url = att.url;
      if (!url) {
        url = `${ContractService.baseUrl}/api/v2/topics/${id}/messages/${msg.created_at}/attachments/${att.filename}`;
      }
      
      return {
        id: `${msg.created_at}-${att.filename}`, // A stable ID for React keys
        name: att.filename,
        type: (att.content_type === ContentType.Image) ? 'image' : 'document',
        url: url,
      };
    }) || []
  }));

  const inputAreaModel: ChatHeaderModel | undefined = (() => {
    if (typeof pickedModel === 'undefined' || !AssistantType) {
      return undefined;
    }
    const modelKey = (Object.keys(AssistantType) as Array<keyof typeof AssistantType>)
      .find(key => AssistantType[key] === pickedModel);

    if (modelKey) {
      return {
        id: modelKey,
        name: modelKey,
        assistantType: pickedModel,
      };
    }
    return undefined;
  })();

  const finalInputAreaModel = inputAreaModel || {
    id: "ExplainGpt",
    name: "ExplainGPT",
    assistantType: AssistantType.ExplainGpt,
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessageArea messages={chatMessages} isLoading={messagesAreLoading} assistantType={pickedModel} />
      <ChatInputArea
        selectedModel={finalInputAreaModel}
        onSendMessage={handleSendMessage}
        isSendingMessage={messagesAreLoading}
        initialSearchJudicialPractice={initialJudicialPracticeForInput}
        initialSearchInternet={initialInternetSearchForInput}
        onFileUpload={async (file: File): Promise<{ attachmentId: string } | { error: string }> => { 
          if (!auth?.access_token) {
            const errorMsg = "Пользователь не авторизован для загрузки файла.";
            console.error("onFileUpload (ChatPage):", errorMsg);
            return { error: errorMsg };
          }
          
          try {
            const response = await ContractService.api.uploadFileApiV2AttachmentsUploadPost(
              { file },
              { headers: { "jwt-token": auth.access_token } }
            );
      
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              const status = response.status;
              let errorMessage = `Ошибка загрузки файла ${file.name}.`;
              if (status === 413) errorMessage = `Файл ${file.name} слишком большой.`;
              else if (errorData.detail) errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
              else errorMessage = `Не удалось загрузить файл ${file.name}. Статус: ${status}`;
              console.error("onFileUpload (ChatPage) - Individual file upload error:", errorMessage);
              return { error: errorMessage };
            }
            const result = await response.json() as { attachment_id: string };
            return { attachmentId: result.attachment_id };
          } catch (error: any) {
            console.error("onFileUpload (ChatPage) - Individual file upload error (catch):", error);
            let errorMessage = error.message || `Ошибка загрузки файла ${file.name || ''}`.trim();
            if (error.status === 413) errorMessage = `Файл ${file.name || ''} слишком большой.`;
            return { error: errorMessage };
          }
        }}
      />
      {uploadError && (
        <Dialog open={!!uploadError} onOpenChange={() => setUploadError(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{uploadError.title}</DialogTitle>
            </DialogHeader>
            <p>{uploadError.message}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatPage; 