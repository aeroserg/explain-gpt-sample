import { HTMLAttributes } from "react";

import CrossIcon from "@/assets/icons/cross-icon.svg?react";

interface ImageBadgeProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  altText?: string;
  onDeleteFile: () => void;
}

export const ImageBadge: React.FC<ImageBadgeProps> = ({
  src,
  altText = "Пользовательское изображение",
  onDeleteFile,
  ...props
}) => {
  return (
    <div className="relative" {...props}>
      {onDeleteFile && (
        <div className="p-1 flex justify-center items-center bg-gray-200 rounded-full absolute top-[-10px] right-[-10px]">
          <CrossIcon
            role="button"
            width={16}
            height={16}
            onClick={onDeleteFile}
          />
        </div>
      )}
      <div className="flex items-center rounded-2xl overflow-hidden">
        <img
          src={src}
          alt={altText}
          className="w-[110px] rounded-xl object-cover"
        />
      </div>
    </div>
  );
};
