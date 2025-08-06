import { AssistantType } from "@/api/contracts";
import classNames from "classnames";
import { HTMLAttributes } from "react";

interface AssistantPlateProps extends HTMLAttributes<HTMLDivElement> {
  assistantType: AssistantType;
}

export const AssistantPlate = ({
  assistantType,
  className,
}: AssistantPlateProps) => {
  let typeText;
  switch (assistantType) {
    case AssistantType.ExplainGpt:
      typeText = "GPT";
      break;
    case AssistantType.ExplainEstate:
      typeText = "Estate";
      break;
    case AssistantType.ExplainLaw:
      typeText = "Law";
      break;
  }

  return (
    <div
      className={classNames(
        "px-[12px] py-[6px] flex items-center justify-center bg-blue-white text-[8px] rounded",
        { "text-blue-lighter": assistantType === AssistantType.ExplainGpt },
        { "text-at-law": assistantType === AssistantType.ExplainLaw },
        { "text-at-estate": assistantType === AssistantType.ExplainEstate },
        className
      )}
    >
      <span className="font-semibold">{typeText}</span>
    </div>
  );
};
