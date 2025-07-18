// fg-login 纯方法入口文件
// 此文件不包含任何Vue组件，只提供方法和工具函数

// 核心方法导出
export {
  GoogleNativeLogin,
  googleNativeLogin,
  initGoogleNativeLogin,
  setGoogleConfig,
  getGoogleConfig
} from './common/googleNativeLogin.js'

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

// 工具函数导出
export * from './common/utils.js'

// 默认导出对象
const smLogin = {
  version: '1.0.17',
  type: 'methods-only',
  components: false
}

export default smLogin
