# Nuxt3 样式恢复指南

## 🚨 恢复丢失的项目样式

如果您发现项目的原有样式丢失了，请按照以下步骤操作：

### 🎯 立即恢复方案

#### 步骤 1：移除可能冲突的 CSS 引用

**检查您的 `nuxt.config.ts`，如果有以下内容请暂时注释掉：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['fg-login/nuxt'],

  css: [
    // 'fg-login/style.css'  // ⚠️ 暂时注释掉这一行
    // ... 您的其他样式文件保持不变
  ],

  smLogin: {
    // 您的配置保持不变
  }
})
```

#### 步骤 2：清理缓存并重启

```bash
# 删除缓存
rm -rf .nuxt

# 重新启动开发服务器
npm run dev
```

#### 步骤 3：验证原有样式恢复

检查您的项目是否恢复正常：

- ✅ 原有的组件样式应该回来了
- ✅ 布局应该正常显示
- ✅ 自定义 CSS 类应该生效

### 🎨 安全添加 fg-login 样式

现在我们将以不影响您原有样式的方式添加 fg-login 样式：

#### 方法 1：在具体组件中引入（推荐）

只在使用 fg-login 组件的页面中引入样式：

```vue
<!-- pages/login.vue 或您使用 OAuth 登录的页面 -->
<template>
  <div class="login-page">
    <h1>用户登录</h1>
    <OAuthButton provider="google" />
    <OAuthButton provider="facebook" />
  </div>
</template>

<script setup>
// 页面级别引入，不影响全局
</script>

<style>
/* 只在这个组件中引入 fg-login 样式 */
@import 'fg-login/style.css';

/* 您的页面样式 */
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
```

#### 方法 2：创建独立的样式文件

创建 `assets/css/fg-login.css`：

```css
/* assets/css/fg-login.css */
@import 'fg-login/style.css';

/* 可以在这里添加对 fg-login 组件的自定义样式 */
.oauth-button {
  margin: 8px 0;
}
```

然后只在需要的页面中引入：

```vue
<style>
@import '~/assets/css/fg-login.css';
</style>
```

#### 方法 3：使用 CSS 作用域（最安全）

```vue
<template>
  <div class="fg-login-container">
    <OAuthButton provider="google" />
  </div>
</template>

<style scoped>
/* 使用 scoped 确保样式只影响当前组件 */
.fg-login-container {
  /* 您的容器样式 */
}

/* 为 fg-login 组件创建作用域样式 */
.fg-login-container :deep(.oauth-button) {
  /* 自定义 OAuth 按钮样式，不影响其他地方 */
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
}
</style>

<style>
/* 只在这个组件范围内引入 fg-login 样式 */
@import 'fg-login/style.css';
</style>
```

### 🔧 样式冲突调试

如果仍有样式问题，使用以下调试方法：

#### 检查样式加载顺序

```vue
<!-- 创建一个调试页面 pages/style-debug.vue -->
<template>
  <div class="debug-page">
    <h1>样式调试页面</h1>

    <div class="original-test">
      <h2>原有样式测试</h2>
      <button class="btn-primary">原有按钮样式</button>
      <p class="text-large">原有文本样式</p>
    </div>

    <div class="fg-login-test">
      <h2>fg-login 样式测试</h2>
      <OAuthButton provider="google" />
    </div>
  </div>
</template>

<script setup>
onMounted(() => {
  // 检查样式加载状态
  const checkStyles = () => {
    console.log('🔍 样式调试信息:')

    // 检查原有样式
    const originalBtn = document.querySelector('.btn-primary')
    if (originalBtn) {
      const styles = getComputedStyle(originalBtn)
      console.log('原有按钮样式:', {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding
      })
    }

    // 检查 fg-login 样式
    const oauthBtn = document.querySelector('.oauth-button')
    if (oauthBtn) {
      const styles = getComputedStyle(oauthBtn)
      console.log('OAuth 按钮样式:', {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding
      })
    }
  }

  setTimeout(checkStyles, 1000)
})
</script>

<style scoped>
.debug-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.original-test,
.fg-login-test {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>

<style>
/* 只在调试页面引入 fg-login 样式 */
@import 'fg-login/style.css';
</style>
```

### 📋 样式优先级管理

为了避免样式冲突，建议按以下优先级组织样式：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    // 1. 基础样式（最高优先级）
    '~/assets/css/base.css',

    // 2. 组件库样式（如果使用 Element Plus, Vuetify 等）
    // 'element-plus/dist/index.css',

    // 3. 第三方插件样式
    // 'fg-login/style.css',  // 建议在组件中按需引入

    // 4. 自定义样式（最低优先级，确保能覆盖其他样式）
    '~/assets/css/main.css'
  ]
})
```

### ✅ 验证恢复成功

恢复成功的标志：

1. **原有样式恢复**：

   - ✅ 页面布局正常
   - ✅ 组件样式正确
   - ✅ 自定义 CSS 类生效

2. **fg-login 功能正常**：

   - ✅ 组件自动注册成功
   - ✅ Firebase 配置正确传递
   - ✅ OAuth 按钮显示（即使没有样式）

3. **没有样式冲突**：
   - ✅ 控制台无 CSS 错误
   - ✅ 开发服务器正常启动
   - ✅ 样式加载顺序合理

### 🛡️ 预防样式冲突的最佳实践

1. **使用 CSS 作用域**：

   ```vue
   <style scoped>
   /* 组件内部样式 */
   </style>
   ```

2. **明确的类名命名**：

   ```css
   /* 好的命名 */
   .my-app-login-button {
   }
   .user-profile-avatar {
   }

   /* 避免通用命名 */
   .button {
   }
   .container {
   }
   ```

3. **按需加载第三方样式**：

   ```vue
   <!-- 只在需要的组件中引入 -->
   <style>
   @import 'library/specific-component.css';
   </style>
   ```

4. **使用 CSS 变量管理主题**：
   ```css
   :root {
     --primary-color: #007bff;
     --secondary-color: #6c757d;
   }
   ```

现在重新启动您的项目，您的原有样式应该恢复了！🎉
