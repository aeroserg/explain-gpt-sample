import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chat/chatStore";
import { useAuthStore } from "@/store/auth/authStore";
import { useUIStore } from "@/store/ui/uiStore";
import { Button } from "@/components/ui/button";
import {
  AssistantType,
  SenderRole,
  ContentType,
  HistoryMessageResponse,
  AttachmentResponse,
} from "@/api/contracts";
import { AppRoutes } from "@/routes/AppRoutes";
import ChatInputArea from "@/modules/NewChat/ChatInputArea";
import type { Model as ChatHeaderModel } from "@/modules/NewChat/ChatHeader";
import { ContractService } from "@/api/apiService";

/**
 * @interface SendMessageParams
 * @description Defines parameters for sending a message from the Main page to initiate a new chat.
 * @property text The text content of the message.
 * @property attachments Optional array of successfully uploaded attachment details (id, name, type).
 * @property model The selected chat model.
 * @property searchJudicialPractice Flag to search judicial practice.
 * @property searchInternet Flag to search the internet.
 */
interface SendMessageParams {
  text: string;
  attachments?: Array<{ id: string; name: string; type: "image" | "document" }>;
  model: ChatHeaderModel;
  searchJudicialPractice?: boolean;
  searchInternet?: boolean;
}

/**
 * @interface FileUploadResponse
 * @description Defines the expected structure of the JSON response from file upload.
 * @property attachment_id The ID of the uploaded attachment.
 */
interface FileUploadResponse {
  attachment_id: string;
}

const chatHeaderModels: ChatHeaderModel[] = [
  {
    id: "ExplainLaw",
    name: "ExplainLaw",
    assistantType: AssistantType.ExplainLaw,
  },
  {
    id: "ExplainGPT",
    name: "ExplainGPT",
    assistantType: AssistantType.ExplainGpt,
  },
  {
    id: "ExplainEstate",
    name: "ExplainEstate",
    assistantType: AssistantType.ExplainEstate,
  },
];

const modelTitles: Record<AssistantType, string> = {
  [AssistantType.ExplainLaw]:
    "Проконсультируйся<br/>по&nbsp;юридическим вопросам",
  [AssistantType.ExplainGpt]: "Задайте вопрос<br/>по&nbsp;любой теме",
  [AssistantType.ExplainEstate]:
    "Консультация<br/>по&nbsp;нормам строительства",
  [AssistantType.ExplainImg]: "Создание изображений по вашему запросу",
};

/**
 * @component Main
 * @description The main landing page for initiating a new chat. It allows model selection, message input (via ChatInputArea which handles immediate file uploads), and navigates to the chat page upon successful initiation, passing necessary data via chat store's pendingStreamRequestData.
 */
