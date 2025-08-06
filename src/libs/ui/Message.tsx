import classNames from "classnames";

import { AttachmentResponse } from "@/api/contracts";
import { FileBadge } from "@/layouts/components/FileBadge";

import { MarkDownRenderer } from "./MarkDownRenderer";
import { Loader } from "./Loader";

interface MessageProps {
  text?: string;
  className?: string;
  isLoading?: boolean;
  attachments?: AttachmentResponse[];
  error?: string;
}

export const Message = ({
  className,
  text,
  isLoading,
  attachments,
  error,
}: MessageProps) => {
  const showMessage = !isLoading && !error;
  const showError = !isLoading && error;

  return (
    <li
      className={classNames("lg:p-6 sm:p-2 p-1.5 lg:rounded-normal rounded-small bg-background p1", className)}
    >
      {isLoading && <Loader />}
      {showMessage && <MarkDownRenderer content={String(text)} />}
      {showError && <p>{error}</p>}
      {attachments && attachments?.length > 0 && (
        <div className="mt-[8px] flex gap-2">
          {attachments.map((file, idx) => (
            <FileBadge fileName={file.filename} key={file.filename + idx} />
          ))}
        </div>
      )}
    </li>
  );
};
