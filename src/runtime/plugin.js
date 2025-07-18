import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import {
  setFirebaseConfig,
  getFirebaseConfig,
  initFirebase
} from '../assets/tools/firebase'
import {
  setGoogleConfig,
  getGoogleConfig,
  googleNativeLogin
} from '../common/googleNativeLogin'

export default defineNuxtPlugin({
  name: 'fg-login',
  enforce: 'pre', // 确保在其他插件之前执行
  async setup(nuxtApp) {
    const config = useRuntimeConfig()

    try {
      const fgLoginProvide = {
        getFirebaseConfig,
        getGoogleConfig
      }

      // 设置Firebase配置
      if (config.public.fgLogin && config.public.fgLogin.firebase) {
        // 确保在客户端环境下设置配置
        if (process.client) {
          // 设置全局配置
          if (typeof window !== 'undefined') {
            window.__FIREBASE_CONFIG__ = config.public.fgLogin.firebase
          }

          // 设置Firebase配置
          const result = setFirebaseConfig(config.public.fgLogin.firebase)

          // 立即初始化Firebase，确保使用正确的配置
          const firebaseInstance = initFirebase()

          // 添加Firebase实例到提供对象
          fgLoginProvide.firebaseApp = firebaseInstance.app
          fgLoginProvide.firebaseAuth = firebaseInstance.auth
        }
      } else {
        console.warn('[Nuxt Plugin] No Firebase configuration found in fgLogin')
      }

      // 设置Google原生登录配置（可选）
      if (
        config.public.fgLogin &&
        config.public.fgLogin.google &&
        config.public.fgLogin.google.client_id
      ) {
        if (process.client) {
          // 设置Google配置
          const googleConfigSet = setGoogleConfig(config.public.fgLogin.google)

          if (googleConfigSet) {
            // 设置全局配置
            if (typeof window !== 'undefined') {
              window.__GOOGLE_CONFIG__ = config.public.fgLogin.google
            }

            // 添加Google相关功能到提供对象
            fgLoginProvide.googleNativeLogin = googleNativeLogin
          }
        }
      }
      // 移除没有Google配置时的日志输出，因为这是可选功能

      // 提供给应用使用
      return {
        provide: {
          fgLogin: fgLoginProvide
        }
      }
    } catch (error) {
      console.error('[Nuxt Plugin] Failed to initialize fg-login:', error)
    }

    return {
      provide: {
        fgLogin: {
          getFirebaseConfig,
          getGoogleConfig
        }
      }
    }
  }
})
