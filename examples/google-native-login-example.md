# Google 原生登录使用示例

## 配置 Nuxt3 项目

Google 原生登录是 **可选功能**，只有在需要时才配置。

### 完整配置示例（包含可选的 Google 配置）

在你的 `nuxt.config.ts` 中添加以下配置：

```typescript
export default defineNuxtConfig({
  modules: ['fg-login/nuxt'],
  smLogin: {
    firebase: {
      apiKey: 'your-api-key',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project.appspot.com',
      messagingSenderId: '123456789',
      appId: 'your-app-id',
      measurementId: 'G-XXXXXXXXXX'
    },
    // Google 配置是可选的，不需要时可以不配置
    google: {
      client_id: 'your-google-client-id.googleusercontent.com'
    }
  }
})
```

### 最小配置示例（不使用 Google 登录）

如果你不需要 Google 原生登录功能，可以只配置其他部分：

```typescript
export default defineNuxtConfig({
  modules: ['fg-login/nuxt'],
  smLogin: {
    firebase: {
      // 只配置 Firebase，不配置 Google
      apiKey: 'your-api-key',
      authDomain: 'your-domain.firebaseapp.com'
      // ... 其他 Firebase 配置
    }
    // 不配置 google 字段
  }
})
```

## 在组件中使用 Google 原生登录

### 方式一：简单使用（推荐）

```vue
<template>
  <div>
    <!-- Google登录按钮容器 -->
    <div ref="googleButtonRef" class="google-login-container"></div>

    <!-- 显示错误信息（如果有） -->
    <div v-if="initError" class="error-message">
      {{ initError }}
    </div>

    <!-- 显示登录结果 -->
    <div v-if="loginResult">
      <p>登录成功！用户信息已获取</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initGoogleNativeLogin } from 'fg-login'

const googleButtonRef = ref(null)
const loginResult = ref(null)
const initError = ref('')

const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)
  loginResult.value = { credential, timestamp: new Date() }

  // 处理登录逻辑
  // 发送到后端验证等...
}

onMounted(async () => {
  if (googleButtonRef.value) {
    try {
      // 直接初始化，内部会自动处理配置检查并返回详细结果
      const result = await initGoogleNativeLogin(
        googleButtonRef.value,
        handleGoogleLogin
      )

      if (!result.success) {
        initError.value = `⚠️ ${result.error}`
      }
    } catch (error) {
      initError.value = `❌ 初始化失败: ${error.message}`
    }
  }
})
</script>

<style scoped>
.google-login-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.error-message {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 15px;
  border-radius: 4px;
  color: #856404;
  margin: 10px 0;
}
</style>
```

### 方式二：手动传入配置

```vue
<template>
  <div>
    <div ref="googleButtonRef" class="google-login-container"></div>
    <div v-if="initError" class="error-message">{{ initError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initGoogleNativeLogin } from 'fg-login'

const googleButtonRef = ref(null)
const initError = ref('')

const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)
}

onMounted(async () => {
  if (googleButtonRef.value) {
    const googleConfig = {
      client_id: '你的-客户端-ID.apps.googleusercontent.com',
      context: 'signin',
      ux_mode: 'popup',
      cancel_on_tap_outside: false
    }

    try {
      const result = await initGoogleNativeLogin(
        googleButtonRef.value,
        handleGoogleLogin,
        googleConfig
      )

      if (!result.success) {
        initError.value = `❌ ${result.error}`
      }
    } catch (error) {
      initError.value = `❌ 初始化失败: ${error.message}`
    }
  }
})
</script>
```

### 方式三：使用高级 API

