import classNames from "classnames";

import { ChangeEvent, KeyboardEvent, memo } from "react";
import { useParams } from "react-router";

import { useChatStore } from "@/store/chat/chatStore";
import { useAuthStore } from "@/store/auth/authStore";

import { AutoResizeInput, Button } from "@/libs/ui";

import { ImageBadge } from "./ImageBadge";
import { FileBadge } from "./FileBadge";
import { utils } from "@/libs/utils";
import { ContractService, initNewDialog, sendMessage } from "@/api/apiService";
import {
  SenderRole,
  TopicsType,
  TopicStatusRequest,
  AssistantType,
} from "@/api/contracts";
import { useTopicsStore } from "@/store/topics/topicsStore";

import { Paperclip, CornerDownLeft } from "lucide-react";

export const MessageInput = memo(() => {
  const { id } = useParams();

  const { auth } = useAuthStore();

  const { setTopics } = useTopicsStore();

  const {
    attachments,
    setAttachments,
    limits,
    setInputText,
    persistedId,
    setMessagesAreLoading,
    inputText,
    setMessages,
    messages,
    pickedModel,
    setPersistedId,
    getLimits,
    messagesAreLoading,
  } = useChatStore();

  const noReqs = limits?.available_requests === 0;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setInputText(e.target.value);

  const isInitializedChat = id !== undefined || persistedId !== undefined;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey) {
      onSendMessage();
    }
  };

  const onDeleteAttachment = (name: string) => {
    if (attachments) {
      setAttachments(attachments?.filter((att) => att.name !== name));
    }
  };

  const onSendMessage = async () => {
    if (!auth?.access_token) return;
    setInputText("");
    setMessagesAreLoading(true);
    let files: File[] = [];
    if (attachments) {
      files = [...attachments];
      setAttachments([]);
    }

    const reqHeaders = { headers: { "jwt-token": auth.access_token } };

    const userMessage = utils.createUserMessage(
      inputText,
      attachments?.map((file) => ({
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
      }))
    );
    setMessages([...messages, userMessage]);

    try {
      if (!isInitializedChat) {
        let ids: string[] = [];
        if (attachments && attachments?.length > 0) {
          const res = await Promise.all(
            files.map((file) =>
              ContractService.api.uploadFileApiV2AttachmentsUploadPost(
                { file },
                reqHeaders
              )
            )
          );
          const jsonValues = await Promise.all(
            res.map(async (r) => await r.json())
          );
          ids = jsonValues.map((jsonValue) => jsonValue.attachment_id);
        }

        const response = await initNewDialog({
          baseReq: {
            message: {
              text: inputText,
              attachments: ids,
            },
            assistant_type: pickedModel ?? AssistantType.ExplainGpt,
          },
          token: auth.access_token,
        });

        const setAction = (text: string) =>
          setMessages([
            ...messages,
            userMessage,
            {
              text,
              role: SenderRole.Assistant,
              created_at: new Date().toISOString(),
              attachments: [],
            },
          ]);

        await utils.processChunk(response, setAction, setPersistedId);
        const topicsResponse = await ContractService.api.getTopicListApiV2TopicsTopicTypeStatusGet(
          TopicStatusRequest.Active,
          "all", 
          { topics_type: TopicsType.All },
          reqHeaders
        );
        setTopics(await topicsResponse.json());
      } else if (id || persistedId) {
        const response = await sendMessage({
          id: Number(id || persistedId),
          req: { text: inputText },
          token: auth.access_token,
        });

        await utils.processChunk(response, (text) =>
          setMessages([
            ...messages,
            userMessage,
            {
              text,
              role: SenderRole.Assistant,
              created_at: new Date().toISOString(),
              attachments: [],
            },
          ])
        );
      }
    } catch {
      setMessages([
        ...messages,
        userMessage,
        {
          text: "Упс, что-то пошло не так...",
          role: SenderRole.Assistant,
          created_at: new Date().toISOString(),
          attachments: [],
        },
      ]);
    } finally {
      setMessagesAreLoading(false);
      getLimits(auth.access_token);
    }
  };

  return (
    <div className="rounded-normal h-auto bg-background p-[6px] lg:static fixed bottom-6 w-[97%] sm:w-[99%]">
      <div
        className={classNames("flex gap-2 items-center", {
          "mb-4": attachments?.length,
        })}
      >
        {attachments?.map((file, idx) => {
          if (file.type.includes("image")) {
            return (
              <ImageBadge
                src={URL.createObjectURL(file)}
                key={file.name + idx}
                onDeleteFile={() => onDeleteAttachment(file.name)}
              />
            );
          }
          return (
            <FileBadge
              fileName={file.name}
              key={file.name + idx}
              onDeleteFile={() => onDeleteAttachment(file.name)}
            />
          );
        })}
      </div>
      <div className="flex items-end gap-[8px] p-2">
        <label className="flex items-center justify-center w-[30px] h-[30px] bg-blue-gray-lighter rounded-[11px] cursor-pointer hover:bg-gray-300 transition">
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList) setAttachments(Array.from(fileList));
            }}
          />
        </label>
        <AutoResizeInput
          className="px-2 max-h-[117px] overflow-y-scroll no-scrollbar"
          placeholder="Введите сообщение"
          onChange={handleInputChange}
          value={inputText}
          disabled={messagesAreLoading || noReqs}
          onKeyDown={onKeyDown}
        />
        <Button
          className="max-w-[30px] rounded-[11px]"
          onClick={onSendMessage}
          disabled={!inputText || messagesAreLoading || noReqs}
        >
          <CornerDownLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});
