// fg-login Vue2专用入口文件
// 此文件确保在Vue2环境中只提供方法，不包含任何Vue组件

// 直接导出核心方法，避免任何Vue相关的依赖
export {
  GoogleNativeLogin,
  googleNativeLogin,
  initGoogleNativeLogin,
  setGoogleConfig,
  getGoogleConfig
} from './common/googleNativeLogin.js'

// 导出工具函数
export * from './common/utils.js'

// 版本信息
export const version = '1.0.13'

// Vue2专用信息
export const vue2Info = {
  name: 'fg-login',
  description: 'sm登录组件 - Vue2专用版本',
  components: false,
  compatibility: ['Vue2'],
  warning: '此版本仅包含方法函数，不包含Vue组件'
}