```vue
<template>
  <div>
    <div ref="googleButtonRef" class="google-login-container"></div>
    <div v-if="initError" class="error-message">{{ initError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { googleNativeLogin, setGoogleConfig } from 'fg-login'

const googleButtonRef = ref(null)
const initError = ref('')

const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)
}

onMounted(async () => {
  // 手动设置配置
  const configSet = setGoogleConfig({
    client_id: '你的-客户端-ID.apps.googleusercontent.com'
  })

  if (configSet && googleButtonRef.value) {
    try {
      const success = await googleNativeLogin.renderButton({
        element: googleButtonRef.value,
        callback: handleGoogleLogin,
        buttonConfig: {
          theme: 'outline',
          size: 'large',
          width: 300
        }
      })

      if (!success) {
        initError.value = '❌ Google 按钮渲染失败'
      }
    } catch (error) {
      initError.value = `❌ 初始化失败: ${error.message}`
    }
  } else {
    initError.value = '❌ Google配置设置失败'
  }
})
</script>
```

## 在 Nuxt3 中使用插件提供的功能

```vue
<template>
  <div>
    <div ref="googleButtonRef" class="google-login-container"></div>
    <div v-if="initError" class="error-message">{{ initError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const googleButtonRef = ref(null)
const initError = ref('')

const { $smLogin } = useNuxtApp()

const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)
}

onMounted(async () => {
  if (googleButtonRef.value && $smLogin.googleNativeLogin) {
    try {
      const success = await $smLogin.googleNativeLogin.renderButton({
        element: googleButtonRef.value,
        callback: handleGoogleLogin
      })

      if (!success) {
        initError.value = '⚠️ Google登录未配置或初始化失败'
      }
    } catch (error) {
      initError.value = `❌ 初始化失败: ${error.message}`
    }
  } else {
    initError.value = '⚠️ Google登录功能不可用（可能未配置）'
  }
})
</script>
```

## 完整的登录流程示例

```vue
<template>
  <div class="login-page">
    <div v-if="!user">
      <!-- 未登录状态 -->
      <h2>请登录</h2>
      <div ref="googleButtonRef" class="google-button"></div>
      <div v-if="initError" class="error">{{ initError }}</div>
      <div v-if="loading" class="loading">登录中...</div>
    </div>

    <div v-else>
      <!-- 已登录状态 -->
      <h2>欢迎，{{ user.name }}！</h2>
      <img :src="user.picture" :alt="user.name" class="avatar" />
      <p>邮箱：{{ user.email }}</p>
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initGoogleNativeLogin } from 'fg-login'

const googleButtonRef = ref(null)
const loading = ref(false)
const user = ref(null)
const initError = ref('')

const handleGoogleLogin = async (credential) => {
  loading.value = true

  try {
    // 发送到后端验证
    const response = await $fetch('/api/auth/google', {
      method: 'POST',
      body: { credential }
    })

    if (response.success) {
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const logout = () => {
  user.value = null
  localStorage.removeItem('user')
}

onMounted(async () => {
  // 检查是否已登录
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    return // 已登录，不需要初始化Google按钮
  }

  // 初始化Google登录
  if (googleButtonRef.value) {
    try {
      const result = await initGoogleNativeLogin(
        googleButtonRef.value,
        handleGoogleLogin
      )

      if (!result.success) {
        initError.value = `⚠️ ${result.error}`
      }
    } catch (error) {
      initError.value = `❌ Google登录初始化失败: ${error.message}`
    }
  }
})
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

.google-button {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.error {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 10px;
  border-radius: 4px;
  color: #856404;
  margin: 10px 0;
}

.loading {
  color: #007bff;
  margin: 20px 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 10px;
}
</style>
```

## API 参考

### initGoogleNativeLogin(element, callback, config?)

- `element`: HTMLElement - 要渲染按钮的 DOM 元素
- `callback`: Function - 登录成功的回调函数，接收 credential 参数
- `config`: Object (可选) - Google 配置对象
- **返回值**: `Promise<{success: boolean, error?: string}>` - 初始化结果对象
  - `success`: boolean - 是否成功
  - `error`: string (可选) - 失败时的具体错误信息
