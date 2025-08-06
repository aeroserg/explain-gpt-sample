"use client";

import React, { useState, useEffect } from 'react';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { FileUpload, FileUploadTrigger } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { X, FileText, Loader2, AlertTriangle, Check } from "lucide-react";
import SvgIcon from '@/components/ui/SvgIcon';
import type { Model as ChatHeaderModel } from '@/modules/NewChat/ChatHeader';
import { cn } from '@/libs/utils/shadcnUtils';

/**
 * @interface ChatInputAreaProps
 * @description Defines props for the `ChatInputArea` component.
 * @property selectedModel The currently selected language model.
 * @property onSendMessage Callback function to send a message. Expects an object with text and attachments (id, name, type).
 * @property onFileUpload Callback function to handle individual file uploads. Should return a promise with attachmentId or an error.
 * @property isSendingMessage Optional flag indicating if a message is currently being sent.
 * @property initialSearchJudicialPractice Optional initial state for the 'Судебная практика' toggle.
 * @property initialSearchInternet Optional initial state for the 'Поиск в интернете' toggle.
 */
interface ChatInputAreaProps {
  selectedModel: ChatHeaderModel;
  onSendMessage?: (message: {
    text: string;
    attachments?: Array<{ id: string; name: string; type: 'image' | 'document' }>;
    model: ChatHeaderModel;
    searchJudicialPractice?: boolean;
    searchInternet?: boolean;
  }) => void;
  onFileUpload?: (file: File) => Promise<{ attachmentId: string } | { error: string }>;
  isSendingMessage?: boolean;
  initialSearchJudicialPractice?: boolean;
  initialSearchInternet?: boolean;
}

/**
 * @interface AttachmentFile
 * @description Represents an attached file in the input area, including its upload status.
 * @property id Unique client-side identifier for the attachment.
 * @property originalFile The original `File` object.
 * @property name The name of the file.
 * @property url A local object URL for previewing the file.
 * @property type The type of the attachment (`'image'` or `'document'`).
 * @property uploadStatus Status of the file upload (`'pending'`, `'uploading'`, `'success'`, `'error'`).
 * @property attachmentId Optional server-assigned ID after successful upload.
 * @property uploadError Optional error message if upload fails.
 */
interface AttachmentFile {
  id: string;
  originalFile: File;
  name: string;
  url: string;
  type: 'image' | 'document';
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  attachmentId?: string;
  uploadError?: string;
}

/**
 * @component ChatInputArea
 * @description Renders a text input area for composing messages, attaching files (with immediate upload and status display), and sending them. Includes options to toggle search functionalities which can be initialized via props.
 */
