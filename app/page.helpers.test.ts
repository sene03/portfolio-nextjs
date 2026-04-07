import test from "node:test";
import assert from "node:assert/strict";

import {
  appendMessage,
  extractChatAnswer,
  getFallbackAssistantMessage,
  getFriendlyErrorMessage,
  getInitialMessages,
} from "./page.helpers";

test("초기 메시지는 안내용 assistant 메시지 하나를 제공한다", () => {
  const messages = getInitialMessages();

  assert.equal(messages).length, 1;
  assert.deepEqual(messages[0]?.role, "assistant");
  assert.match(messages[0]?.text ?? "", /포트폴리오/);
});

test("appendMessage는 기존 흐름 뒤에 새 메시지를 추가한다", () => {
  const messages = appendMessage(getInitialMessages(), "user", "프로젝트 설명");

  assert.equal(messages.length, 2);
  assert.deepEqual(messages[1], {
    role: "user",
    text: "프로젝트 설명",
  });
});

test("extractChatAnswer는 문자열 data를 그대로 반환한다", () => {
  const answer = extractChatAnswer({
    success: true,
    data: "안녕하세요",
  });

  assert.equal(answer, "안녕하세요");
});

test("extractChatAnswer는 객체 내부의 대표 필드에서 답변을 찾는다", () => {
  const answer = extractChatAnswer({
    success: true,
    data: {
      response: "구조물 점검 자동화 경험이 있습니다.",
    },
  });

  assert.equal(answer, "구조물 점검 자동화 경험이 있습니다.");
});

test("extractChatAnswer는 실패 응답에서 에러를 던진다", () => {
  assert.throws(
    () =>
      extractChatAnswer({
        success: false,
        error: "백엔드 오류",
      }),
    /백엔드 오류/,
  );
});

test("getFriendlyErrorMessage는 Error 메시지를 우선 사용한다", () => {
  assert.equal(
    getFriendlyErrorMessage(new Error("네트워크 연결 실패")),
    "네트워크 연결 실패",
  );
});

test("getFallbackAssistantMessage는 사용자 친화적인 안내 문구를 돌려준다", () => {
  const message = getFallbackAssistantMessage();

  assert.equal(message.role, "assistant");
  assert.match(message.text, /다시 시도해주세요/);
});
