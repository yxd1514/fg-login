# fg-login: Vue 登录组件与 Firebase 服务

## 简介

`fg-login` 是一个 Vue 组件库以及 api 库，提供了一个可定制的登录组件 `Login`，支持多种第三方 OAuth 提供商（Google, Facebook, Twitter, Apple, Microsoft）以及邮件验证码登录。同时，它还内置了一套 Firebase 服务封装函数，简化了 Firebase 认证功能在项目中的集成和使用。

该库支持动态加载 Firebase SDK，内置 Mock 环境，方便在开发、测试以及服务端渲染（SSR）或构建环境中使用。

同时集合了 Google 原生登录 api 以及相关设置，简易安装使用

**主要特性:**

- **Vue 组件 `Login`**:
  - 支持多种 OAuth 提供商。
  - 支持邮件（验证码）登录。
  - 可自定义的提供商列表和主题。
  - 清晰的事件派发机制。
- **Firebase 服务函数**:
  - 动态加载 Firebase SDK，减少初始包体积。
  - 内置 Mock 支持，方便开发和测试。
  - 灵活的 Firebase 配置方式。
  - 懒加载初始化 Firebase 实例。
  - 统一的错误处理，返回中文错误信息。
  - 提供清理函数，方便测试或多租户场景。

## 安装

```bash
npm install fg-login
# 或者
yarn add fg-login
```

## Firebase 配置 (重要)

在使用 `Login` 组件或直接调用 Firebase 服务函数之前，您**必须**配置您的 Firebase 项目信息。

从您的 Firebase 项目控制台获取以下配置信息：

- `apiKey` (必需)
- `authDomain` (必需)
- `projectId` (必需)
- `storageBucket` (可选)
- `messagingSenderId` (可选)
- `appId` (可选)
- `measurementId` (可选)

**配置方式：**

在您的应用初始化阶段，调用从 `fg-login` 导出的 `setFirebaseConfig` 函数：

```javascript
import { setFirebaseConfig } from 'fg-login'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID'
  // ... 其他可选配置
}

setFirebaseConfig(firebaseConfig)
```

或者，在客户端环境中，可以将配置对象赋值给全局变量 `window.__FIREBASE_CONFIG__` (不推荐，`setFirebaseConfig` 优先级更高)：

```javascript
// 仅限客户端
if (typeof window !== 'undefined') {
  window.__FIREBASE_CONFIG__ = {
    /* ...您的配置... */
  }
}
```

**注意**: 如果您在 Nuxt 项目中使用了本包提供的 Nuxt 模块 (如果存在)，Firebase 配置应通过 Nuxt 的配置文件提供 (详见 Nuxt 使用指南部分)。

---

## Nuxt 3 使用指南

