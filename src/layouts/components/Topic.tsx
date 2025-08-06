import { HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import { AssistantType } from "@/api/contracts";
import { AppRoutes } from "@/routes/AppRoutes";
import { AssistantPlate } from "./AssistantPlate";
import { useNavigate, useParams } from "react-router";

interface TopicProps extends HTMLAttributes<HTMLDivElement> {
  assistantType: AssistantType;
  children: ReactNode;
  topicId: number;
}

export const Topic = ({
  assistantType,
  className,
  children,
  topicId,
  onClick,

}: TopicProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    navigate(AppRoutes.ChatWithId.replace(":id", String(topicId)));
    onClick?.(event);
  };

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "cursor-pointer p-4 p1 text-gray-darker flex justify-between items-center gap-[18px] bg-blue-gray-even-lighter rounded-small base-transition hover:bg-blue-gray-lighter",
        { "bg-blue-gray-lighter": String(topicId) === id },
        className
      )}
    >
      <p className="whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_80%,transparent)] w-full">
        {children}
      </p>
      <AssistantPlate assistantType={assistantType} />
    </div>
  );
};
