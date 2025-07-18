# Nuxt2 中使用 Firebase API 方法

## 📋 前提条置

确保您的 Nuxt2 项目已正确配置 `fg-login` 模块：

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
    }
  }
}
```

## 🔥 可用的 Firebase 方法

### 1. 第三方登录方法

#### Google 登录

```vue
<template>
  <div>
    <button @click="loginWithGoogle" :disabled="loading">
      {{ loading ? '登录中...' : '使用 Google 登录' }}
    </button>
    <div v-if="user">
      <h3>登录成功！</h3>
      <p>用户邮箱: {{ user.email }}</p>
      <p>用户名: {{ user.displayName }}</p>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { signInWithGoogle } from 'fg-login'

export default {
  data() {
    return {
      user: null,
      error: null,
      loading: false
    }
  },
  methods: {
    async loginWithGoogle() {
      this.loading = true
      this.error = null

      try {
        const result = await signInWithGoogle()
        this.user = result.user
        console.log('Google 登录成功:', result)

        // 登录成功后的处理逻辑
        this.$router.push('/dashboard')
      } catch (error) {
        this.error = error.message
        console.error('Google 登录失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

#### Facebook 登录

```vue
<script>
import { signInWithFacebook } from 'fg-login'

export default {
  methods: {
    async loginWithFacebook() {
      try {
        const result = await signInWithFacebook()
        console.log('Facebook 登录成功:', result.user)
        // 处理登录成功
      } catch (error) {
        console.error('Facebook 登录失败:', error.message)
      }
    }
  }
}
</script>
```

#### Twitter 登录

```vue
<script>
import { signInWithTwitter } from 'fg-login'

export default {
  methods: {
    async loginWithTwitter() {
      try {
        const result = await signInWithTwitter()
        console.log('Twitter 登录成功:', result.user)
      } catch (error) {
        console.error('Twitter 登录失败:', error.message)
      }
    }
  }
}
</script>
```

#### Microsoft 登录

```vue
<script>
import { signInWithMicrosoft } from 'fg-login'

export default {
  methods: {
    async loginWithMicrosoft() {
      try {
        const result = await signInWithMicrosoft()
        console.log('Microsoft 登录成功:', result.user)
      } catch (error) {
        console.error('Microsoft 登录失败:', error.message)
      }
    }
  }
}
</script>
```

#### Apple 登录

```vue
<script>
import { signInWithApple } from 'fg-login'

export default {
  methods: {
    async loginWithApple() {
      try {
        const result = await signInWithApple()
        console.log('Apple 登录成功:', result.user)
      } catch (error) {
        console.error('Apple 登录失败:', error.message)
      }
    }
  }
}
</script>
```

### 2. 用户管理方法

#### 退出登录

```vue
<template>
  <div>
    <button @click="logout" v-if="user">退出登录</button>
  </div>
</template>

<script>
import { signOut } from 'fg-login'

export default {
  data() {
    return {
      user: null
    }
  },
  methods: {
    async logout() {
      try {
        await signOut()
        this.user = null
        console.log('退出登录成功')
        this.$router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error.message)
      }
    }
  }
}
</script>
```

#### 发送密码重置邮件

```vue
<template>
  <div>
    <input v-model="email" type="email" placeholder="请输入邮箱地址" />
    <button @click="resetPassword" :disabled="!email">发送密码重置邮件</button>
    <div v-if="message" class="success">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { sendPasswordResetEmail } from 'fg-login'

export default {
  data() {
    return {
      email: '',
      message: '',
      error: ''
    }
  },
  methods: {
    async resetPassword() {
      this.message = ''
      this.error = ''

      try {
        await sendPasswordResetEmail(this.email)
        this.message = '密码重置邮件已发送，请查收邮箱'
      } catch (error) {
        this.error = error.message
        console.error('发送密码重置邮件失败:', error)
      }
    }
  }
}
</script>
```

#### 发送邮箱验证

```vue
<script>
import { sendEmailVerification } from 'fg-login'

export default {
  methods: {
    async sendVerification() {
      try {
        await sendEmailVerification()
        alert('验证邮件已发送')
      } catch (error) {
        console.error('发送验证邮件失败:', error.message)
      }
    }
  }
}
</script>
```

#### 验证邮箱

```vue
<script>
import { verifyEmail } from 'fg-login'

export default {
  methods: {
    async verifyUserEmail(actionCode) {
      try {
        await verifyEmail(actionCode)
        console.log('邮箱验证成功')
      } catch (error) {
        console.error('邮箱验证失败:', error.message)
      }
    }
  }
}
</script>
```

#### 重置密码

```vue
<script>
import { resetPassword } from 'fg-login'

export default {
  methods: {
    async confirmPasswordReset(actionCode) {
      try {
        await resetPassword(actionCode)
        console.log('密码重置成功')
      } catch (error) {
        console.error('密码重置失败:', error.message)
      }
    }
  }
}
</script>
```

### 3. 配置管理方法

#### 获取 Firebase 配置

```vue
<script>
import { getFirebaseConfig } from 'fg-login'

export default {
  mounted() {
    // 获取当前的 Firebase 配置
    const config = getFirebaseConfig()
    console.log('Firebase 配置:', config)

    // 也可以通过插件获取
    const configFromPlugin = this.$smLogin.getFirebaseConfig()
    console.log('来自插件的配置:', configFromPlugin)
  }
}
</script>
```

#### 设置 Firebase 配置

```vue
<script>
import { setFirebaseConfig } from 'fg-login'

export default {
  mounted() {
    // 动态设置 Firebase 配置（通常不需要，配置应该在 nuxt.config.js 中设置）
    const newConfig = {
      apiKey: 'new-api-key',
      authDomain: 'new-domain.firebaseapp.com'
      // ... 其他配置
    }

    setFirebaseConfig(newConfig)
  }
}
</script>
```

## 🔧 完整的登录页面示例

```vue
<template>
  <div class="login-page">
    <h1>用户登录</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">登录中，请稍候...</div>

    <!-- 登录按钮组 -->
    <div v-else-if="!user" class="login-buttons">
      <button @click="loginWithGoogle" class="btn btn-google">
        使用 Google 登录
      </button>
      <button @click="loginWithFacebook" class="btn btn-facebook">
        使用 Facebook 登录
      </button>
      <button @click="loginWithTwitter" class="btn btn-twitter">
        使用 Twitter 登录
      </button>
      <button @click="loginWithMicrosoft" class="btn btn-microsoft">
        使用 Microsoft 登录
      </button>
      <button @click="loginWithApple" class="btn btn-apple">
        使用 Apple 登录
      </button>
    </div>

    <!-- 用户信息显示 -->
    <div v-else class="user-info">
      <h2>登录成功！</h2>
      <div class="user-details">
        <img
          :src="user.photoURL"
          :alt="user.displayName"
          v-if="user.photoURL"
        />
        <p><strong>姓名:</strong> {{ user.displayName || '未提供' }}</p>
        <p><strong>邮箱:</strong> {{ user.email }}</p>
        <p>
          <strong>邮箱验证状态:</strong>
          {{ user.emailVerified ? '已验证' : '未验证' }}
        </p>
      </div>
      <div class="user-actions">
        <button @click="sendVerification" v-if="!user.emailVerified">
          发送邮箱验证
        </button>
        <button @click="logout" class="btn-logout">退出登录</button>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 成功信息 -->
    <div v-if="message" class="success-message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  signInWithMicrosoft,
  signInWithApple,
  signOut,
  sendEmailVerification
} from 'fg-login'

export default {
  data() {
    return {
      user: null,
      loading: false,
      error: null,
      message: null
    }
  },
  methods: {
    async loginWithProvider(provider, providerName) {
      this.loading = true
      this.error = null
      this.message = null

      try {
        const result = await provider()
        this.user = result.user
        this.message = `${providerName} 登录成功！`

        // 可以在这里进行登录后的处理，比如跳转页面
        // this.$router.push('/dashboard');
      } catch (error) {
        this.error = `${providerName} 登录失败: ${error.message}`
        console.error(`${providerName} 登录失败:`, error)
      } finally {
        this.loading = false
      }
    },

    loginWithGoogle() {
      this.loginWithProvider(signInWithGoogle, 'Google')
    },

    loginWithFacebook() {
      this.loginWithProvider(signInWithFacebook, 'Facebook')
    },

    loginWithTwitter() {
      this.loginWithProvider(signInWithTwitter, 'Twitter')
    },

    loginWithMicrosoft() {
      this.loginWithProvider(signInWithMicrosoft, 'Microsoft')
    },

    loginWithApple() {
      this.loginWithProvider(signInWithApple, 'Apple')
    },

    async logout() {
      try {
        await signOut()
        this.user = null
        this.message = '已成功退出登录'
      } catch (error) {
        this.error = `退出登录失败: ${error.message}`
      }
    },

    async sendVerification() {
      try {
        await sendEmailVerification()
        this.message = '验证邮件已发送，请查收邮箱'
      } catch (error) {
        this.error = `发送验证邮件失败: ${error.message}`
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-google {
  background-color: #4285f4;
  color: white;
}
.btn-facebook {
  background-color: #1877f2;
  color: white;
}
.btn-twitter {
  background-color: #1da1f2;
  color: white;
}
.btn-microsoft {
  background-color: #0078d4;
  color: white;
}
.btn-apple {
  background-color: #000;
  color: white;
}
.btn-logout {
  background-color: #dc3545;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.user-info {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.user-details img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.user-actions {
  margin-top: 15px;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}

.success-message {
  color: #155724;
  background: #d4edda;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}

.loading {
  color: #666;
  font-style: italic;
}
</style>
```

## 📝 注意事项

1. **自动配置**: 如果您在 `nuxt.config.js` 中正确配置了 Firebase，这些方法会自动使用正确的配置。

2. **错误处理**: 所有方法都会返回 Promise，建议使用 try-catch 进行错误处理。

3. **用户状态**: 登录后的用户信息会保存在 Firebase Auth 中，您可以使用 Firebase 的 `onAuthStateChanged` 监听用户状态变化。

4. **安全性**: 确保您的 Firebase 安全规则配置正确，保护用户数据安全。

## 🔍 调试技巧

如果遇到问题，可以在浏览器控制台中查看：

```javascript
// 检查配置是否正确加载
console.log('Firebase 配置:', this.$smLogin.getFirebaseConfig())

// 检查全局配置
console.log('全局 Firebase 配置:', window.__FIREBASE_CONFIG__)
```

这些方法让您可以在 Nuxt2 项目中轻松实现完整的用户认证功能！🎉
