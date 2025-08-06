import {
  ContentType,
  HistoryMessageResponse,
  SenderRole,
} from "@/api/contracts";

const topicIdSearchTerm = "topic_id: ";
const topicIdRegex = new RegExp(/topic_id:\s[0-9a-fA-F\-]+/g);

export function formatDate(date: string) {
  const now = new Date();
  const inputDate = new Date(date);

  const diffInTime = now.setHours(0, 0, 0, 0) - inputDate.setHours(0, 0, 0, 0);
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return "Сегодня";
  } else if (diffInDays === 1) {
    return "Вчера";
  } else if (diffInDays > 1 && diffInDays < 7) {
    const daysOfWeek = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    return daysOfWeek[inputDate.getDay()];
  } else {
    return inputDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

export async function copyToClipBoard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function tryParseJSONObject(jsonString: string) {
  try {
    const o = JSON.parse(jsonString);

    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {
    return jsonString + "/" + e;
  }
}

export async function processChunk(
  response: Response,
  onTopicIdDetected?: (topicId: string) => void,
  onChunkProcessed?: (chunk: string, detectedTopicIdInChunk?: string) => void,
  onStreamProcessingComplete?: () => void
): Promise<void> {
  const decoder = new TextDecoder("utf-8");
  const reader = response.body?.getReader();

  if (!reader) {
    if (onStreamProcessingComplete) {
      onStreamProcessingComplete();
    }
    return;
  }

  try {
    while (true) {
      const chunkResult = await reader.read();
      const { done, value } = chunkResult;
      if (done) {
        break;
      }

      const messageChunk = decoder.decode(value);
      const topicIdIdx = messageChunk.search(topicIdRegex);
      const detectedTopicId =
        topicIdIdx >= 0
          ? messageChunk
              .slice(topicIdIdx + topicIdSearchTerm.length)
              .split(/\s|\n/)[0]
          : undefined;

      if (detectedTopicId && onTopicIdDetected) {
        onTopicIdDetected(detectedTopicId);
      }

      const textChunkToYield = messageChunk.replace(topicIdRegex, "");

      if (onChunkProcessed) {
        onChunkProcessed(textChunkToYield, detectedTopicId);
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (onStreamProcessingComplete) {
      onStreamProcessingComplete();
    }
    reader.releaseLock();
  }
}

export const createUserMessage = (
  text: string,
  attachments: { name: string; type: "image" | "document" }[] = []
): HistoryMessageResponse => {
  const baseMessage: HistoryMessageResponse = {
    text,
    role: SenderRole.User,
    created_at: new Date().toISOString(),
    attachments: [],
  };

  if (attachments.length > 0) {
    //@ts-expect-error type missmacth
    baseMessage.attachments = attachments.map(({ name, type }) => {
      return {
        filename: name,
        content_type:
          type === "image" ? ContentType.Image : ContentType.Document,
      };
    });
  }

  return baseMessage;
};

export function formatCurrency(
  value: number,
  locale?: string,
  currency?: "RUB" | "USD" | "EUR"
) {
  const formatter = new Intl.NumberFormat(locale || "ru-RU", {
    style: "currency",
    currency: currency || "RUB",
    // @ts-ignore
    trailingZeroDisplay: "stripIfInteger",
    maximumFractionDigits: 2,
  });
  return formatter.format(Number(value));
}
