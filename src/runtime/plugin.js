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
      const smLoginProvide = {
        getFirebaseConfig,
        getGoogleConfig
      }

      // 设置Firebase配置
      if (config.public.smLogin && config.public.smLogin.firebase) {
        // 确保在客户端环境下设置配置
        if (process.client) {
          // 设置全局配置
          if (typeof window !== 'undefined') {
            window.__FIREBASE_CONFIG__ = config.public.smLogin.firebase
          }

          // 设置Firebase配置
          const result = setFirebaseConfig(config.public.smLogin.firebase)

          // 立即初始化Firebase，确保使用正确的配置
          const firebaseInstance = initFirebase()

          // 添加Firebase实例到提供对象
          smLoginProvide.firebaseApp = firebaseInstance.app
          smLoginProvide.firebaseAuth = firebaseInstance.auth
        }
      } else {
        console.warn('[Nuxt Plugin] No Firebase configuration found in smLogin')
      }

      // 设置Google原生登录配置（可选）
      if (
        config.public.smLogin &&
        config.public.smLogin.google &&
        config.public.smLogin.google.client_id
      ) {
        if (process.client) {
          // 设置Google配置
          const googleConfigSet = setGoogleConfig(config.public.smLogin.google)

          if (googleConfigSet) {
            // 设置全局配置
            if (typeof window !== 'undefined') {
              window.__GOOGLE_CONFIG__ = config.public.smLogin.google
            }

            // 添加Google相关功能到提供对象
            smLoginProvide.googleNativeLogin = googleNativeLogin
          }
        }
      }
      // 移除没有Google配置时的日志输出，因为这是可选功能

      // 提供给应用使用
      return {
        provide: {
          smLogin: smLoginProvide
        }
      }
    } catch (error) {
      console.error('[Nuxt Plugin] Failed to initialize fg-login:', error)
    }

    return {
      provide: {
        smLogin: {
          getFirebaseConfig,
          getGoogleConfig
        }
      }
    }
  }
})
