"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageContent, MessageActions, MessageAction } from '@/components/ui/message';
import { Button } from "@/components/ui/button";
import { Copy, FileText, Download } from 'lucide-react';
import { cn } from '@/libs/utils/shadcnUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from '@/components/ui/loader';
import { useUIStore } from '@/store/ui/uiStore';

import { motion, AnimatePresence } from 'framer-motion';
import { AssistantType } from '@/api/contracts/contract';

/**
 * @interface UserProfile
 * @description Defines the structure for a user's profile information.
 * @property name The name of the user.
 * @property avatarUrl Optional URL for the user's avatar image.
 * @property avatarFallback Fallback text or initials for the avatar if the image is not available.
 */
export interface UserProfile {
  name: string;
  avatarUrl?: string;
  avatarFallback: string;
}

/**
 * @interface ChatMessage
 * @description Represents a single message within the chat display area.
 * @property id Unique identifier for the message.
 * @property role The role of the message sender (`'user'` or `'assistant'`).
 * @property content The textual content of the message or an `AsyncIterable<string>` for streaming assistant responses.
 * @property type Optional type of the message.
 * @property user Optional `UserProfile` information, present if the role is `'user'`.
 * @property modelName Optional name of the AI model, present if the role is `'assistant'`.
 * @property timestamp Optional timestamp for when the message was created or received.
 * @property isStreaming Optional flag indicating if the assistant's message is currently streaming.
 * @property attachments Optional array of attachments associated with the message.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'limit_exceeded';
  user?: UserProfile;
  modelName?: string;
  timestamp?: string;
  isStreaming?: boolean;
  attachments?: { id: string; name: string; type: 'image' | 'document'; url?: string }[];
}

/**
 * @interface ChatMessageAreaProps
 * @description Defines props for the `ChatMessageArea` component.
 * @property messages An array of `ChatMessage` objects to display.
 * @property isLoading Flag indicating if messages are currently being loaded or processed.
 */
interface ChatMessageAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  assistantType?: AssistantType;
}

const phrases = [
  "Обрабатываю ваш запрос...",
  "Удаляю персональные данные…",
  "Анализирую предоставленные данные...",
  "Оптимизирую запрос для поиска наиболее точного юридического ответа…",
  "Ищу информацию в базе знаний...",
  "Анализирую материалы из базы Гаранта — это займет несколько секунд…",
  "Производится юридический анализ запроса — немного терпения…",
  "Поиск информации... Пожалуйста, подождите...",
  "Подготавливаю подробный ответ на ваш вопрос...",
  "Обрабатываю запрос, это может занять несколько секунд...",
  "Формирую логическую структуру ответа с учетом юридических стандартов…",
  "Проверяю, какие юридические нюансы важны в этом случае…",
  "Обрабатываю юридический контекст запроса — это важно для точности.",
  "Сопоставляю факты с нормами права — скоро всё будет готово.",
  "Формирую обоснованный вывод на основе законодательства и практики…",
  "Ответ почти готов — финальные штрихи...",
];

const LegalAssistantLoader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= phrases.length) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 7000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (currentIndex >= phrases.length) {
    return <Loader variant="dots" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="font-medium text-gray-500 dark:text-gray-400"
      >
        {phrases[currentIndex]}
      </motion.p>
    </AnimatePresence>
  );
};

/**
 * @component ChatMessageArea
 * @description Renders the area where chat messages are displayed. It handles scrolling to keep the latest user message visible with an offset, message formatting (including Markdown for assistant messages), attachments (with image preview and download functionality), and streaming responses from the assistant.
 */
