# Nuxt2 & Nuxt3 兼容性指南

## 🎯 完整兼容性解决方案

`fg-login` 现在完全支持 Nuxt2 和 Nuxt3，所有问题已修复！

### ✅ 修复列表

1. **CSS 样式问题** - ✅ 已修复
2. **包导出配置** - ✅ 已修复
3. **Google 原生登录** - ✅ 已修复
4. **组件自动注册** - ✅ 已修复

---

## 🚀 Nuxt3 使用方法

### 1. 安装和配置

```bash
npm install fg-login
```

**nuxt.config.ts:**

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
    google: {
      client_id: 'your-google-client-id.googleusercontent.com'
    }
  }
})
```

### 2. 组件使用

```vue
<!-- pages/login.vue -->
<template>
  <div class="login-page">
    <h1>用户登录</h1>

    <!-- OAuth 登录按钮 -->
    <OAuthButton
      provider="google"
      @success="handleOAuthSuccess"
      @error="handleOAuthError"
    />

    <!-- 完整登录弹窗 -->
    <ThirdPartyLoginModal
      v-if="showModal"
      @close="showModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)

const handleOAuthSuccess = (user) => {
  console.log('OAuth 登录成功:', user)
}

const handleOAuthError = (error) => {
  console.error('OAuth 登录失败:', error)
}

const handleLoginSuccess = (user) => {
  console.log('登录成功:', user)
  showModal.value = false
}
</script>
```

### 3. Google 原生登录

```vue
<!-- components/GoogleLogin.vue -->
<template>
  <div>
    <button @click="handleGoogleLogin">Google 原生登录</button>
  </div>
</template>

<script setup>
import { initGoogleNativeLogin, googleNativeLogin } from 'fg-login'
import { onMounted } from 'vue'

onMounted(async () => {
  // 初始化 Google 原生登录
  await initGoogleNativeLogin({
    client_id: 'your-google-client-id.googleusercontent.com'
  })
})

const handleGoogleLogin = async () => {
  try {
    const user = await googleNativeLogin()
    console.log('Google 原生登录成功:', user)
  } catch (error) {
    console.error('Google 原生登录失败:', error)
  }
}
</script>
```

### 4. Firebase 方法使用

```vue
<script setup>
import {
  signInWithGoogle,
  signInWithFacebook,
  signOut,
  sendPasswordResetEmail
} from 'fg-login'

// Google 登录
const loginWithGoogle = async () => {
  try {
    const user = await signInWithGoogle()
    console.log('登录成功:', user)
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// Facebook 登录
const loginWithFacebook = async () => {
  try {
    const user = await signInWithFacebook()
    console.log('登录成功:', user)
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 退出登录
const logout = async () => {
  try {
    await signOut()
    console.log('退出成功')
  } catch (error) {
    console.error('退出失败:', error)
  }
}

// 发送密码重置邮件
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(email)
    console.log('密码重置邮件已发送')
  } catch (error) {
    console.error('发送失败:', error)
  }
}
</script>
```

---

## 🔧 Nuxt2 使用方法

### 1. 安装和配置

```bash
npm install fg-login
```

**nuxt.config.js:**

```javascript
export default {
  modules: ['fg-login/nuxt2'],

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
    google: {
      client_id: 'your-google-client-id.googleusercontent.com'
    }
  }
}
```

### 2. 组件使用

```vue
<!-- pages/login.vue -->
<template>
  <div class="login-page">
    <h1>用户登录</h1>

    <!-- OAuth 登录按钮 -->
    <OAuthButton
      provider="google"
      @success="handleOAuthSuccess"
      @error="handleOAuthError"
    />

    <!-- 完整登录弹窗 -->
    <ThirdPartyLoginModal
      v-if="showModal"
      @close="showModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false
    }
  },

  methods: {
    handleOAuthSuccess(user) {
      console.log('OAuth 登录成功:', user)
    },

    handleOAuthError(error) {
      console.error('OAuth 登录失败:', error)
    },

    handleLoginSuccess(user) {
      console.log('登录成功:', user)
      this.showModal = false
    }
  }
}
</script>
```

### 3. Google 原生登录

```vue
<!-- components/GoogleLogin.vue -->
<template>
  <div>
    <button @click="handleGoogleLogin">Google 原生登录</button>
  </div>
</template>

<script>
import { initGoogleNativeLogin, googleNativeLogin } from 'fg-login'

