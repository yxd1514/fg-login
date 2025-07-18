<template>
  <div class="google-login-example">
    <h3>Google原生登录示例</h3>

    <!-- Google登录按钮容器 -->
    <div ref="googleButtonRef" class="google-button-container">
      <!-- Google按钮将在这里渲染，如果配置了的话 -->
    </div>

    <div v-if="loginResult" class="login-result">
      <h4>登录结果：</h4>
      <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
    </div>

    <div v-if="initError" class="error-message">
      <p>{{ initError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initGoogleNativeLogin } from 'fg-login'

const googleButtonRef = ref(null)
const loginResult = ref(null)
const initError = ref('')

// Google登录成功回调
const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)

  // 这里你可以解析JWT token获取用户信息
  // 或者直接发送credential到后端进行验证

  loginResult.value = {
    success: true,
    credential: credential,
    timestamp: new Date().toISOString()
  }

  // 发送到后端验证的示例
  // verifyGoogleCredential(credential)
}

// 验证Google凭证的示例函数
const verifyGoogleCredential = async (credential) => {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential })
    })

    const result = await response.json()
    console.log('后端验证结果:', result)
  } catch (error) {
    console.error('验证失败:', error)
  }
}

onMounted(async () => {
  if (googleButtonRef.value) {
    try {
      // 直接初始化，函数内部会处理所有情况并返回详细结果
      const result = await initGoogleNativeLogin(
        googleButtonRef.value,
        handleGoogleLogin
      )

      if (!result.success) {
        initError.value = `⚠️ ${result.error}`
      } else {
        console.log('Google登录按钮初始化成功')
      }
    } catch (error) {
      console.error('Google登录初始化失败:', error)
      initError.value = `❌ Google登录初始化失败: ${error.message}`
      loginResult.value = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
})
</script>

<style scoped>
.google-login-example {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.google-button-container {
  margin: 20px 0;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 15px;
  margin: 20px 0;
  color: #856404;
}

.login-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-align: left;
}

.login-result h4 {
  margin-top: 0;
  color: #495057;
}

.login-result pre {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>