const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({ messages, isLoading, assistantType }) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef(new Map<string, HTMLDivElement | null>());
  const lastScrolledUserMessageIdRef = useRef<string | null>(null);
  const { openSettingsModal } = useUIStore();

  const streamingMessage = messages.find(msg => msg.isStreaming);
  const isWaitingForFirstChunk = isLoading && (!streamingMessage || streamingMessage.content.length === 0);

  useEffect(() => {
    if (messages.length > 0) {
      const latestUserMessage = [...messages].reverse().find(m => m.role === 'user');

      if (latestUserMessage && latestUserMessage.id !== lastScrolledUserMessageIdRef.current) {
        const messageElement = messageRefs.current.get(latestUserMessage.id);
        const currentSpacerElement = spacerRef.current;

        if (messageElement && currentSpacerElement) {
          const viewportElement = messageElement.closest<HTMLDivElement>('[data-radix-scroll-area-viewport]');

          if (viewportElement) {
            const messageHeight = messageElement.offsetHeight;
            const viewportHeight = viewportElement.clientHeight;
            const requiredSpacerHeight = Math.max(0, viewportHeight - messageHeight - 40);
            currentSpacerElement.style.height = `${requiredSpacerHeight}px`;

            requestAnimationFrame(() => {
              const targetScrollTop = Math.max(0, messageElement.offsetTop - 40);
              viewportElement.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
              lastScrolledUserMessageIdRef.current = latestUserMessage.id;
            });
          } else {
            console.warn("ChatMessageArea: Scroll viewport ([data-radix-scroll-area-viewport]) not found. Scrolling may be imprecise and without offset.");
            currentSpacerElement.style.height = '0px';
            requestAnimationFrame(() => {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                lastScrolledUserMessageIdRef.current = latestUserMessage.id;
            });
          }
        }
      }
    } else {
      lastScrolledUserMessageIdRef.current = null;
      if (spacerRef.current) {
        spacerRef.current.style.height = '0px';
      }
    }
  }, [messages]);

  /**
   * Copies the provided text to the user's clipboard.
   * Logs an error to the console if the copy operation fails.
   * @param text The string to be copied.
   */
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase();
  };

  return (
    <ScrollArea className="flex-1 min-h-0 relative">
      <div className="max-w-[90vw] md:max-w-[860px] mx-auto space-y-6 px-4 pb-6 pt-[60px] md:px-[35px] md:pb-6">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader variant="dots" />
          </div>
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) messageRefs.current.set(msg.id, el);
                else messageRefs.current.delete(msg.id);
              }}
              className={cn(
                "flex",
                msg.role === 'user' ? 'justify-end' : 'justify-start',
                "gap-2 md:gap-3"
              )}
            >
              {msg.type === 'limit_exceeded' ? (
                <div className="flex flex-col items-start gap-4">
                  <div className="font-inter text-base text-[#404040] dark:text-gray-300">
                    <p>Пакет запросов исчерпан.</p>
                    <p>Через 24 часа будет начислено</p>
                    <p>3 бесплатных запроса.</p>
                    <p>Также вы можете купить подписку</p>
                  </div>
                  <Button
                    onClick={() => openSettingsModal('subscription', 'available')}
                    className="bg-[#3D7EFF] hover:bg-[#3D7EFF]/90 text-white rounded-lg px-4 py-2"
                  >
                    Пополнить
                  </Button>
                </div>
              ) : (
                <div className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                  {msg.isStreaming && msg.role === 'assistant' && (
                    <Loader variant="dots" />
                  )}
                  {(msg.content || (msg.isStreaming && msg.role === 'assistant')) && <MessageContent
                    markdown={msg.role === 'assistant'}
                    className={cn(
                      "prose dark:prose-invert",
                      "max-w-[80vw]",
                      "font-inter text-[16px] leading-[19px]",
                      msg.role === 'user'
                        ? 'sm:max-w-[600px] bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)] rounded-xl p-[15px] dark:bg-gray-700 dark:text-gray-200 whitespace-pre-wrap'
                        : 'sm:max-w-[790px] bg-transparent text-[var(--color-text-default)] dark:text-gray-100 p-0'
                    )}
                    style={{ letterSpacing: msg.role === 'user' ? '-0.02em' : 'normal' }}
                  >
                    {msg.content}
                  </MessageContent>}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((attachment) => {
                        const isImage = attachment.type === 'image' && attachment.url;
                        const isPdf = attachment.url && getFileExtension(attachment.name) === 'pdf';
                        const isDocument = attachment.type === 'document' && attachment.url;

                        return (
                          <div key={attachment.id} className="max-w-[300px]">
                            {isImage ? (
                              <div className="flex flex-col gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <button className="w-40 h-40 rounded-lg overflow-hidden cursor-pointer border border-[var(--color-border-default)] hover:opacity-80 transition-opacity">
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl max-h-[80vh]">
                                    <DialogHeader>
                                      <DialogTitle>{attachment.name}</DialogTitle>
                                      <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer" className="absolute right-16 top-4">
                                        <Button variant="ghost" size="icon">
                                          <Download className="h-5 w-5" />
                                        </Button>
                                      </a>
                                    </DialogHeader>
                                    <div className="overflow-auto flex justify-center items-center p-4">
                                      <img src={attachment.url} alt={attachment.name} className="max-w-full max-h-[70vh] object-contain rounded" />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <a
                                  href={attachment.url}
                                  download={attachment.name}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 p-1 rounded-md text-xs text-[var(--color-muted-text)] hover:bg-[var(--color-muted-bg)]/80 dark:hover:bg-muted/50"
                                >
                                  <FileText className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{attachment.name}</span>
                                </a>
                              </div>
                            ) : isDocument ? (
                              isPdf ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="h-auto p-2 flex items-center gap-2 hover:bg-[var(--color-muted-bg)] dark:hover:bg-muted/50 border-[var(--color-border-default)] text-[var(--color-muted-text)]">
                                      <FileText className="h-4 w-4 text-[var(--color-muted-text)]" />
                                      <span className="text-xs truncate text-[var(--color-muted-text)]">{attachment.name}</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl h-[90vh]">
                                    <DialogHeader>
                                      <DialogTitle>{attachment.name}</DialogTitle>
                                      <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer" className="absolute right-16 top-4">
                                        <Button variant="ghost" size="icon">
                                          <Download className="h-5 w-5" />
                                        </Button>
                                      </a>
                                    </DialogHeader>
                                    <div className="h-full w-full pt-4">
                                      <iframe src={attachment.url} className="w-full h-full" title={attachment.name} />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={attachment.name}
                                  className="inline-flex items-center gap-2 p-2 rounded-md border-[var(--color-border-default)] bg-[var(--color-muted-bg)] hover:bg-[var(--color-muted-bg)]/80 dark:hover:bg-muted/50 text-xs text-[var(--color-muted-text)]"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="truncate">{attachment.name}</span>
                                  <Download className="h-3 w-3 ml-auto shrink-0" />
                                </a>
                              )
                            ) : (
                              <div className="flex items-center gap-2 p-2 rounded-md border-[var(--color-border-default)] bg-[var(--color-muted-bg)] text-xs text-[var(--color-muted-text)]">
                                <FileText className="h-4 w-4" />
                                <span className="truncate">{attachment.name}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {msg.role === 'assistant' && !msg.isStreaming && (
                    <MessageActions className="mt-1">
                      <MessageAction tooltip="Копировать">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[var(--color-text-subtle)] hover:text-[var(--color-muted-text-hover)] dark:text-gray-400 dark:hover:text-gray-200"
                          onClick={() => typeof msg.content === 'string' && handleCopyToClipboard(msg.content)}
                          disabled={typeof msg.content !== 'string'}
                        >
                          <Copy size={14} />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  )}
                </div>
              )}
            </Message>
          ))
        )}
        <div ref={spacerRef} />
      </div>

      {isWaitingForFirstChunk && assistantType === AssistantType.ExplainLaw && (
        <div className="flex items-center justify-center p-4 text-center min-h-[24px]">
          <LegalAssistantLoader />
        </div>
      )}

      <div ref={spacerRef} />
    </ScrollArea>
  );
};

export default ChatMessageArea; 