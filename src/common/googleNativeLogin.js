/**
 * Google原生登录模块
 * 支持配置化的Google登录功能
 * 兼容 Nuxt2/3、Vue、React、原生JavaScript 等多种环境
 */

// 尝试导入 Nuxt 的 useRuntimeConfig（仅在 Nuxt3 环境下）
let useRuntimeConfig = null;
try {
  // 只在客户端环境尝试获取，避免构建时的模块解析问题
  if (typeof window !== 'undefined') {
    // 客户端环境，尝试从全局获取
    useRuntimeConfig =
      (window.__NUXT__ && window.__NUXT__.useRuntimeConfig) || // Nuxt3
      window.useRuntimeConfig ||
      (() => {
        // Nuxt2 兼容
        if (window.$nuxt && window.$nuxt.$config) {
          return window.$nuxt.$config;
        }
        return { public: {} };
      });
  } else {
    // 服务端环境 - 不尝试导入任何模块，避免构建错误
    useRuntimeConfig = null;
  }
} catch (e) {
  // 在非Nuxt环境中忽略错误
  useRuntimeConfig = null;
}

/**
 * 检测当前运行环境
 * @returns {string} 环境类型
 */
const detectEnvironment = () => {
  if (typeof window === 'undefined') return 'server';
  if (window.__NUXT__) return 'nuxt3';
  if (window.$nuxt) return 'nuxt2';
  if (typeof Vue !== 'undefined') return 'vue';
  if (typeof React !== 'undefined') return 'react';
  return 'vanilla';
};

/**
 * 动态加载JavaScript脚本
 * @param {string} src - 脚本URL
 * @returns {Promise<boolean>} 加载是否成功
 */
const loadJS = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
  });
};

/**
 * 🔧 处理和验证DOM元素的辅助函数
 * @param {any} element - 可能的DOM元素、Vue ref等
 * @returns {{isValid: boolean, element: HTMLElement|null, error?: string}} 验证结果
 */
const processElement = (element) => {
  if (!element) {
    return { isValid: false, element: null, error: 'DOM元素不能为空' };
  }

  let targetElement = element;

  // 处理Vue 2的ref对象 (this.$refs.xxx)
  if (element && typeof element === 'object' && element.$el) {
    targetElement = element.$el;
  }

  // 处理Vue 3的ref对象 (ref.value)
  if (element && typeof element === 'object' && element.value) {
    targetElement = element.value;
  }

  // 处理可能的包装对象
  if (targetElement && typeof targetElement === 'object' && targetElement.el) {
    targetElement = targetElement.el;
  }

  // 最终验证DOM元素
  if (
    !targetElement ||
    typeof targetElement !== 'object' ||
    typeof targetElement.appendChild !== 'function' ||
    !targetElement.nodeType ||
    targetElement.nodeType !== 1
  ) {
    return {
      isValid: false,
      element: null,
      error: `无效的DOM元素。期望HTMLElement，但得到: ${typeof targetElement}。原始元素: ${element}`
    };
  }

  return { isValid: true, element: targetElement };
};

/**
 * Google原生登录类
 */
class GoogleNativeLogin {
  constructor() {
    this.config = {};
    this.initialized = false;
    this.isGoogleLoaded = false;
  }

  /**
   * 设置Google配置
   * @param {Object} config - Google配置对象
   * @param {string} config.client_id - Google客户端ID
   * @param {string} config.context - 登录上下文，默认'signin'
   * @param {string} config.ux_mode - UX模式，默认'popup'
   * @param {boolean} config.cancel_on_tap_outside - 是否允许点击外部取消，默认false
   */
  setConfig(config) {
    if (!config || !config.client_id) {
      console.warn('Google配置无效：缺少client_id');
      return false;
    }
    this.config = {
      context: 'signin',
      ux_mode: 'popup',
      cancel_on_tap_outside: false,
      ...config
    };
    return true;
  }

  /**
   * 初始化Google登录API
   * @returns {Promise<boolean>} 初始化是否成功
   */
  async initialize() {
    if (!this.config) {
      console.warn('Google配置未设置，无法初始化');
      return false;
    }

    if (!window.google) {
      const loaded = await loadJS('https://accounts.google.com/gsi/client');
      if (!loaded) {
        console.error('Google登录脚本加载失败');
        return false;
      }
    }

    this.initialized = true;
    return true;
  }

  /**
   * 渲染Google登录按钮
   * @param {Object} options - 渲染选项
   * @param {HTMLElement} options.element - 要渲染按钮的DOM元素
   * @param {Function} options.callback - 登录成功回调函数
   * @param {Object} options.buttonConfig - 按钮配置
   * @param {string} options.buttonConfig.theme - 主题，默认'outline'
   * @param {string} options.buttonConfig.size - 大小，默认'large'
   * @param {number} options.buttonConfig.width - 宽度
   * @param {string} options.buttonConfig.logo_alignment - Logo对齐方式，默认'center'
   * @returns {Promise<boolean>} 渲染是否成功
   */
  async renderButton({ element, callback, buttonConfig = {} }) {
    if (!this.initialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return false;
      }
    }

