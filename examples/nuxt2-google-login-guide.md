# Nuxt2 中使用 Google 原生登录

## 📋 前提条件

确保您的 Nuxt2 项目已经配置了 `fg-login` 模块，并且获取到了配置：

```javascript
// nuxt.config.js
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
      context: 'signin',
      ux_mode: 'popup',
      cancel_on_tap_outside: false
    }
  }
};
```

## 🎯 使用方法

### 方法 1：简单使用（推荐）

创建一个页面或组件，例如 `pages/login.vue`：

```vue
<template>
  <div class="login-page">
    <h1>用户登录</h1>

    <!-- Google 登录按钮容器 -->
    <div
      ref="googleButton"
      class="google-login-container"
      style="margin: 20px 0;"
    >
      <!-- Google 按钮将在这里自动渲染 -->
    </div>

    <!-- 显示错误信息 -->
    <div v-if="error" class="error-message" style="color: red; margin: 10px 0;">
      {{ error }}
    </div>

    <!-- 显示登录成功信息 -->
    <div
      v-if="user"
      class="user-info"
      style="margin: 20px 0; padding: 10px; background: #f0f8ff; border-radius: 5px;"
    >
      <h3>登录成功！</h3>
      <p><strong>用户名:</strong> {{ user.name }}</p>
      <p><strong>邮箱:</strong> {{ user.email }}</p>
      <img
        :src="user.picture"
        :alt="user.name"
        style="width: 50px; height: 50px; border-radius: 50%;"
      />
      <br />
      <button @click="logout" style="margin-top: 10px;">退出登录</button>
    </div>

    <!-- 显示登录状态 -->
    <div v-if="loading" style="color: blue;">登录中...</div>
  </div>
</template>

<script>
import { initGoogleNativeLogin } from 'fg-login'

export default {
  name: 'LoginPage',
  data() {
    return {
      user: null,
      error: null,
      loading: false
    }
  },

  async mounted() {
    // 确保 DOM 已渲染
    await this.$nextTick()

    if (this.$refs.googleButton) {
      // 初始化 Google 原生登录
      const result = await initGoogleNativeLogin(
        this.$refs.googleButton,
        this.handleGoogleLogin
      )

      if (!result.success) {
        this.error = result.error
        console.error('Google 登录初始化失败:', result.error)
      }
    }
  },

  methods: {
    async handleGoogleLogin(credential) {
      this.loading = true
      this.error = null

      try {
        console.log('🔑 收到 Google 登录凭据:', credential)

        // 方式1: 直接解析 JWT token（前端解析）
        const userInfo = this.parseJWT(credential)
        console.log('👤 解析到的用户信息:', userInfo)

        // 方式2: 发送到后端验证（推荐）
        // const userInfo = await this.verifyWithBackend(credential)

        this.user = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          id: userInfo.sub
        }

        // 保存登录状态到本地存储（可选）
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('googleCredential', credential)

        console.log('✅ 登录成功')
      } catch (error) {
        this.error = '登录处理失败: ' + error.message
        console.error('❌ 登录处理失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 解析 JWT token（仅用于演示，生产环境建议后端验证）
    parseJWT(token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        return JSON.parse(jsonPayload)
      } catch (error) {
        throw new Error('JWT 解析失败')
      }
    },

    // 发送到后端验证（推荐方式）
    async verifyWithBackend(credential) {
      const response = await this.$axios.post('/api/auth/google', {
        credential: credential
      })

      if (response.data.success) {
        return response.data.user
      } else {
        throw new Error(response.data.error || '后端验证失败')
      }
    },

    // 退出登录
    logout() {
      this.user = null
      this.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('googleCredential')

      // 重新初始化 Google 登录按钮
      this.$nextTick(() => {
        this.mounted()
      })
    }
  },

  // 页面加载时检查是否已登录
  created() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser)
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.google-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
}

.error-message {
  background: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid #ff4444;
}

.user-info {
  text-align: center;
}

button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #c82333;
}
</style>
```

### 方法 2：使用插件提供的服务

