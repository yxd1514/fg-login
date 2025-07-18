# Nuxt3 项目中使用 fg-login 配置指南

## 🚨 解决 "Could not load fg-login/nuxt" 错误

如果您遇到 `Could not load fg-login/nuxt` 错误，请按照以下步骤操作：

### 1. 🔧 正确的模块引用

在您的 Nuxt3 项目的 `nuxt.config.ts` 中，使用以下配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ✅ 正确的模块路径（两种方式都可以）
  modules: [
    'fg-login/nuxt' // 推荐使用这个路径
    // 或者 'fg-login/nuxt3'  // 也可以使用这个路径
  ],

  // ⭐ 重要：配置 fg-login 参数
  fgLogin: {
    firebase: {
      apiKey: 'your-api-key',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project.appspot.com',
      messagingSenderId: '123456789',
      appId: 'your-app-id',
      measurementId: 'G-XXXXXXXXXX'
    },
    google: {
      client_id: 'your-google-client-id.googleusercontent.com',
      context: 'signin',
      ux_mode: 'popup',
      cancel_on_tap_outside: false
    }
  }
})
```

### 2. 📦 确保包已正确安装

```bash
# 检查包是否已安装
npm list fg-login

# 如果没有安装，请安装
npm install fg-login

# 或者重新安装
npm uninstall fg-login
npm install fg-login
```

### 3. 🔍 验证配置

创建一个测试页面来验证配置是否正确：

```vue
<!-- pages/login-test.vue -->
<template>
  <div class="login-test-page">
    <h1>fg-login 配置测试</h1>

    <!-- 配置信息显示 -->
    <div class="config-info">
      <h2>配置信息</h2>
      <div v-if="configStatus.firebase.loaded" class="success">
        ✅ Firebase 配置已加载
      </div>
      <div v-else class="error">❌ Firebase 配置未找到</div>

      <div v-if="configStatus.google.loaded" class="success">
        ✅ Google 配置已加载
      </div>
      <div v-else class="warning">⚠️ Google 配置未找到（可选功能）</div>
    </div>

    <!-- 组件测试 -->
    <div class="component-test">
      <h2>组件测试</h2>

      <!-- 这些组件应该自动可用，无需导入 -->
      <div v-if="componentsAvailable.oauthButton" class="success">
        ✅ OAuthButton 组件可用
        <OAuthButton
          provider="google"
          @login-success="handleLoginSuccess"
          @login-error="handleLoginError"
        />
      </div>

      <div v-if="componentsAvailable.thirdPartyModal" class="success">
        ✅ ThirdPartyLoginModal 组件可用
      </div>
    </div>

    <!-- 功能测试 -->
    <div class="function-test">
      <h2>功能测试</h2>
      <button @click="testFirebaseFunctions" class="test-btn">
        测试 Firebase 功能
      </button>

      <div v-if="testResults.length" class="test-results">
        <h3>测试结果：</h3>
        <div
          v-for="result in testResults"
          :key="result.name"
          :class="['test-result', result.success ? 'success' : 'error']"
        >
          <strong>{{ result.name }}:</strong> {{ result.message }}
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-section">
      <h3>错误信息：</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 导入 Firebase 功能
const { $fgLogin } = useNuxtApp()

const configStatus = ref({
  firebase: { loaded: false },
  google: { loaded: false }
})

const componentsAvailable = ref({
  oauthButton: false,
  thirdPartyModal: false
})

const testResults = ref([])
const error = ref(null)

// 检查配置状态
const checkConfiguration = () => {
  try {
    const runtimeConfig = useRuntimeConfig()

    // 检查 Firebase 配置
    if (runtimeConfig.public.fgLogin?.firebase?.apiKey) {
      configStatus.value.firebase.loaded = true
    }

    // 检查 Google 配置
    if (runtimeConfig.public.fgLogin?.google?.client_id) {
      configStatus.value.google.loaded = true
    }

    console.log('✅ 配置检查完成:', {
      firebase: configStatus.value.firebase.loaded,
      google: configStatus.value.google.loaded
    })
  } catch (err) {
    error.value = `配置检查失败: ${err.message}`
  }
}

