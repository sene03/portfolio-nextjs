/**
 * Backend API 연결 및 헬스체크 유틸리티
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

/**
 * Backend 서버 헬스체크
 * @returns {Promise<boolean>} 연결 성공 여부
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Health check failed: ${res.status}`);
      return false;
    }

    const data: HealthCheckResponse = await res.json();
    console.log("✅ Backend server is healthy:", data);
    return true;
  } catch (error) {
    console.error("❌ Health check failed:", error);
    return false;
  }
}

/**
 * Backend 서버 연결 상태 상세 확인
 * @returns {Promise<HealthCheckResponse | null>}
 */
export async function getServerHealthDetails(): Promise<HealthCheckResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get server health details:", error);
    return null;
  }
}
