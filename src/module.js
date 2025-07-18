import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponent
} from '@nuxt/kit'
import { fileURLToPath } from 'url'

export default defineNuxtModule({
  meta: {
    name: 'fg-login',
    configKey: 'smLogin',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    firebase: {},
    google: {}
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // 🎨 正确加载组件样式 - 加载主题文件而不是全局重置样式
    try {
      nuxt.options.css = nuxt.options.css || []

      // 只加载组件样式，不包含全局重置样式
      // theme.css 包含所有fg-login组件的样式
      nuxt.options.css.push('fg-login/theme.css')
    } catch (error) {
      console.warn('⚠️ fg-login 样式加载失败，请手动引入:', error.message)
      console.log('📖 手动引入方式: import "fg-login/theme.css"')
    }

    // 自动注册组件
    // 主登录组件
    addComponent({
      name: 'ThirdPartyLoginModal',
      export: 'ThirdPartyLoginModal',
      filePath: resolve('./components')
    })

    // OAuth按钮组件
    addComponent({
      name: 'OAuthButton',
      export: 'OAuthButton',
      filePath: resolve('./components')
    })

    // 邮箱输入组件
    addComponent({
      name: 'EmailInput',
      export: 'EmailInput',
      filePath: resolve('./components')
    })

    // 验证码输入组件
    addComponent({
      name: 'VerificationCodeInput',
      export: 'VerificationCodeInput',
      filePath: resolve('./components')
    })

    // 添加运行时插件
    addPlugin({
      src: resolve(runtimeDir, 'plugin'),
      mode: 'client'
    })

    // 暴露配置到运行时配置
    nuxt.options.runtimeConfig.public.smLogin = {
      ...options,
      firebase: options.firebase || {},
      google: options.google || {}
    }
  }
})
