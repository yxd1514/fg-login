# fg-login 使用指南

## 版本说明 v1.0.9

**fg-login** 现在提供两种版本：

- **Vue2/CommonJS 版本**: 纯方法函数，不包含 Vue 组件
- **Vue3/ESM 版本**: 完整版本，包含方法和 Vue 组件

## 🔥 Vue2 环境使用 (纯方法版本)

### 安装

```bash
npm install fg-login@1.0.9
```

### 引入方式

```javascript
// CommonJS 引入
const fgLogin = require('fg-login')

// 或者解构引入
const { GoogleNativeLogin, initGoogleNativeLogin } = require('fg-login')
```

### 基本用法

```javascript
// 1. 使用便捷方法
const googleRef = document.getElementById('google-btn')

initGoogleNativeLogin(
  googleRef,
  (credential) => {
    console.log('Google登录成功:', credential)
  },
  {
    client_id: 'your-google-client-id'
  }
).then((result) => {
  if (result.success) {
    console.log('Google登录按钮初始化成功')
  } else {
    console.error('初始化失败:', result.error)
  }
})

// 2. 使用类实例
const googleLogin = new fgLogin.GoogleNativeLogin()
googleLogin.setConfig({
  client_id: 'your-google-client-id'
})

googleLogin.renderButton({
  element: googleRef,
  callback: (credential) => {
    console.log('登录成功:', credential)
  }
})
```

## 🚀 Vue3 环境使用 (完整版本)

### 引入组件

```vue
<template>
  <div>
    <!-- 使用OAuth按钮组件 -->
    <OAuthButton
      type="google"
      @success="handleGoogleLogin"
      @error="handleError"
      :config="{ client_id: 'your-google-client-id' }"
    />

    <!-- 使用邮箱输入组件 -->
    <EmailInput
      v-model="email"
      placeholder="请输入邮箱"
      @validation="handleEmailValidation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EmailInput, OAuthButton } from 'fg-login'

const email = ref('')

const handleGoogleLogin = (credential) => {
  console.log('Google登录成功:', credential)
}

const handleError = (error) => {
  console.error('登录错误:', error)
}

const handleEmailValidation = (isValid) => {
  console.log('邮箱验证:', isValid)
}
</script>
```

## 📦 包导出说明

### Vue2/CommonJS 版本

- GoogleNativeLogin (类)
- initGoogleNativeLogin (便捷方法)
- setGoogleConfig (配置方法)
- getGoogleConfig (获取配置)

### Vue3/ESM 版本

- 上述所有方法
- Vue 组件 (EmailInput, OAuthButton 等)

## 🔧 升级说明

从 v1.0.8 升级到 v1.0.9：

- ✅ 移除了 ES2020 可选链操作符
- ✅ Vue2 环境不再包含 Vue 组件
- ✅ Vue3 环境提供完整功能
- ✅ 向后兼容
