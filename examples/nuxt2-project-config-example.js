// 这是您在 Nuxt2 项目中的 nuxt.config.js 配置示例
// 文件路径: /path/to/your/nuxt2-project/nuxt.config.js

export default {
  // 基本配置
  mode: 'universal',

  // 注册 fg-login 模块
  modules: [
    'fg-login/nuxt2' // 这里引用 fg-login 包的 Nuxt2 模块
  ],

  // ⭐ 重要：配置 fg-login 参数
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
      client_id: 'your-google-client-id.googleusercontent.com',
      context: 'signin',
      ux_mode: 'popup',
      cancel_on_tap_outside: false
    }
  },

  // 其他 Nuxt2 配置...
  head: {
    title: 'My Nuxt2 App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },

  // CSS 配置
  css: [],

  // 插件配置
  plugins: [],

  // 构建配置
  build: {}
}
