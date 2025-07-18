// Nuxt2 插件 - 纯JavaScript版本，避免相对路径问题
export default function ({ app, $config, options }, inject) {
  try {
    // 🔧 修复：增强配置获取逻辑
    let fgLoginConfig = null

    // 方式0: 从插件 options 获取（模块直接传递）
    if (options && (options.firebase || options.google)) {
      fgLoginConfig = options
    }
    // 方式1: 从 $config.fgLogin 获取（直接配置）
    else if ($config && $config.fgLogin) {
      fgLoginConfig = $config.fgLogin
    }
    // 方式2: 从 $config 的 publicRuntimeConfig 获取
    else if (
      $config &&
      $config.publicRuntimeConfig &&
      $config.publicRuntimeConfig.fgLogin
    ) {
      fgLoginConfig = $config.publicRuntimeConfig.fgLogin
    }
    // 方式3: 从 app.$config 获取
    else if (app && app.$config && app.$config.fgLogin) {
      fgLoginConfig = app.$config.fgLogin
    }

    // 🔍 调试信息
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('🔍 [Nuxt2 Plugin] options:', options);
    //   console.log('🔍 [Nuxt2 Plugin] $config:', $config);
    //   console.log('🔍 [Nuxt2 Plugin] fgLoginConfig:', fgLoginConfig);
    // }

    // 基础提供对象
    const fgLoginProvide = {
      // 预留方法，实际功能在组件中直接使用
      getFirebaseConfig() {
        return (fgLoginConfig && fgLoginConfig.firebase) || null
      },
      getGoogleConfig() {
        return (fgLoginConfig && fgLoginConfig.google) || null
      },
      // 🔧 新增：获取完整配置的方法
      getConfig: () => {
        return fgLoginConfig || null
      }
    }

    // 设置全局配置便于组件访问
    if (typeof window !== 'undefined') {
      // 设置Firebase配置到全局
      if (fgLoginConfig && fgLoginConfig.firebase) {
        window.__FIREBASE_CONFIG__ = fgLoginConfig.firebase
      }

      // 设置Google配置到全局
      if (
        fgLoginConfig &&
        fgLoginConfig.google &&
        fgLoginConfig.google.client_id
      ) {
        window.__GOOGLE_CONFIG__ = fgLoginConfig.google
      }

      // 🔧 新增：设置完整配置到全局
      if (fgLoginConfig) {
        window.__SM_LOGIN_CONFIG__ = fgLoginConfig
      }
    }

    // 注入基础服务
    inject('fgLogin', fgLoginProvide)

    // 🔧 如果有配置，输出配置摘要
    if (fgLoginConfig) {
      const hasFirebase = !!(
        fgLoginConfig.firebase && fgLoginConfig.firebase.apiKey
      )
      const hasGoogle = !!(
        fgLoginConfig.google && fgLoginConfig.google.client_id
      )
      // console.log(
      //   `📋 插件配置摘要: Firebase ${hasFirebase ? '✅' : '❌'}, Google ${
      //     hasGoogle ? '✅' : '❌'
      //   }`
      // );
    } else {
      console.warn('⚠️ 插件未找到 fgLogin 配置，请检查 nuxt.config.js 中的配置')
    }
  } catch (error) {
    console.error('[Nuxt2 Plugin] 初始化失败:', error)

    // 失败时提供最小功能
    inject('fgLogin', {
      getFirebaseConfig: () => null,
      getGoogleConfig: () => null,
      getConfig: () => null
    })
  }
}