const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  selectedModel,
  onSendMessage,
  onFileUpload,
  isSendingMessage = false,
  initialSearchJudicialPractice = false,
  initialSearchInternet = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [searchJudicialPractice, setSearchJudicialPractice] = useState(initialSearchJudicialPractice);
  const [searchInternet, setSearchInternet] = useState(initialSearchInternet);

  useEffect(() => {
    setSearchJudicialPractice(initialSearchJudicialPractice);
  }, [initialSearchJudicialPractice]);

  useEffect(() => {
    setSearchInternet(initialSearchInternet);
  }, [initialSearchInternet]);

  /**
   * Handles the addition of new files. It creates a local representation for each file,
   * initiates the upload process, and updates the UI with the upload status.
   * @param newFiles - An array of `File` objects to be uploaded.
   */
  const handleFilesAdded = (newFiles: File[]) => {
    newFiles.forEach(async (file) => {
      const newAttachment: AttachmentFile = {
        id: crypto.randomUUID(),
        originalFile: file,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? 'image' as const : 'document' as const,
        uploadStatus: 'uploading',
      };
      setAttachments((prev) => [...prev, newAttachment]);

      if (onFileUpload) {
        try {
          const result = await onFileUpload(file);
          if ('attachmentId' in result) {
            setAttachments((prev) =>
              prev.map((att) =>
                att.id === newAttachment.id
                  ? { ...att, uploadStatus: 'success', attachmentId: result.attachmentId }
                  : att
              )
            );
          } else {
            setAttachments((prev) =>
              prev.map((att) =>
                att.id === newAttachment.id
                  ? { ...att, uploadStatus: 'error', uploadError: result.error }
                  : att
              )
            );
          }
        } catch (error) {
          setAttachments((prev) =>
            prev.map((att) =>
              att.id === newAttachment.id
                ? { ...att, uploadStatus: 'error', uploadError: String(error) || "Upload failed" }
                : att
            )
          );
        }
      } else {
        setAttachments((prev) =>
          prev.map((att) =>
            att.id === newAttachment.id
              ? { ...att, uploadStatus: 'error', uploadError: "File upload handler not configured." }
              : att
          )
        );
      }
    });
  };

  /**
   * Removes an attachment from the list. It also revokes the object URL to prevent memory leaks.
   * @param idToRemove - The client-side unique identifier of the attachment to remove.
   */
  const removeAttachment = (idToRemove: string) => {
    const fileToRemove = attachments.find(f => f.id === idToRemove);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setAttachments((prev) => prev.filter((file) => file.id !== idToRemove));
  };

  /**
   * Handles the submission of the message. It gathers the input text, successfully uploaded files,
   * and search toggle states, then calls the `onSendMessage` callback. It resets the input field
   * and attachment list upon successful sending.
   */
  const handleSubmit = () => {
    const successfullyUploadedFiles = attachments.filter(att => att.uploadStatus === 'success' && att.attachmentId);
    if ((!inputValue.trim() && successfullyUploadedFiles.length === 0 && !searchJudicialPractice && !searchInternet) || isSendingMessage || attachments.some(att => att.uploadStatus === 'uploading')) return;

    onSendMessage?.({
      text: inputValue,
      attachments: successfullyUploadedFiles.map(f => ({ id: f.attachmentId!, name: f.name, type: f.type })),
      model: selectedModel,
      searchJudicialPractice,
      searchInternet,
    });

    setInputValue("");
    attachments.forEach(att => URL.revokeObjectURL(att.url));
    setAttachments([]);
  };

  const successfullyUploadedFilesCount = attachments.filter(att => att.uploadStatus === 'success').length;
  const isAnyFileUploading = attachments.some(att => att.uploadStatus === 'uploading');

  const submitDisabled =
    (!inputValue.trim() && successfullyUploadedFilesCount === 0 && !searchJudicialPractice && !searchInternet) ||
    isSendingMessage ||
    isAnyFileUploading;

  return (
    <div className="w-full max-w-full md:max-w-[860px] mx-auto pb-[15px] px-[15px] md:px-[35px] pt-2 shrink-0 z-100 bg-[var(--color-background-card)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <PromptInput
          value={inputValue}
          onValueChange={setInputValue}
          onSubmit={handleSubmit}
          className="p-0 rounded-xl border-[var(--color-primary-border)] border-[0.5px] bg-[var(--color-background-card)] dark:bg-[var(--color-background-card)] shadow-none"
        >
          <div className="flex flex-col gap-[1px] p-[15px]">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--color-border-subtle)] dark:border-gray-700">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="relative group bg-[var(--color-muted-bg)] dark:bg-gray-700 rounded-lg p-1">
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-1 h-12 w-auto max-w-[150px]">
                        <FileText className="h-5 w-5 text-[var(--color-muted-text)] dark:text-gray-400 shrink-0" />
                        <span className="text-xs text-[var(--color-muted-text)] dark:text-gray-300 truncate font-inter">{attachment.name}</span>
                      </div>
                    )}
                    {attachment.uploadStatus === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {attachment.uploadStatus === 'error' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-700 bg-opacity-75 rounded-md p-1 text-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                        <span className="text-xs text-white overflow-hidden text-ellipsis" title={attachment.uploadError}>Error</span>
                      </div>
                    )}
                    {attachment.uploadStatus === 'success' && (
                       <div className="absolute top-0 right-0 p-0.5 bg-green-500 rounded-full">
                         <Check className="h-3 w-3 text-white" />
                       </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-destructive-bg)] hover:bg-[var(--color-destructive-bg-hover)]"
                    >
                      <X className="h-3 w-3 text-[var(--color-destructive-text)]" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <PromptInputTextarea
              placeholder="Спросите что-нибудь.."
              className="min-h-[32px] max-h-[120px] resize-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent dark:bg-[var(--color-background-card)] font-inter dark:placeholder:text-gray-500 dark:text-gray-200 sm:text-[16px]!"
              style={{
                letterSpacing: "-0.03em"
              }}
              rows={1}
            />
            <PromptInputActions className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedModel.id === 'ExplainLaw' && (
                  <>
                  <FileUpload onFilesAdded={handleFilesAdded} multiple accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.md, .zip">
                    <PromptInputAction tooltip="Прикрепить файл">
                      <FileUploadTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg bg-[var(--color-neutral-bg)] hover:bg-[var(--color-neutral-bg-hover)] dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                          disabled={isSendingMessage || isAnyFileUploading}
                        >
                          <SvgIcon src="/icons/attach.svg" className="h-4 w-4" />
                        </Button>
                      </FileUploadTrigger>
                    </PromptInputAction>
                  </FileUpload>
                    <Button
                      type="button"
                      onClick={() => setSearchJudicialPractice(!searchJudicialPractice)}
                      className={cn(
                        "h-8 rounded-lg text-[10px] sm:text-sm font-inter flex items-center justify-center p-[5px] sm:w-auto sm:px-3 sm:py-[7px] sm:gap-2 border border-[var(--color-primary-border)]",
                        searchJudicialPractice
                          ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-bg-hover)]'
                          : 'bg-[var(--color-white)] hover:bg-[var(--color-neutral-bg-hover)] text-[var(--color-text-strong)] dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                      )}
                      style={{ letterSpacing: "-0.02em" }}
                      disabled={isSendingMessage || isAnyFileUploading}
                    >
                      Судебная практика
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSearchInternet(!searchInternet)}
                      className={cn(
                        "h-8 rounded-lg text-[10px]  sm:text-sm font-inter flex items-center justify-center p-[5px] sm:w-auto sm:px-3 sm:py-[7px] sm:gap-2  border border-[var(--color-primary-border)]",
                        searchInternet
                          ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-bg-hover)]'
                          : 'bg-[var(--color-white)] hover:bg-[var(--color-neutral-bg-hover)] text-[var(--color-text-strong)] dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                      )}
                      style={{ letterSpacing: "-0.02em" }}
                      disabled={isSendingMessage || isAnyFileUploading}
                    >
                      Поиск в интернете
                    </Button>
                  </>
                )}
              </div>
              <Button
                type="submit"
                disabled={submitDisabled}
                size="icon"
                className={cn(
                  "h-8 w-8 bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-bg-hover)] rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300",
                  submitDisabled && "opacity-50 bg-[var(--color-neutral-bg)] hover:bg-[var(--color-neutral-bg-hover)] text-[var(--color-neutral-text)] cursor-not-allowed"
                )}
              >
                <SvgIcon src="/icons/send-msg.svg" className={cn("h-4 w-4", !submitDisabled && "text-white")} />
              </Button>
            </PromptInputActions>
          </div>
        </PromptInput>
      </form>
    </div>
  );
};

export default ChatInputArea; 