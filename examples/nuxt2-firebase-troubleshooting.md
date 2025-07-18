# Firebase 网络错误故障排除指南

## 🚨 `auth/network-request-failed` 错误解决方案

当您遇到 Firebase 网络请求失败错误时，这通常与以下几个方面有关：

### 1. 🌐 Firebase 域名验证问题

Firebase Auth 需要验证您的域名是否在授权域名列表中。

#### 解决步骤：

1. **检查 Firebase 控制台设置**：

   - 登录 [Firebase 控制台](https://console.firebase.google.com/)
   - 选择您的项目
   - 进入 `Authentication` > `Settings` > `Authorized domains`

2. **添加您的域名**：

   ```
   localhost            # 开发环境
   192.168.1.211        # 您的本地IP
   your-domain.com      # 生产域名
   ```

3. **对于本地开发**，确保添加了：
   ```
   localhost
   127.0.0.1
   192.168.1.211 (您当前的IP)
   ```

### 2. 🔧 网络配置检查

#### 检查 Firebase 配置是否正确：

```vue
<template>
  <div>
    <button @click="checkConfig">检查 Firebase 配置</button>
    <button @click="testGoogleLogin">测试 Google 登录</button>
    <div v-if="configInfo">
      <h3>配置信息：</h3>
      <pre>{{ configInfo }}</pre>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { getFirebaseConfig, signInWithGoogle } from 'fg-login'

export default {
  data() {
    return {
      configInfo: null,
      error: null
    }
  },
  methods: {
    checkConfig() {
      try {
        const config = getFirebaseConfig()
        this.configInfo = JSON.stringify(config, null, 2)

        // 验证必要字段
        if (!config) {
          throw new Error('Firebase 配置未找到')
        }
        if (!config.apiKey) {
          throw new Error('Firebase apiKey 缺失')
        }
        if (!config.authDomain) {
          throw new Error('Firebase authDomain 缺失')
        }
        if (!config.projectId) {
          throw new Error('Firebase projectId 缺失')
        }

        console.log('✅ Firebase 配置验证通过')
      } catch (error) {
        this.error = error.message
        console.error('❌ Firebase 配置验证失败:', error)
      }
    },

    async testGoogleLogin() {
      this.error = null

      try {
        // 添加详细的错误信息
        console.log('🔄 开始 Google 登录...')
        console.log('🌐 当前域名:', window.location.hostname)
        console.log('🌐 当前端口:', window.location.port)
        console.log('🌐 当前协议:', window.location.protocol)

        const result = await signInWithGoogle()
        console.log('✅ Google 登录成功:', result)
      } catch (error) {
        this.error = `登录失败: ${error.message}`

        // 详细错误信息
        console.error('❌ Google 登录失败:', {
          code: error.code,
          message: error.message,
          originalError: error.originalError,
          domain: error.domain || window.location.hostname
        })

        // 提供解决建议
        this.provideSolution(error.code)
      }
    },

    provideSolution(errorCode) {
      const solutions = {
        'auth/network-request-failed': `
          🔧 解决建议：
          1. 检查 Firebase 控制台的授权域名列表
          2. 确保添加了当前域名: ${window.location.hostname}
          3. 检查网络连接和防火墙设置
          4. 尝试清除浏览器缓存
        `,
        'auth/unauthorized-domain': `
          🔧 解决建议：
          1. 在 Firebase 控制台添加当前域名: ${window.location.hostname}
          2. 等待几分钟让配置生效
        `,
        'auth/invalid-api-key': `
          🔧 解决建议：
          1. 检查 Firebase 配置中的 apiKey 是否正确
          2. 确保项目配置与 Firebase 控制台一致
        `
      }

      if (solutions[errorCode]) {
        console.warn(solutions[errorCode])
      }
    }
  },

  mounted() {
    // 自动检查配置
    this.checkConfig()
  }
}
</script>

<style scoped>
.error {
  color: red;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  white-space: pre-line;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
```

### 3. 🛠️ 高级故障排除

#### 方法 1：使用 HTTPS（推荐）

Firebase Auth 在某些情况下要求使用 HTTPS。如果您在本地开发：

```bash
# 使用 HTTPS 启动 Nuxt2 开发服务器
npm run dev -- --https

# 或者在 nuxt.config.js 中配置
export default {
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    }
  }
}
```

#### 方法 2：配置代理（如果有网络限制）

```javascript
// nuxt.config.js
export default {
  proxy: {
    '/firebase-api/': {
      target: 'https://identitytoolkit.googleapis.com',
      pathRewrite: { '^/firebase-api/': '' },
      changeOrigin: true
    }
  }
}
```

#### 方法 3：检查防火墙和代理

```javascript
// 添加到您的登录方法中
async testNetworkConnectivity() {
  try {
    // 测试基本网络连接
    const response = await fetch('https://www.google.com', {
      mode: 'no-cors',
      method: 'HEAD'
    });
    console.log('✅ 基础网络连接正常');

    // 测试 Firebase 端点
    const firebaseTest = await fetch('https://identitytoolkit.googleapis.com', {
      mode: 'no-cors',
      method: 'HEAD'
    });
    console.log('✅ Firebase 端点可访问');

  } catch (error) {
    console.error('❌ 网络连接测试失败:', error);
  }
}
```

### 4. 🔧 替代解决方案

如果网络问题持续存在，可以尝试以下替代方案：

#### 方案 1：使用重定向而不是弹窗

```vue
<script>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import { getFirebaseConfig } from 'fg-login'

export default {
  methods: {
    async loginWithGoogleRedirect() {
      try {
        const config = getFirebaseConfig()
        if (!config) throw new Error('Firebase 配置未找到')

        // 使用重定向方式登录
        const auth = getAuth()
        const provider = new GoogleAuthProvider()

        await signInWithRedirect(auth, provider)
      } catch (error) {
        console.error('重定向登录失败:', error)
      }
    },

    async handleRedirectResult() {
      try {
        const auth = getAuth()
        const result = await getRedirectResult(auth)

        if (result) {
          console.log('重定向登录成功:', result.user)
          return result
        }
      } catch (error) {
        console.error('处理重定向结果失败:', error)
      }
    }
  },

  async mounted() {
    // 检查是否有重定向结果
    await this.handleRedirectResult()
  }
}
</script>
```

#### 方案 2：添加重试机制

```vue
<script>
import { signInWithGoogle } from 'fg-login'

export default {
  methods: {
    async loginWithRetry(maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          console.log(`🔄 尝试登录 (${i + 1}/${maxRetries})`)

          const result = await signInWithGoogle()
          console.log('✅ 登录成功')
          return result
        } catch (error) {
          console.error(`❌ 第 ${i + 1} 次尝试失败:`, error.message)

          if (i === maxRetries - 1) {
            throw error // 最后一次尝试失败，抛出错误
          }

          // 等待后重试
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }
  }
}
</script>
```

### 5. 📋 完整的诊断脚本

```vue
<template>
  <div class="diagnostic-panel">
    <h2>Firebase 网络诊断</h2>

    <div class="diagnostic-section">
      <h3>环境信息</h3>
      <ul>
        <li>域名: {{ envInfo.hostname }}</li>
        <li>端口: {{ envInfo.port }}</li>
        <li>协议: {{ envInfo.protocol }}</li>
        <li>用户代理: {{ envInfo.userAgent }}</li>
      </ul>
    </div>

    <div class="diagnostic-section">
      <h3>Firebase 配置</h3>
      <pre v-if="firebaseConfig">{{ firebaseConfig }}</pre>
      <p v-else class="error">Firebase 配置未找到</p>
    </div>

    <div class="diagnostic-section">
      <h3>网络测试</h3>
      <button @click="runDiagnostics">运行完整诊断</button>
      <div v-if="diagnosticResults.length">
        <div
          v-for="result in diagnosticResults"
          :key="result.test"
          :class="['diagnostic-result', result.status]"
        >
          <strong>{{ result.test }}:</strong> {{ result.message }}
        </div>
      </div>
    </div>

    <div class="diagnostic-section">
      <h3>登录测试</h3>
      <button @click="testLogin">测试 Google 登录</button>
      <div
        v-if="loginResult"
        :class="['login-result', loginResult.success ? 'success' : 'error']"
      >
        {{ loginResult.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { getFirebaseConfig, signInWithGoogle } from 'fg-login'

export default {
  data() {
    return {
      envInfo: {
        hostname: window.location.hostname,
        port: window.location.port || '默认',
        protocol: window.location.protocol,
        userAgent: navigator.userAgent.slice(0, 100) + '...'
      },
      firebaseConfig: null,
      diagnosticResults: [],
      loginResult: null
    }
  },

  methods: {
    async runDiagnostics() {
      this.diagnosticResults = []

      const tests = [
        {
          name: '基础网络连接',
          test: () => this.testBasicConnectivity()
        },
        {
          name: 'Google 服务可访问性',
          test: () => this.testGoogleServices()
        },
        {
          name: 'Firebase 端点',
          test: () => this.testFirebaseEndpoint()
        },
        {
          name: 'DNS 解析',
          test: () => this.testDNSResolution()
        }
      ]

      for (const test of tests) {
        try {
          await test.test()
          this.addDiagnosticResult(test.name, '通过', 'success')
        } catch (error) {
          this.addDiagnosticResult(test.name, `失败: ${error.message}`, 'error')
        }
      }
    },

    addDiagnosticResult(test, message, status) {
      this.diagnosticResults.push({ test, message, status })
    },

    async testBasicConnectivity() {
      const response = await fetch('https://www.google.com', {
        mode: 'no-cors',
        method: 'HEAD'
      })
      if (!response) throw new Error('无法连接到互联网')
    },

    async testGoogleServices() {
      const response = await fetch('https://accounts.google.com', {
        mode: 'no-cors',
        method: 'HEAD'
      })
      if (!response) throw new Error('无法访问 Google 服务')
    },

    async testFirebaseEndpoint() {
      const response = await fetch('https://identitytoolkit.googleapis.com', {
        mode: 'no-cors',
        method: 'HEAD'
      })
      if (!response) throw new Error('无法访问 Firebase Auth 端点')
    },

    async testDNSResolution() {
      // 这个测试比较简单，主要是检查是否能解析域名
      const response = await fetch('https://firebase.googleapis.com', {
        mode: 'no-cors',
        method: 'HEAD'
      })
      if (!response) throw new Error('DNS 解析可能有问题')
    },

    async testLogin() {
      this.loginResult = null

      try {
        console.log('🔄 开始登录测试...')
        const result = await signInWithGoogle()

        this.loginResult = {
          success: true,
          message: `登录成功! 用户: ${result.user.email}`
        }
      } catch (error) {
        this.loginResult = {
          success: false,
          message: `登录失败: ${error.message}`
        }

        // 提供具体的解决建议
        if (error.code === 'auth/network-request-failed') {
          this.loginResult.message +=
            '\n\n建议:\n1. 检查授权域名配置\n2. 尝试使用 HTTPS\n3. 检查防火墙设置'
        }
      }
    }
  },

  mounted() {
    try {
      this.firebaseConfig = JSON.stringify(getFirebaseConfig(), null, 2)
    } catch (error) {
      console.error('获取 Firebase 配置失败:', error)
    }
  }
}
</script>

<style scoped>
.diagnostic-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.diagnostic-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.diagnostic-result {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 3px;
}

.diagnostic-result.success {
  background-color: #d4edda;
  color: #155724;
}

.diagnostic-result.error {
  background-color: #f8d7da;
  color: #721c24;
}

.login-result {
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  white-space: pre-line;
}

.login-result.success {
  background-color: #d4edda;
  color: #155724;
}

.login-result.error {
  background-color: #f8d7da;
  color: #721c24;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 12px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

## 🎯 快速解决方案

对于您的具体情况（IP: 192.168.1.211），最可能的解决方案：

1. **立即尝试**：在 Firebase 控制台的授权域名中添加 `192.168.1.211`
2. **使用 localhost**：将访问地址改为 `localhost:3000`
3. **启用 HTTPS**：使用 `npm run dev -- --https`

尝试这些方案后，网络请求失败的问题应该就能解决了！🚀
