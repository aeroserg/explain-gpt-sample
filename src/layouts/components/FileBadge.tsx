import classNames from "classnames";

import { HTMLAttributes } from "react";

import FolderIcon from "@/assets/icons/folder-icon.svg?react";
import CrossIcon from "@/assets/icons/cross-icon.svg?react";

interface FileBadgeProps extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  onDeleteFile?: () => void;
}

export const FileBadge = ({
  fileName,
  className,
  onDeleteFile,
  ...rest
}: FileBadgeProps) => {
  return (
    <div
      className={classNames(
        "w-fit flex items-center space-x-2 p-3 bg-gray-200 rounded-xl relative",
        className
      )}
      {...rest}
    >
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
      <FolderIcon width={12} height={12} />
      <span className="text-[10px] text-blue-gray-dark">{fileName}</span>
    </div>
  );
};
