export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

type ChatPayload = {
  success?: boolean;
  data?: unknown;
  error?: string;
};

const FALLBACK_ERROR_MESSAGE =
  "죄송합니다. 대화 처리 중 오류가 발생했습니다. 다시 시도해주세요.";

export function getInitialMessages(): ChatMessage[] {
  return [
    {
      role: "assistant",
      text: "포트폴리오에 대해 궁금한 점을 남겨주세요. 프로젝트 경험과 기술 선택 이유를 바탕으로 답변드릴게요.",
    },
  ];
}

export function appendMessage(
  messages: ChatMessage[],
  role: ChatRole,
  text: string,
): ChatMessage[] {
  return [...messages, { role, text }];
}

export function extractChatAnswer(payload: ChatPayload): string {
  if (!payload.success) {
    throw new Error(payload.error || "채팅 응답 생성에 실패했습니다.");
  }

  const data = payload.data;
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const candidates = [
      "answer",
      "response",
      "message",
      "content",
    ] as const;

    for (const key of candidates) {
      const value = (data as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }

  throw new Error("응답 본문을 해석할 수 없습니다.");
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return FALLBACK_ERROR_MESSAGE;
}

export function getFallbackAssistantMessage(): ChatMessage {
  return {
    role: "assistant",
    text: FALLBACK_ERROR_MESSAGE,
  };
}