export default {
  async mounted() {
    // 初始化 Google 原生登录
    await initGoogleNativeLogin({
      client_id: 'your-google-client-id.googleusercontent.com'
    })
  },

  methods: {
    async handleGoogleLogin() {
      try {
        const user = await googleNativeLogin()
        console.log('Google 原生登录成功:', user)
      } catch (error) {
        console.error('Google 原生登录失败:', error)
      }
    }
  }
}
</script>
```

---

## 📋 可用方法和组件

### 🎨 组件

| 组件名                  | 描述           | Nuxt2 | Nuxt3 |
| ----------------------- | -------------- | ----- | ----- |
| `OAuthButton`           | OAuth 登录按钮 | ✅    | ✅    |
| `ThirdPartyLoginModal`  | 完整登录弹窗   | ✅    | ✅    |
| `EmailInput`            | 邮箱输入框     | ✅    | ✅    |
| `VerificationCodeInput` | 验证码输入框   | ✅    | ✅    |

### 🔥 Firebase 方法

| 方法名                          | 描述             | Nuxt2 | Nuxt3 |
| ------------------------------- | ---------------- | ----- | ----- |
| `signInWithGoogle()`            | Google 登录      | ✅    | ✅    |
| `signInWithFacebook()`          | Facebook 登录    | ✅    | ✅    |
| `signInWithTwitter()`           | Twitter 登录     | ✅    | ✅    |
| `signInWithMicrosoft()`         | Microsoft 登录   | ✅    | ✅    |
| `signInWithApple()`             | Apple 登录       | ✅    | ✅    |
| `signOut()`                     | 退出登录         | ✅    | ✅    |
| `sendPasswordResetEmail(email)` | 发送密码重置邮件 | ✅    | ✅    |
| `sendEmailVerification()`       | 发送邮箱验证     | ✅    | ✅    |
| `verifyEmail(actionCode)`       | 验证邮箱         | ✅    | ✅    |
| `resetPassword(actionCode)`     | 重置密码         | ✅    | ✅    |

### 🌐 Google 原生登录

| 方法名                          | 描述               | Nuxt2 | Nuxt3 |
| ------------------------------- | ------------------ | ----- | ----- |
| `initGoogleNativeLogin(config)` | 初始化 Google 登录 | ✅    | ✅    |
| `googleNativeLogin()`           | 执行 Google 登录   | ✅    | ✅    |
| `setGoogleConfig(config)`       | 设置 Google 配置   | ✅    | ✅    |
| `getGoogleConfig()`             | 获取 Google 配置   | ✅    | ✅    |

### ⚙️ 配置方法

| 方法名                      | 描述               | Nuxt2 | Nuxt3 |
| --------------------------- | ------------------ | ----- | ----- |
| `setFirebaseConfig(config)` | 设置 Firebase 配置 | ✅    | ✅    |
| `getFirebaseConfig()`       | 获取 Firebase 配置 | ✅    | ✅    |

---

## 🎨 样式系统

### 自动样式加载

✅ **已修复** - 样式现在会自动加载，不需要手动引入

```css
/* 自动加载的样式包括： */
.sm-oauth-button {
  /* OAuth 按钮样式 */
}
.sm-email-input {
  /* 邮箱输入框样式 */
}
.fg-login-modal {
  /* 登录弹窗样式 */
}
.sm-verification-code {
  /* 验证码输入框样式 */
}
```

### 样式隔离

- ✅ 只影响 fg-login 组件
- ✅ 不会覆盖您的项目样式
- ✅ 使用 BEM 命名规范，避免冲突

### 自定义样式

```vue
<style scoped>
/* 可以安全地自定义 fg-login 组件样式 */
.sm-oauth-button {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fg-login-modal__content {
  max-width: 500px;
}
</style>
```

---

## 🔧 故障排除

### 常见问题

1. **组件未找到**

   ```
   ✅ 解决方案：确保模块正确配置在 nuxt.config 中
   ```

2. **样式丢失**

   ```
   ✅ 解决方案：已自动修复，无需手动操作
   ```

3. **Google 原生登录失败**

   ```
   ✅ 解决方案：已修复导出配置，现在可正常使用
   ```

4. **Firebase 配置错误**
   ```
   ✅ 解决方案：检查 nuxt.config 中的 smLogin.firebase 配置
   ```

### 验证安装

创建测试页面验证所有功能：

```vue
<!-- pages/test.vue -->
<template>
  <div class="test-page">
    <h1>fg-login 功能测试</h1>

    <div class="test-section">
      <h2>组件测试</h2>
      <OAuthButton provider="google" />
      <EmailInput />
      <VerificationCodeInput />
    </div>

    <div class="test-section">
      <h2>方法测试</h2>
      <button @click="testGoogleLogin">测试 Google 登录</button>
      <button @click="testFirebaseConfig">测试 Firebase 配置</button>
    </div>

    <div class="test-section">
      <h2>样式测试</h2>
      <p>如果看到上面的组件有正确的样式，说明样式加载成功</p>
    </div>
  </div>
</template>

<script setup>
import { signInWithGoogle, getFirebaseConfig } from 'fg-login'

const testGoogleLogin = async () => {
  try {
    console.log('开始测试 Google 登录...')
    // 注意：实际登录需要真实的 Firebase 配置
  } catch (error) {
    console.error('测试失败:', error)
  }
}

const testFirebaseConfig = () => {
  const config = getFirebaseConfig()
  console.log('Firebase 配置:', config)
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

---

## 🎉 总结

现在 `fg-login` 完全兼容 Nuxt2 和 Nuxt3：

✅ **样式自动加载** - 无需手动引入  
✅ **组件自动注册** - 直接使用  
✅ **Google 原生登录** - 正常工作  
✅ **Firebase 集成** - 完整支持  
✅ **零配置使用** - 开箱即用

重新启动您的项目，所有功能都应该正常工作了！🚀