```vue
<template>
  <div>
    <div ref="googleButton"></div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null
    }
  },

  async mounted() {
    // 通过插件访问配置
    const googleConfig = this.$smLogin.getGoogleConfig()
    console.log('📋 Google 配置:', googleConfig)

    if (googleConfig && this.$refs.googleButton) {
      const { initGoogleNativeLogin } = await import('fg-login')

      const result = await initGoogleNativeLogin(
        this.$refs.googleButton,
        this.handleLogin,
        googleConfig // 手动传入配置
      )

      if (!result.success) {
        this.error = result.error
      }
    } else {
      this.error = 'Google 登录未配置或 DOM 未准备好'
    }
  },

  methods: {
    handleLogin(credential) {
      console.log('登录成功:', credential)
      // 处理登录逻辑
    }
  }
}
</script>
```

### 方法 3：高级配置

```vue
<template>
  <div>
    <div ref="googleButton" class="custom-google-button"></div>
  </div>
</template>

<script>
import { initGoogleNativeLogin } from 'fg-login'

export default {
  async mounted() {
    const result = await initGoogleNativeLogin(
      this.$refs.googleButton,
      this.handleLogin,
      {
        // 手动配置，覆盖全局配置
        client_id:
          '987926779782-00n3qglod1arcck6mgl3fgo2g2umubi1.apps.googleusercontent.com',
        context: 'signin',
        ux_mode: 'popup',
        cancel_on_tap_outside: false
      }
    )

    if (result.success) {
      console.log('✅ Google 登录按钮已渲染')
    }
  },

  methods: {
    async handleLogin(credential) {
      // 完整的登录处理流程
      try {
        // 1. 显示加载状态
        this.showLoading()

        // 2. 发送到后端验证
        const response = await this.$axios.post('/api/auth/google', {
          credential
        })

        // 3. 处理响应
        if (response.data.success) {
          // 登录成功
          this.$store.commit('auth/setUser', response.data.user)
          this.$router.push('/dashboard')
        } else {
          throw new Error(response.data.error)
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.showError(error.message)
      } finally {
        this.hideLoading()
      }
    },

    showLoading() {
      // 显示加载状态
    },

    hideLoading() {
      // 隐藏加载状态
    },

    showError(message) {
      // 显示错误信息
    }
  }
}
</script>
```

## 🔧 后端验证示例

### Express.js 后端

```javascript
// /api/auth/google 路由
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('你的-Google-客户端-ID')

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body

    // 验证 Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '你的-Google-客户端-ID'
    })

    const payload = ticket.getPayload()

    // 提取用户信息
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified: payload.email_verified
    }

    // 在这里处理用户登录逻辑
    // 例如：创建用户、生成 JWT token、设置 session 等

    res.json({
      success: true,
      user: user
    })
  } catch (error) {
    console.error('Google 登录验证失败:', error)
    res.status(400).json({
      success: false,
      error: '登录验证失败'
    })
  }
})
```

## 💡 注意事项

1. **客户端验证**: 上面的 `parseJWT` 方法仅用于演示，生产环境建议使用后端验证
2. **安全性**: 始终在后端验证 Google 返回的 JWT token
3. **错误处理**: 妥善处理网络错误、配置错误等情况
4. **用户体验**: 显示适当的加载状态和错误信息

## 🐛 故障排除

### 1. 按钮不显示

- 检查 `nuxt.config.js` 中的 `smLogin.google.client_id` 配置
- 确保在 `mounted()` 中调用初始化函数
- 检查浏览器控制台的错误信息

### 2. 配置错误

```javascript
// 在组件中检查配置
mounted() {
  console.log('🔍 smLogin 服务:', this.$smLogin)
  console.log('🔍 Google 配置:', this.$smLogin.getGoogleConfig())
}
```

### 3. 网络问题

- 确保可以访问 `https://accounts.google.com/gsi/client`
- 检查防火墙和网络设置

### 4. 域名配置

- 在 Google Cloud Console 中确保配置了正确的授权 JavaScript 来源
- 本地开发通常使用 `http://localhost:3000`

## 🎉 完整示例

参考 `examples/nuxt2-google-login-complete.vue` 获取完整的工作示例。