    // 🔧 使用辅助函数处理DOM元素
    const elementResult = processElement(element);
    if (!elementResult.isValid) {
      console.error('Google按钮渲染失败:', elementResult.error);
      return false;
    }

    const targetElement = elementResult.element;

    if (!callback || typeof callback !== 'function') {
      console.error('回调函数不能为空');
      return false;
    }

    // 设置默认按钮配置
    const defaultButtonConfig = {
      theme: 'outline',
      size: 'large',
      width: window.innerWidth >= 980 ? 400 : targetElement.offsetWidth || 400,
      logo_alignment: 'center',
      click_listener: () => {}
    };

    const finalButtonConfig = { ...defaultButtonConfig, ...buttonConfig };

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // 初始化Google登录
          if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id
          ) {
            window.google.accounts.id.initialize({
              client_id: this.config.client_id,
              context: this.config.context,
              ux_mode: this.config.ux_mode,
              cancel_on_tap_outside: this.config.cancel_on_tap_outside,
              callback: (response) => {
                callback(response.credential);
              }
            });
          }

          // 渲染Google登录按钮 - 使用处理后的DOM元素
          if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id
          ) {
            window.google.accounts.id.renderButton(
              targetElement,
              finalButtonConfig
            );
          }

          resolve(true);
        } catch (error) {
          console.error('Google按钮渲染失败:', error);
          resolve(false);
        }
      }, 0);
    });
  }

  /**
   * 检查是否已配置Google登录
   * @returns {boolean} 是否已配置
   */
  isConfigured() {
    return !!this.config && !!this.config.client_id;
  }
}

// 全局引用变量
export const googleRef = { value: null };

// 创建实例
const googleNativeLogin = new GoogleNativeLogin();

/**
 * 初始化Google原生登录（兼容多种框架）
 * @param {HTMLElement} googleRef - Google按钮的DOM引用
 * @param {Function} otherLogin - 登录回调函数
 * @param {Object} config - Google配置
 * @returns {Promise<{success: boolean, error?: string}>} 初始化结果
 */