const Main = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const {
    pickedModel,
    setMessages,
    setPersistedId,
    setPendingStreamRequestData,
    messages: chatMessages,
  } = useChatStore();
  const { openSettingsModal } = useUIStore();

  const [uiIsLoading, setUiIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [showLimitExceededError, setShowLimitExceededError] = useState(false);

  const currentChatHeaderModel =
    chatHeaderModels.find((m) => m.assistantType === pickedModel) ||
    chatHeaderModels[0];
  const currentTitle =
    modelTitles[pickedModel ?? AssistantType.ExplainGpt] || "Начните новый чат";

  useEffect(() => {
    setPersistedId(undefined);
    setMessages([]);
  }, [setPersistedId, setMessages]);

  /**
   * @function handleFileUpload
   * @description Handles the upload of a single file. Passed to ChatInputArea.
   * @param {File} file The file to upload.
   * @returns {Promise<{ attachmentId: string } | { error: string }>} The attachment ID or an error object.
   */
  const handleFileUpload = async (
    file: File
  ): Promise<{ attachmentId: string } | { error: string }> => {
    if (!auth?.access_token) {
      const errorMsg = "Пользователь не авторизован для загрузки файла.";
      console.error(errorMsg);
      return { error: errorMsg };
    }

    try {
      const response =
        await ContractService.api.uploadFileApiV2AttachmentsUploadPost(
          { file },
          { headers: { "jwt-token": auth.access_token } }
        );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        let errorMessage = `Ошибка загрузки файла ${file.name}.`;
        if (status === 413) errorMessage = `Файл ${file.name} слишком большой.`;
        else if (errorData.detail)
          errorMessage =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        else
          errorMessage = `Не удалось загрузить файл ${file.name}. Статус: ${status}`;
        console.error("Individual file upload error:", errorMessage);
        return { error: errorMessage };
      }
      const result = (await response.json()) as FileUploadResponse;
      return { attachmentId: result.attachment_id };
    } catch (error: any) {
      console.error("Individual file upload error (catch):", error);
      let errorMessage =
        error.message || `Ошибка загрузки файла ${file.name || ""}`.trim();
      if (error.status === 413)
        errorMessage = `Файл ${file.name || ""} слишком большой.`;
      return { error: errorMessage };
    }
  };

  /**
   * @function handleSendMessage
   * @description Creates a new topic, updates the store with the initial user message and attachment details, sets pending data for stream processing on ChatPage, and navigates to the new chat page.
   * @param {SendMessageParams} messageParams Parameters for the message, including text and successfully uploaded attachment details.
   */
  const handleSendMessage = async (messageParams: SendMessageParams) => {
    if (!auth?.access_token) {
      console.error("User not authenticated");
      setUploadError({
        title: "Ошибка",
        message: "Пользователь не авторизован. Пожалуйста, войдите снова.",
      });
      return;
    }

    const {
      text: currentInputText,
      attachments: currentAttachments = [],
      model: currentModel,
      searchJudicialPractice = false,
      searchInternet = false,
    } = messageParams;

    if (
      !currentInputText.trim() &&
      currentAttachments.length === 0 &&
      !searchJudicialPractice &&
      !searchInternet
    ) {
      if (!searchInternet && !searchJudicialPractice) return;
    }

    setUiIsLoading(true);
    setUploadError(null);
    setShowLimitExceededError(false);
    let topicId: string | number | null = null;
    let userMessageForDisplay: HistoryMessageResponse | null = null;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const newTopicUrl = new URL(`${baseUrl}/api/v2/topics/new`);
      newTopicUrl.searchParams.append(
        "assistant_type",
        currentModel.assistantType
      );

      const newTopicResponse = await fetch(newTopicUrl.toString(), {
        method: "POST",
        headers: {
          "jwt-token": auth.access_token,
        },
      });

      if (!newTopicResponse.ok) {
        const status = newTopicResponse.status;
        if (status === 402 || status === 403) {
          try {
            const errorBody = await newTopicResponse.clone().json();
            if (
              status === 402 ||
              (status === 403 &&
                errorBody.detail === "User has 0 available requests")
            ) {
              setShowLimitExceededError(true);
              setUiIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse error response body:", e);
          }
        }

        const errorData = await newTopicResponse
          .json()
          .catch(() => ({ detail: "Не удалось получить ID нового чата." }));
        const errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
        console.error(
          "Error creating new topic:",
          newTopicResponse.status,
          errorData
        );
        throw new Error(
          errorMessage || `Ошибка создания чата: ${newTopicResponse.statusText}`
        );
      }

      const topicIdData = await newTopicResponse.json();
      topicId = topicIdData;
      if (!topicId) {
        throw new Error("Не удалось получить ID для нового чата от сервера.");
      }
      const topicIdStr = String(topicId);

      //@ts-expect-error type missmatch
      const attachmentsForDisplay: AttachmentResponse[] =
        currentAttachments.map((att) => ({
          filename: att.name,
          content_type:
            att.type === "image" ? ContentType.Image : ContentType.Document,
        }));

      userMessageForDisplay = {
        text: currentInputText,
        role: SenderRole.User,
        created_at: new Date().toISOString(),
        attachments: attachmentsForDisplay,
      };

      setMessages([...chatMessages, userMessageForDisplay]);
      setPersistedId(topicIdStr);

      if (setPendingStreamRequestData) {
        setPendingStreamRequestData({
          topicId: topicIdStr,
          message: {
            text: currentInputText,
            attachments: currentAttachments.map((att) => att.id),
            judicial_practice: searchJudicialPractice,
            web_search: searchInternet,
          },
          assistant_type: currentModel.assistantType,
        });
      } else {
        console.warn(
          "`setPendingStreamRequestData` is not defined in `useChatStore`. ChatPage will not have stream data."
        );
      }

      navigate(AppRoutes.ChatWithId.replace(":id", topicIdStr));
    } catch (error: any) {
      console.error("Main.tsx: Error in handleSendMessage:", error);
      let errorMessage =
        "Произошла ошибка при создании нового чата или отправке сообщения.";
      if (error.uploadError) {
        setUploadError({ title: error.title, message: error.message });
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setUploadError({ title: "Ошибка", message: errorMessage });
    } finally {
      setUiIsLoading(false);

      if (userMessageForDisplay && userMessageForDisplay.attachments) {
        userMessageForDisplay.attachments.forEach((att) => {
          const attWithUrl = att as any;
          if (attWithUrl.url && attWithUrl.url.startsWith("blob:")) {
            URL.revokeObjectURL(attWithUrl.url);
          }
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1
        className="font-medium text-[32px] leading-[39px] tracking-[-0.02em] text-center text-[var(--color-neutral-text)] mb-12"
        dangerouslySetInnerHTML={{ __html: currentTitle }}
      />
      {showLimitExceededError && (
        <div className="flex flex-col items-center gap-4 mb-4 text-center">
          <div className="font-inter text-base text-[#404040] dark:text-gray-300">
            <p>Пакет запросов исчерпан.</p>
            <p>Через 24 часа будет начислено</p>
            <p>3 бесплатных запроса.</p>
            <p>Также вы можете купить подписку</p>
          </div>
          <Button
            onClick={() => openSettingsModal("subscription", "available")}
            className="bg-[#3D7EFF] hover:bg-[#3D7EFF]/90 text-white rounded-lg px-4 py-2"
          >
            Пополнить
          </Button>
        </div>
      )}
      {uploadError && (
        <div className="mb-4 p-3 bg-[var(--color-destructive-bg)]/20 border-[var(--color-destructive-bg)] text-[var(--color-destructive-text-on-light-bg)] rounded">
          <strong className="font-bold">{uploadError.title}: </strong>
          <span className="block sm:inline">{uploadError.message}</span>
        </div>
      )}
      <div className="w-full max-w-[766px]">
        <ChatInputArea
          selectedModel={currentChatHeaderModel}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          isSendingMessage={uiIsLoading}
        />
      </div>
    </div>
  );
};

export default Main;
