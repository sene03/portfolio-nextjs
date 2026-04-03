/**
 * Backend 서버 연결 테스트 스크립트
 * 
 * 실행 방법:
 * - pnpm node scripts/test-healthcheck.mjs
 * - 또는 Node.js 직접 실행: node ./scripts/test-healthcheck.mjs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

console.log("🔍 Backend Server Health Check Test");
console.log(`📍 Target: ${API_BASE_URL}`);
console.log("─".repeat(50));

/**
 * Healthcheck 테스트
 */
async function testHealthcheck() {
  try {
    console.log("\n📌 Test 1: GET /api/v1/health");
    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const statusText = res.ok ? "✅ OK" : `❌ FAILED (${res.status})`;
    console.log(`   Status: ${res.status} ${statusText}`);

    if (!res.ok) {
      console.log(`   ❌ Health check failed`);
      return false;
    }

    const data = await res.json();
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

/**
 * 연결 성능 테스트 (응답 시간 측정)
 */
async function testResponseTime() {
  try {
    console.log("\n📌 Test 2: Response Time Measurement");
    const start = Date.now();
    
    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: "GET",
    });
    
    const duration = Date.now() - start;
    console.log(`   Response time: ${duration}ms`);
    
    if (duration > 5000) {
      console.log(`   ⚠️  Warning: Response time is high (${duration}ms)`);
    } else {
      console.log(`   ✅ Response time is acceptable`);
    }
    
    return res.ok;
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

/**
 * 연결 재시도 테스트
 */
async function testRetry(maxRetries = 3) {
  try {
    console.log(`\n📌 Test 3: Retry Logic (max ${maxRetries} retries)`);
    
    for (let i = 1; i <= maxRetries; i++) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
          method: "GET",
        });
        
        if (res.ok) {
          console.log(`   ✅ Connected on attempt ${i}`);
          return true;
        } else {
          console.log(`   ⚠️  Attempt ${i}: Status ${res.status}`);
        }
      } catch (err) {
        console.log(`   ❌ Attempt ${i}: Failed - ${err.message}`);
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

/**
 * 모든 테스트 실행
 */
async function runAllTests() {
  const results = [];
  
  results.push(await testHealthcheck());
  results.push(await testResponseTime());
  results.push(await testRetry());
  
  console.log("\n" + "─".repeat(50));
  console.log("📊 Test Summary:");
  console.log(`   Total: ${results.length}`);
  console.log(`   Passed: ${results.filter(r => r).length}`);
  console.log(`   Failed: ${results.filter(r => !r).length}`);
  
  if (results.every(r => r)) {
    console.log("\n✅ All tests passed! Backend is ready.");
    process.exit(0);
  } else {
    console.log("\n❌ Some tests failed. Please check your backend server.");
    process.exit(1);
  }
}

// 실행
runAllTests().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
