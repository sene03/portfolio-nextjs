"use client";

import { useEffect, useRef, useState } from "react";
import {
  appendMessage,
  extractChatAnswer,
  getFallbackAssistantMessage,
  getInitialMessages,
  type ChatMessage,
} from "../page.helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function sendChatQuery(query: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`서버 오류 (${res.status})`);
  }

  const payload = await res.json();
  return extractChatAnswer(payload);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => appendMessage(prev, "user", text));
    setInput("");
    setLoading(true);

    try {
      const answer = await sendChatQuery(text);
      setMessages((prev) => appendMessage(prev, "assistant", answer));
    } catch {
      setMessages((prev) => [...prev, getFallbackAssistantMessage()]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="채팅 열기"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_8px_30px_rgba(15,23,42,0.25)] transition hover:bg-zinc-800 active:scale-95"
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.854 4.146a.5.5 0 0 1 0 .708L10.707 10l5.147 5.146a.5.5 0 0 1-.708.708L10 10.707l-5.146 5.147a.5.5 0 0 1-.708-.708L9.293 10 4.146 4.854a.5.5 0 0 1 .708-.708L10 9.293l5.146-5.147a.5.5 0 0 1 .708 0z" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[340px] flex-col rounded-[24px] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
            <div className="h-2 w-2 rounded-full bg-zinc-900" />
            <p className="text-sm font-semibold text-zinc-950">
              포트폴리오 Q&A
            </p>
            <p className="ml-auto text-xs text-zinc-400">AI 답변</p>
          </div>

          {/* Messages */}
          <div className="flex h-72 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-zinc-950 text-white"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <p className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-400">
                  답변 생성 중...
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-100 px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="궁금한 점을 입력하세요..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white transition hover:bg-zinc-700 disabled:opacity-40"
                aria-label="전송"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-300">
              Enter로 전송 · Shift+Enter 줄바꿈
            </p>
          </div>
        </div>
      )}
    </>
  );
}