// 检查组件可用性
const checkComponents = () => {
  try {
    // 这里我们简单地假设如果模块加载成功，组件就可用
    // 实际的组件检查可能需要更复杂的逻辑
    componentsAvailable.value.oauthButton = true
    componentsAvailable.value.thirdPartyModal = true
  } catch (err) {
    console.error('组件检查失败:', err)
  }
}

// 测试 Firebase 功能
const testFirebaseFunctions = async () => {
  testResults.value = []

  try {
    // 动态导入 Firebase 功能
    const { getFirebaseConfig, signInWithGoogle } = await import('fg-login')

    // 测试配置获取
    try {
      const config = getFirebaseConfig()
      if (config && config.apiKey) {
        testResults.value.push({
          name: 'Firebase 配置获取',
          success: true,
          message: '配置获取成功'
        })
      } else {
        testResults.value.push({
          name: 'Firebase 配置获取',
          success: false,
          message: '配置为空或无效'
        })
      }
    } catch (err) {
      testResults.value.push({
        name: 'Firebase 配置获取',
        success: false,
        message: `获取失败: ${err.message}`
      })
    }

    // 可以添加更多测试...
  } catch (err) {
    testResults.value.push({
      name: '模块导入',
      success: false,
      message: `导入失败: ${err.message}`
    })
  }
}

// 处理登录事件
const handleLoginSuccess = (result) => {
  console.log('登录成功:', result)
}

const handleLoginError = (error) => {
  console.error('登录错误:', error)
}

onMounted(() => {
  checkConfiguration()
  checkComponents()
})
</script>

<style scoped>
.login-test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.config-info,
.component-test,
.function-test {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.success {
  color: #28a745;
  margin: 5px 0;
  padding: 5px;
  background: #d4edda;
  border-radius: 4px;
}

.error {
  color: #dc3545;
  margin: 5px 0;
  padding: 5px;
  background: #f8d7da;
  border-radius: 4px;
}

.warning {
  color: #856404;
  margin: 5px 0;
  padding: 5px;
  background: #fff3cd;
  border-radius: 4px;
}

.test-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.test-btn:hover {
  background: #0056b3;
}

.test-results {
  margin-top: 15px;
}

.test-result {
  margin: 5px 0;
  padding: 8px;
  border-radius: 4px;
}

.error-section {
  margin: 20px 0;
  padding: 15px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
```

### 4. 🎯 快速解决方案

如果您仍然遇到问题，请尝试以下步骤：

#### 步骤 1：清理并重新安装

```bash
# 删除 node_modules 和锁定文件
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

#### 步骤 2：检查 Nuxt 版本兼容性

```bash
# 检查 Nuxt 版本
npm list nuxt

# 确保使用 Nuxt 3.x
npm install nuxt@latest
```

#### 步骤 3：使用最新版本的 fg-login

```bash
npm install fg-login@latest
```

#### 步骤 4：验证配置文件

确保您的 `nuxt.config.ts` 文件语法正确：

```typescript
export default defineNuxtConfig({
  modules: ['fg-login/nuxt'],
  fgLogin: {
    // 您的配置...
  }
})
```

### 5. 📋 故障排除清单

- ✅ 使用正确的模块路径：`'fg-login/nuxt'` 或 `'fg-login/nuxt3'`
- ✅ 确保 `fg-login` 包已正确安装
- ✅ Nuxt 版本为 3.x
- ✅ `nuxt.config.ts` 语法正确
- ✅ 配置对象结构正确
- ✅ Firebase 配置包含必要的字段（apiKey, authDomain, projectId）

### 6. 🔍 调试信息

启动 Nuxt 开发服务器时，您应该看到类似以下的日志：

```
✅ fg-login Nuxt3 模块已加载
✅ Firebase 配置已设置
✅ Google原生登录已配置 (如果配置了Google)
```

如果您没有看到这些日志，说明模块可能没有正确加载。

### 7. 📞 获取帮助

如果问题仍然存在，请提供以下信息：

- Nuxt 版本：`npm list nuxt`
- fg-login 版本：`npm list fg-login`
- 完整的错误信息
- 您的 `nuxt.config.ts` 配置

这将帮助我们更好地诊断问题！🔧
