// fg-login 纯方法版本 - 适用于Vue2/CommonJS环境
// 此版本不包含Vue组件，只提供方法函数

// 导出核心方法
export { GoogleNativeLogin } from './common/googleNativeLogin.js'

// Firebase认证方法导出
export {
  setFirebaseConfig,
  getFirebaseConfig,
  _signUpWithGoogle,
  _signUpWithFacebook,
  _signUpWithTwitter,
  _signUpWithMicrosoft,
  _signUpWithApple,
  _signOut,
  _sendPasswordResetEmail,
  _sendEmailVerification,
  _verifyEmail,
  _resetPassword
} from './assets/tools/firebase.js'

// 使用别名导出Firebase认证方法
export { _signUpWithGoogle as signInWithGoogle } from './assets/tools/firebase.js'
export { _signUpWithFacebook as signInWithFacebook } from './assets/tools/firebase.js'
export { _signUpWithTwitter as signInWithTwitter } from './assets/tools/firebase.js'
export { _signUpWithMicrosoft as signInWithMicrosoft } from './assets/tools/firebase.js'
export { _signUpWithApple as signInWithApple } from './assets/tools/firebase.js'
export { _signOut as signOut } from './assets/tools/firebase.js'
export { _sendPasswordResetEmail as sendPasswordResetEmail } from './assets/tools/firebase.js'
export { _sendEmailVerification as sendEmailVerification } from './assets/tools/firebase.js'
export { _verifyEmail as verifyEmail } from './assets/tools/firebase.js'
export { _resetPassword as resetPassword } from './assets/tools/firebase.js'

// 导出工具函数
export * from './common/utils.js'

// 创建默认导出对象
const smLoginMethods = {
  // 核心类
  GoogleNativeLogin: null,

  // 工具函数
  utils: {},

  // 版本信息
  version: '1.0.17',

  // 说明信息
  info: {
    name: 'fg-login',
    description: 'sm登录组件 - 纯方法版本 (Vue2兼容)',
    components: false, // 此版本不包含Vue组件
    compatibility: ['Vue2', 'CommonJS', 'UMD']
  }
}

// 动态导入方法（避免循环依赖）
try {
  const { GoogleNativeLogin } = require('./common/googleNativeLogin.js')
  smLoginMethods.GoogleNativeLogin = GoogleNativeLogin
} catch (e) {
  console.warn('GoogleNativeLogin not available in this environment')
}

try {
  const utils = require('./common/utils.js')
  smLoginMethods.utils = utils
} catch (e) {
  console.warn('Utils not available in this environment')
}

export default smLoginMethods