- **内部处理**: 自动检查配置，返回详细的成功/失败信息

### setGoogleConfig(config)

设置 Google 配置

- `config.client_id`: string - Google 客户端 ID (必需)
- `config.context`: string - 登录上下文，默认'signin'
- `config.ux_mode`: string - UX 模式，默认'popup'
- `config.cancel_on_tap_outside`: boolean - 是否允许点击外部取消，默认 false
- **返回值**: `boolean` - 配置是否成功

### getGoogleConfig()

获取当前 Google 配置

- **返回值**: `Object|null` - 当前配置，未配置时返回 null

### googleNativeLogin.renderButton(options)

高级渲染 API

- `options.element`: HTMLElement - 渲染元素
- `options.callback`: Function - 回调函数
- `options.buttonConfig`: Object - 按钮配置
  - `theme`: 'outline' | 'filled' - 主题
  - `size`: 'large' | 'medium' | 'small' - 大小
  - `width`: number - 宽度
  - `logo_alignment`: 'left' | 'center' - Logo 对齐
- **返回值**: `Promise<boolean>` - 渲染是否成功

## 使用场景

### 场景 1：不需要 Google 登录

如果你的项目不需要 Google 原生登录，完全不用配置 `google` 字段，调用 `initGoogleNativeLogin` 会返回 `false`，你可以据此显示相应的提示信息。

### 场景 2：需要 Google 登录

在 `nuxt.config.ts` 中配置 `smLogin.google.client_id`，调用 `initGoogleNativeLogin` 会返回 `true` 并渲染按钮。

### 场景 3：动态配置

可以通过第三个参数手动传入配置，不依赖全局配置。

## 优势

1. **使用更简单** - 不需要手动检查配置是否可用
2. **详细错误信息** - 返回具体的错误原因，便于调试和用户反馈
3. **自动处理** - 函数内部自动处理所有情况
4. **清晰反馈** - 通过返回对象明确知道成功状态和失败原因
5. **优雅降级** - 未配置时不报错，只是返回详细的错误信息
6. **更好的开发体验** - 开发者可以根据具体错误信息进行相应处理

## 故障排除

### 常见问题

#### 1. "Google 登录未配置"错误

如果你遇到这个错误，可以按以下步骤排查：

1. **检查配置文件** - 确保在 `nuxt.config.ts` 中正确配置了 `smLogin.google.client_id`
2. **使用调试组件** - 导入并使用调试组件来查看详细信息

```vue
<template>
  <div>
    <!-- 正常的Google登录组件 -->
    <GoogleLoginExample />

    <!-- 调试组件，帮助诊断配置问题 -->
    <DebugGoogleConfig />
  </div>
</template>

<script setup>
import GoogleLoginExample from 'fg-login/examples/GoogleLoginExample.vue'
import DebugGoogleConfig from 'fg-login/examples/DebugGoogleConfig.vue'
</script>
```

#### 2. 配置检查清单

- ✅ `nuxt.config.ts` 中有 `smLogin.google.client_id` 配置
- ✅ Google Client ID 格式正确（以 `.apps.googleusercontent.com` 结尾）
- ✅ 模块正确加载：`modules: ['fg-login/nuxt']`
- ✅ 在客户端环境下调用（`onMounted` 中）

#### 3. 手动传入配置

如果自动配置获取失败，可以手动传入配置：

```javascript
const result = await initGoogleNativeLogin(
  googleButtonRef.value,
  handleGoogleLogin,
  {
    client_id: '你的-客户端-ID.apps.googleusercontent.com'
  }
)
```

### 调试日志

当调用 `initGoogleNativeLogin` 时，函数会在控制台输出详细的调试信息：

- 🔍 配置查找过程
- 📍 当前环境信息
- ✅ 成功找到的配置源
- ⚠️ 失败的配置获取尝试
- 🔧 配置设置结果

查看浏览器控制台可以帮助你了解配置获取的具体情况。
