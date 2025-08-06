import classNames from "classnames";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { HistoryMessageResponse, SenderRole } from "@/api/contracts";

import { useChatStore } from "@/store/chat/chatStore";
import { Button } from "@/libs/ui";
import { AppRoutes } from "@/routes/AppRoutes";

import { Message } from "./Message";

interface MessageListProps {
  messages: HistoryMessageResponse[];
  isLoading?: boolean;
  className?: string;
}

export const MessageList = ({
  messages,
  isLoading,
  className,
}: MessageListProps) => {
  const navigate = useNavigate();

  const { messageError, limits } = useChatStore();

  const lastMessage = messages.at(messages.length - 1);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessage?.text]);

  return (
    <>
      <ul
        className={classNames(
          "pb-4 flex flex-col gap-[10px] overflow-y-auto no-scrollbar max-h-[100%]",
          className
        )}
      >
        {messages.map(({ created_at, text, role, attachments }) => (
          <Message
            key={created_at + text}
            text={text}
            error={role === SenderRole.Assistant ? messageError : ""}
            className={classNames("max-w-[75%]", {
              "self-end w-fit bg-blue-gray-lighter text-black":
                role === SenderRole.User,
              "w-full": role === SenderRole.Assistant,
            })}
            attachments={attachments}
          />
        ))}
        {isLoading && <Message className="w-fit" isLoading />}
        <div ref={endRef} />
      </ul>
      {limits?.available_requests === 0 && (
        <div className="bg-background lg:rounded-normal rounded-small lg:py-[16px] p-2 flex flex-col items-center gap-[20px] my-8">
          <span className="text-[12px]">Ваши запросы закончились</span>
          <Button
            className="bg-gray-darker max-w-[291px] h-[48px]"
            variant="rounded"
            onClick={() => navigate(AppRoutes.Subscription)}
          >
            Пополнить запросы
          </Button>
        </div>
      )}
    </>
  );
};