const initGoogleNativeLogin = async (googleRef, otherLogin, config = null) => {
  // 🔧 使用辅助函数处理DOM元素
  const elementResult = processElement(googleRef);
  if (!elementResult.isValid) {
    return {
      success: false,
      error: elementResult.error
    };
  }

  const targetElement = elementResult.element;

  if (!otherLogin || typeof otherLogin !== 'function') {
    return {
      success: false,
      error: '回调函数不能为空或类型不正确'
    };
  }

  // 如果传入了配置，使用传入的配置
  if (config && config.client_id) {
    const configSet = googleNativeLogin.setConfig(config);
    if (!configSet) {
      return {
        success: false,
        error: '传入的Google配置无效'
      };
    }
  }

  // 如果没有配置，尝试从多种方式获取配置
  if (!googleNativeLogin.isConfigured()) {
    let foundConfig = null;
    const env = detectEnvironment();

    // 方式1: 从全局变量获取（通用方式）
    if (typeof window !== 'undefined' && window.__GOOGLE_CONFIG__) {
      foundConfig = window.__GOOGLE_CONFIG__;
    }

    // 方式2: Nuxt3 - 从 useRuntimeConfig 获取
    if (!foundConfig && env === 'nuxt3') {
      try {
        if (useRuntimeConfig && typeof useRuntimeConfig === 'function') {
          const runtimeConfig = useRuntimeConfig();
          if (
            runtimeConfig.public &&
            runtimeConfig.public.smLogin &&
            runtimeConfig.public.smLogin.google &&
            runtimeConfig.public.smLogin.google.client_id
          ) {
            foundConfig = runtimeConfig.public.smLogin.google;
          }
        }
      } catch (e) {
        // 忽略错误
      }
    }

    // 方式3: Nuxt2 - 从 $config 获取
    if (!foundConfig && env === 'nuxt2') {
      // 🔧 增强 Nuxt2 配置获取逻辑

      // 方式3.1: 从全局 $config 获取
      if (
        typeof $config !== 'undefined' &&
        $config.smLogin &&
        $config.smLogin.google &&
        $config.smLogin.google.client_id
      ) {
        foundConfig = $config.smLogin.google;
      }
      // 方式3.2: 从 $config.publicRuntimeConfig 获取
      else if (
        typeof $config !== 'undefined' &&
        $config.publicRuntimeConfig &&
        $config.publicRuntimeConfig.smLogin &&
        $config.publicRuntimeConfig.smLogin.google &&
        $config.publicRuntimeConfig.smLogin.google.client_id
      ) {
        foundConfig = $config.publicRuntimeConfig.smLogin.google;
      }
      // 方式3.3: 从 window.$nuxt.$config 获取
      else if (
        window.$nuxt &&
        window.$nuxt.$config &&
        window.$nuxt.$config.smLogin &&
        window.$nuxt.$config.smLogin.google &&
        window.$nuxt.$config.smLogin.google.client_id
      ) {
        foundConfig = window.$nuxt.$config.smLogin.google;
      }
      // 方式3.4: 从 window.$nuxt.$config.publicRuntimeConfig 获取
      else if (
        window.$nuxt &&
        window.$nuxt.$config &&
        window.$nuxt.$config.publicRuntimeConfig &&
        window.$nuxt.$config.publicRuntimeConfig.smLogin &&
        window.$nuxt.$config.publicRuntimeConfig.smLogin.google &&
        window.$nuxt.$config.publicRuntimeConfig.smLogin.google.client_id
      ) {
        foundConfig = window.$nuxt.$config.publicRuntimeConfig.smLogin.google;
      }
      // 方式3.5: 从全局配置变量获取
      else if (
        window.__SM_LOGIN_CONFIG__ &&
        window.__SM_LOGIN_CONFIG__.google &&
        window.__SM_LOGIN_CONFIG__.google.client_id
      ) {
        foundConfig = window.__SM_LOGIN_CONFIG__.google;
      }
    }

    // 方式4: 从环境变量获取（适用于各种框架）
    if (!foundConfig && typeof process !== 'undefined' && process.env) {
      if (
        process.env.VUE_APP_GOOGLE_CLIENT_ID ||
        process.env.REACT_APP_GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID
      ) {
        foundConfig = {
          client_id:
            process.env.VUE_APP_GOOGLE_CLIENT_ID ||
            process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            process.env.GOOGLE_CLIENT_ID
        };
      }
    }

    // 方式5: 从插件注入获取（Nuxt通用）
    if (
      !foundConfig &&
      typeof window !== 'undefined' &&
      window.$nuxt &&
      window.$nuxt.$smLogin &&
      window.$nuxt.$smLogin.getGoogleConfig
    ) {
      try {
        foundConfig = window.$nuxt.$smLogin.getGoogleConfig();
      } catch (e) {
        // 忽略错误
      }
    }

    // 如果找到了配置，设置它
    if (foundConfig && foundConfig.client_id) {
      googleNativeLogin.setConfig(foundConfig);
    }
  }

  if (!googleNativeLogin.isConfigured()) {
    const env = detectEnvironment();
    let errorMessage = 'Google登录未配置，请通过以下方式之一进行配置：\n';

    switch (env) {
      case 'nuxt3':
        errorMessage +=
          '1. 在 nuxt.config.ts 中配置 smLogin.google.client_id\n';
        errorMessage += '2. 手动传入配置对象';
        break;
      case 'nuxt2':
        errorMessage +=
          '1. 在 nuxt.config.js 中配置 smLogin.google.client_id\n';
        errorMessage += '2. 手动传入配置对象';
        break;
      case 'vue':
        errorMessage += '1. 设置环境变量 VUE_APP_GOOGLE_CLIENT_ID\n';
        errorMessage += '2. 手动传入配置对象';
        break;
      case 'react':
        errorMessage += '1. 设置环境变量 REACT_APP_GOOGLE_CLIENT_ID\n';
        errorMessage += '2. 手动传入配置对象';
        break;
      default:
        errorMessage += '1. 设置全局变量 window.__GOOGLE_CONFIG__\n';
        errorMessage += '2. 手动传入配置对象';
    }

    return {
      success: false,
      error: errorMessage
    };
  }

  try {
    const renderSuccess = await googleNativeLogin.renderButton({
      element: targetElement,
      callback: otherLogin
    });

    if (!renderSuccess) {
      return {
        success: false,
        error: 'Google按钮渲染失败，可能是网络问题或Google服务不可用'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: `Google登录初始化异常: ${error.message}`
    };
  }
};

/**
 * 设置Google配置
 * @param {Object} config - Google配置
 */
const setGoogleConfig = (config) => {
  return googleNativeLogin.setConfig(config);
};

/**
 * 获取当前Google配置
 * @returns {Object|null} 当前配置
 */
const getGoogleConfig = () => {
  return googleNativeLogin.config;
};

// 统一导出
export {
  GoogleNativeLogin,
  googleNativeLogin,
  initGoogleNativeLogin,
  setGoogleConfig,
  getGoogleConfig
};
