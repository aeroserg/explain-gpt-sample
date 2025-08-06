import { HTMLAttributes } from "react";
import { AssistantType } from "@/api/contracts";
import { AssistantPlate } from "@/layouts/components/AssistantPlate";
import classNames from "classnames";

interface AssistantPlateProps extends HTMLAttributes<HTMLDivElement> {
  assistantType: AssistantType;
  text: string;
}

export const AssistantPick = ({
  assistantType,
  text,
  className,
  ...rest
}: AssistantPlateProps) => {
  return (
    <div
      className={classNames(
        "pt-[24px] px-[24px] pb-[13px] bg-background rounded-small",
        className
      )}
      {...rest}
    >
      <AssistantPlate
        assistantType={assistantType}
        className="mb-[24px] max-w-[50px]"
      />
      <p className="p1 text-blue-gray-dark leading-[14px]">{text}</p>
    </div>
  );
};
