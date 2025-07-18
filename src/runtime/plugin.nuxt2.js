// Nuxt2 插件 - 纯JavaScript版本，避免相对路径问题
export default function ({ app, $config, options }, inject) {
  try {
    // 🔧 修复：增强配置获取逻辑
    let smLoginConfig = null;

    // 方式0: 从插件 options 获取（模块直接传递）
    if (options && (options.firebase || options.google)) {
      smLoginConfig = options;
    }
    // 方式1: 从 $config.smLogin 获取（直接配置）
    else if ($config && $config.smLogin) {
      smLoginConfig = $config.smLogin;
    }
    // 方式2: 从 $config 的 publicRuntimeConfig 获取
    else if (
      $config &&
      $config.publicRuntimeConfig &&
      $config.publicRuntimeConfig.smLogin
    ) {
      smLoginConfig = $config.publicRuntimeConfig.smLogin;
    }
    // 方式3: 从 app.$config 获取
    else if (app && app.$config && app.$config.smLogin) {
      smLoginConfig = app.$config.smLogin;
    }

    // 🔍 调试信息
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('🔍 [Nuxt2 Plugin] options:', options);
    //   console.log('🔍 [Nuxt2 Plugin] $config:', $config);
    //   console.log('🔍 [Nuxt2 Plugin] smLoginConfig:', smLoginConfig);
    // }

    // 基础提供对象
    const smLoginProvide = {
      // 预留方法，实际功能在组件中直接使用
      getFirebaseConfig() {
        return (smLoginConfig && smLoginConfig.firebase) || null;
      },
      getGoogleConfig() {
        return (smLoginConfig && smLoginConfig.google) || null;
      },
      // 🔧 新增：获取完整配置的方法
      getConfig: () => {
        return smLoginConfig || null;
      }
    };

    // 设置全局配置便于组件访问
    if (typeof window !== 'undefined') {
      // 设置Firebase配置到全局
      if (smLoginConfig && smLoginConfig.firebase) {
        window.__FIREBASE_CONFIG__ = smLoginConfig.firebase;
      }

      // 设置Google配置到全局
      if (
        smLoginConfig &&
        smLoginConfig.google &&
        smLoginConfig.google.client_id
      ) {
        window.__GOOGLE_CONFIG__ = smLoginConfig.google;
      }

      // 🔧 新增：设置完整配置到全局
      if (smLoginConfig) {
        window.__SM_LOGIN_CONFIG__ = smLoginConfig;
      }
    }

    // 注入基础服务
    inject('smLogin', smLoginProvide);

    // 🔧 如果有配置，输出配置摘要
    if (smLoginConfig) {
      const hasFirebase = !!(
        smLoginConfig.firebase && smLoginConfig.firebase.apiKey
      );
      const hasGoogle = !!(
        smLoginConfig.google && smLoginConfig.google.client_id
      );
      // console.log(
      //   `📋 插件配置摘要: Firebase ${hasFirebase ? '✅' : '❌'}, Google ${
      //     hasGoogle ? '✅' : '❌'
      //   }`
      // );
    } else {
      console.warn(
        '⚠️ 插件未找到 smLogin 配置，请检查 nuxt.config.js 中的配置'
      );
    }
  } catch (error) {
    console.error('[Nuxt2 Plugin] 初始化失败:', error);

    // 失败时提供最小功能
    inject('smLogin', {
      getFirebaseConfig: () => null,
      getGoogleConfig: () => null,
      getConfig: () => null
    });
  }
}
