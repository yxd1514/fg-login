// 导入所有组件
import {
  OAuthButton,
  ThirdPartyLoginModal,
  EmailInput,
  VerificationCodeInput
} from './components';

// 导入Firebase工具
import {
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
} from './assets/tools/firebase';

// 导入Google原生登录功能
import {
  initGoogleNativeLogin,
  setGoogleConfig,
  getGoogleConfig,
  googleNativeLogin
} from './common/googleNativeLogin';

// 导入样式
import './theme/index.scss';

// 主组件
export const Login = ThirdPartyLoginModal;

// 导出所有单独组件
export {
  OAuthButton,
  ThirdPartyLoginModal,
  EmailInput,
  VerificationCodeInput,
  // Firebase工具
  setFirebaseConfig,
  getFirebaseConfig,
  // Google原生登录功能
  initGoogleNativeLogin,
  setGoogleConfig,
  getGoogleConfig,
  googleNativeLogin
};

// 使用别名导出Firebase认证方法
export const signInWithGoogle = _signUpWithGoogle;
export const signInWithFacebook = _signUpWithFacebook;
export const signInWithTwitter = _signUpWithTwitter;
export const signInWithMicrosoft = _signUpWithMicrosoft;
export const signInWithApple = _signUpWithApple;
export const signOut = _signOut;
export const sendPasswordResetEmail = _sendPasswordResetEmail;
export const sendEmailVerification = _sendEmailVerification;
export const verifyEmail = _verifyEmail;
export const resetPassword = _resetPassword;

// 默认导出主组件
export default ThirdPartyLoginModal;

// 如果有其他需要导出的方法，也可以在这里添加