详细用法请参考：[examples/nuxt3-style-recovery-guide.md](https://github.com/yxd1514/fg-login/blob/main/examples/nuxt3-setup-guide.md)

---

## Nuxt 2 使用指南

详细用法请参考：[examples/nuxt2-firebase-api-guide.md](https://github.com/yxd1514/fg-login/blob/main/examples/nuxt2-google-login-guide.md)

---

## `Login` 组件详解

### 组件属性 (Props)

| 属性                   | 类型    | 默认值                                                                                               | 说明                                                                                                |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `title`                | String  | `Login to your account`                                                                              | 登录框标题                                                                                          |
| `providers`            | Array   | `['google', 'facebook']`                                                                             | 要显示的第三方登录提供商。可选值: `'google'`, `'facebook'`, `'twitter'`, `'microsoft'`, `'apple'`。 |
| `showEmailLogin`       | Boolean | `true`                                                                                               | 是否显示邮箱登录区域                                                                                |
| `showVerificationCode` | Boolean | `true`                                                                                               | 在邮箱登录区域中是否显示验证码输入框                                                                |
| `emailPlaceholder`     | String  | `Enter your email`                                                                                   | 邮箱输入框的占位文本                                                                                |
| `submitButtonText`     | String  | `Get Started`                                                                                        | 邮箱登录部分的提交按钮文本                                                                          |
| `theme`                | Object  | `{ primaryColor: '#3951d4', secondaryColor: '#3ad0de', buttonRadius: '4px', fontFamily: 'Poppins' }` | 组件的主题配置对象，可以自定义颜色、字体、按钮圆角等。                                              |

### 事件 (Events)

| 事件名          | 参数载荷 (`payload`)                           | 说明                                                              |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `email-submit`  | `{ email: string, verificationCode?: string }` | 用户提交邮箱和验证码（如果显示）时触发。                          |
| `code-send`     | `email: string`                                | 当用户请求发送验证码到指定邮箱时触发（如果组件内部有此功能）。    |
| `get-started`   | `{ email: string, verificationCode?: string }` | (通常与 `email-submit` 类似或为其别名) 当邮箱登录流程开始时触发。 |
| `oauth-success` | `result` (Firebase UserCredential)             | 第三方 OAuth 登录成功时触发，`result` 包含用户信息。              |
| `oauth-error`   | `error` (自定义错误对象)                       | 第三方 OAuth 登录失败时触发，`error` 包含错误码和本地化消息。     |

---

## Firebase 服务函数 API

这些服务函数从 `fg-login` 主包中导出，可用于更细粒度地控制 Firebase 认证流程。

### 核心函数

#### `setFirebaseConfig(config)`

- **描述**: 设置 Firebase 项目的配置。**必须在应用启动时调用一次**。
- **参数**: `config` (Object) - Firebase 配置对象。
- **返回**: `Object` - 当前生效的配置对象。

#### `getFirebaseConfig()`

- **描述**: 获取当前库正在使用的 Firebase 配置。
- **返回**: `Object` - 当前的 Firebase 配置对象。

#### `initFirebase()`

- **描述**: 初始化并返回 Firebase 应用实例和认证服务等。此函数通常由库内部的认证方法自动调用，用户一般不需要直接调用。它实现了懒加载。
- **返回**: `Object` - 包含 Firebase `app`, `auth` 对象及各认证提供商实例。

#### `cleanup()`

- **描述**: 清理函数。重置已缓存的 Firebase 实例和全局配置。
- **返回**: `void`

### 认证方法

所有以 `_` 开头的认证方法 (例如 `_signUpWithGoogle`) 都返回一个 `Promise`。

- **成功时**: `resolve` 返回 Firebase 的操作结果 (通常是 `UserCredential`)。
- **失败时**: `reject` 返回一个包含以下字段的错误对象：
  - `code` (string): Firebase 的原始错误码 (e.g., `auth/user-not-found`)。
  - `message` (string): 经过本地化（中文）的错误信息。
  - `originalError` (Error): Firebase 返回的原始错误对象。
  - `domain` (string, 可选): 仅在 `auth/unauthorized-domain` 错误时出现。

**示例错误处理:**

```javascript
import { _signUpWithApple } from 'fg-login'

try {
  const result = await _signUpWithApple()
  console.log('Apple Sign-In successful, user:', result.user)
} catch (error) {
  console.error('错误码:', error.code)
  console.error('错误信息:', error.message)
  // console.error("原始错误:", error.originalError);
}
```

#### `_signUpWithGoogle()`

- **描述**: Google 账号 Popup 登录。
- **返回**: `Promise<UserCredential>`

#### `_signUpWithFacebook()`

- **描述**: Facebook 账号 Popup 登录。
- **返回**: `Promise<UserCredential>`

#### `_signUpWithTwitter()`

- **描述**: Twitter 账号 Popup 登录。
- **返回**: `Promise<UserCredential>`

#### `_signUpWithApple()`

- **描述**: Apple 账号 Popup 登录。
- **返回**: `Promise<UserCredential>`

#### `_signUpWithMicrosoft()`

- **描述**: Microsoft 账号 Popup 登录。
- **返回**: `Promise<UserCredential>`

#### `_signOut()`

- **描述**: 登出当前用户。
- **返回**: `Promise<void>`

#### `_sendPasswordResetEmail(email)`

- **描述**: 发送密码重置邮件。
- **参数**: `email` (string)
- **返回**: `Promise<void>`

#### `_sendEmailVerification()`

- **描述**: 给当前已登录用户发送邮箱验证邮件。
- **返回**: `Promise<void>`

#### `_verifyEmail(actionCode)`

- **描述**: 应用邮件验证操作码。
- **参数**: `actionCode` (string)
- **返回**: `Promise<void>`

#### `_resetPassword(actionCode)`

- **描述**: 验证密码重置操作码。
- **参数**: `actionCode` (string)
- **返回**: `Promise<string>` - 成功时返回用户的电子邮件地址。

### Mock 环境

在开发初期、测试、SSR 或 Firebase SDK 加载失败时，本库会自动回退到 Mock 环境。Mock API 会返回模拟的成功响应，不会执行真实的 Firebase 操作。

### 高级主题

- **懒加载机制**: Firebase 实例按需初始化。
- **动态导入 Firebase**: 在客户端动态导入 Firebase SDK，减少主包体积，并支持 Mock 回退。

## 贡献

欢迎提交 Issues 或 Pull Requests。

## 许可证

(请在此处填写您的项目许可证，例如 MIT, Apache 2.0 等)
