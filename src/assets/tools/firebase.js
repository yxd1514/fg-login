// 模拟Firebase功能的对象
const mockFirebase = {
  // 模拟配置
  config: {
    apiKey: 'mock-api-key',
    authDomain: 'mock-project.firebaseapp.com',
    projectId: 'mock-project',
    storageBucket: 'mock-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef',
    measurementId: 'G-ABCDEF123'
  },

  // 模拟初始化函数
  initFirebase: () => {
    return {
      app: {},
      auth: {},
      googleProvider: {},
      facebookProvider: {},
      twitterProvider: {},
      appleProvider: {},
      microsoftProvider: {},
      signUpWithGoogle: () =>
        Promise.resolve({ user: { email: 'mock@google.com' } }),
      signUpWithFacebook: () =>
        Promise.resolve({ user: { email: 'mock@facebook.com' } }),
      signUpWithTwitter: () =>
        Promise.resolve({ user: { email: 'mock@twitter.com' } }),
      signUpWithApple: () =>
        Promise.resolve({ user: { email: 'mock@apple.com' } }),
      signUpWithMicrosoft: () =>
        Promise.resolve({ user: { email: 'mock@microsoft.com' } }),
      signOut: () => Promise.resolve(true),
      sendPasswordResetEmail: () => Promise.resolve(true),
      sendEmailVerification: () => Promise.resolve(true),
      verifyEmail: () => Promise.resolve({}),
      resetPassword: () => Promise.resolve('mock@email.com')
    };
  },

  // 模拟设置配置函数
  setFirebaseConfig: (config) => {
    if (config) {
      mockFirebase.config = { ...mockFirebase.config, ...config };
      if (typeof window !== 'undefined') {
        window.__FIREBASE_CONFIG__ = config;
      }
    }
    return mockFirebase.config;
  },

  // 模拟获取配置函数
  getFirebaseConfig: () => {
    return mockFirebase.config;
  }
};

// 存储全局用户配置
if (typeof window !== 'undefined' && !window.__FIREBASE_CONFIG__) {
  window.__FIREBASE_CONFIG__ = {};
}

// 存储默认配置
const defaultFirebaseConfig = {
  // apiKey: 'AIzaSyB9O669H-9T-9BGBISF3NZc5cZFaDazE-k',
  // authDomain: 'onerecovery-26c62.firebaseapp.com',
  // projectId: 'onerecovery-26c62',
  // storageBucket: 'onerecovery-26c62.appspot.com',
  // messagingSenderId: '998484746725',
  // appId: '1:998484746725:web:b8ff95717bd50844eb4f0c',
  // measurementId: 'G-PZ8S9C72B7'
};

// 存储当前配置
let userConfig = null;
let currentConfig = defaultFirebaseConfig;

// 在开发环境中使用mock，在生产环境中使用真实的Firebase
let firebase = mockFirebase; // 初始化为mock版本
let realFirebase = null; // 存储真实版本

// 只在需要时初始化默认实例
let defaultInstance = null;

// 如果是客户端环境，加载真实的Firebase模块
if (typeof window !== 'undefined') {
  // 尝试加载真实的Firebase模块
  try {
    // 动态导入真实的Firebase模块
    import('firebase/app')
      .then((firebaseApp) => {
        const { initializeApp, getApps, getApp } = firebaseApp;

        import('firebase/auth')
          .then((firebaseAuth) => {
            const {
              GoogleAuthProvider,
              applyActionCode,
              FacebookAuthProvider,
              TwitterAuthProvider,
              OAuthProvider,
              getAuth,
              sendEmailVerification,
              sendPasswordResetEmail,
              signInWithPopup,
              signOut,
              verifyPasswordResetCode
            } = firebaseAuth;

            // 检查是否已经设置了配置
            if (
              window.__FIREBASE_CONFIG__ &&
              Object.keys(window.__FIREBASE_CONFIG__).length > 0
            ) {
              userConfig = window.__FIREBASE_CONFIG__;
              currentConfig = userConfig;
            } else {
              console.log(
                '[Firebase] No user config found, Configure your firebase configuration'
              );
            }

            // 初始化 Firebase 的函数
            const realInitFirebase = () => {
              // console.log(
              //   '[Firebase] Initializing with config:',
              //   currentConfig
              // );
              let app;
              try {
                // 检查是否已经存在名为[DEFAULT]的Firebase应用
                try {
                  const apps = getApps();
                  if (apps.length > 0) {
                    // 应用已存在，获取现有应用
                    app = getApp();
                  } else {
                    // 检查配置是否完整
                    const requiredFields = [
                      'apiKey',
                      'authDomain',
                      'projectId'
                    ];
                    const missingFields = requiredFields.filter(
                      (field) => !currentConfig[field]
                    );

                    if (missingFields.length > 0) {
                      throw new Error(
                        `Missing required Firebase configuration fields: ${missingFields.join(
                          ', '
                        )}`
                      );
                    }

                    // 应用不存在，初始化新应用
                    app = initializeApp(currentConfig);
                  }
                } catch (error) {
                  // 如果无法获取apps，则直接初始化
                  if (
                    error.message.includes(
                      'Missing required Firebase configuration fields'
                    )
                  ) {
                    throw error;
                  }
                  app = initializeApp(currentConfig);
                }
              } catch (error) {
                // 处理"[DEFAULT]"应用程序已经存在的错误
                if (error.code === 'app/duplicate-app') {
                  // 尝试直接获取已存在的应用
                  try {
                    app = getApp();
                  } catch (innerError) {
                    throw error; // 如果还是失败，则抛出原始错误
                  }
                } else {
                  // 其他错误则直接抛出
                  throw error;
                }
              }

              const auth = getAuth(app);

              // 初始化各种认证提供者
              const googleProvider = new GoogleAuthProvider();
              const facebookProvider = new FacebookAuthProvider();
              const twitterProvider = new TwitterAuthProvider();
              const appleProvider = new OAuthProvider('apple.com');
              const microsoftProvider = new OAuthProvider('microsoft.com');

              facebookProvider.addScope('email');

              // 返回所有需要的对象和函数
              return {
                app,
                auth,
                googleProvider,
                facebookProvider,
                twitterProvider,
                appleProvider,
                microsoftProvider,
                signUpWithGoogle: () => {
                  return new Promise((resolve, reject) => {
                    signInWithPopup(auth, googleProvider)
                      .then((result) => {
                        resolve(result);
                      })
                      .catch((error) => {
                        const errorMessage = getErrorMessage(error.code);
                        // 添加更详细的错误信息
                        if (error.code === 'auth/unauthorized-domain') {
                          console.error(
                            '[Firebase] Domain authorization error:',
                            {
                              domain: window.location.hostname,
                              protocol: window.location.protocol,
                              fullUrl: window.location.href
                            }
                          );
                        }
                        reject({
                          code: error.code,
                          message: errorMessage,
                          originalError: error,
                          domain: window.location.hostname
                        });
                      });
                  });
                },
                signUpWithFacebook: () => {
                  return new Promise((resolve, reject) => {
                    signInWithPopup(auth, facebookProvider)
                      .then((result) => {
                        resolve(result);
                      })
                      .catch((error) => {
                        const errorMessage = getErrorMessage(error.code);
                        reject({
                          code: error.code,
                          message: errorMessage,
                          originalError: error
                        });
                      });
                  });
                },
                signUpWithTwitter: () => {
                  return new Promise((resolve, reject) => {
                    signInWithPopup(auth, twitterProvider)
                      .then((result) => {
                        resolve(result);
                      })
                      .catch((error) => {
                        const errorMessage = getErrorMessage(error.code);
                        reject({
                          code: error.code,
                          message: errorMessage,
                          originalError: error
                        });
                      });
                  });
                },
                signUpWithApple: () => {
                  return new Promise((resolve, reject) => {
                    signInWithPopup(auth, appleProvider)
                      .then((result) => {
                        resolve(result);
                      })
                      .catch((error) => {
                        const errorMessage = getErrorMessage(error.code);
                        reject({
                          code: error.code,
                          message: errorMessage,
                          originalError: error
                        });
                      });
                  });
                },
                signUpWithMicrosoft: () => {
                  return new Promise((resolve, reject) => {
                    signInWithPopup(auth, microsoftProvider)
                      .then((result) => {
                        resolve(result);
                      })
                      .catch((error) => {
                        const errorMessage = getErrorMessage(error.code);
                        reject({
                          code: error.code,
                          message: errorMessage,
                          originalError: error
                        });
                      });
                  });
                },
                signOut: () => {
                  return signOut(auth);
                },
                sendPasswordResetEmail: (email) => {
                  return sendPasswordResetEmail(auth, email);
                },
                sendEmailVerification: () => {
                  return sendEmailVerification(auth.currentUser);
                },
                verifyEmail: (actionCode) => {
                  return applyActionCode(auth, actionCode);
                },
                resetPassword: (actionCode) => {
                  return verifyPasswordResetCode(auth, actionCode);
                }
              };
            };

            // 设置 Firebase 配置的函数，供主项目调用
            const realSetFirebaseConfig = (config) => {
              if (config) {
                // 更新配置
                userConfig = config;
                currentConfig = config;

                // 更新全局配置
                if (typeof window !== 'undefined') {
                  window.__FIREBASE_CONFIG__ = config;
                }

                // 清除默认实例，下次调用会重新初始化
                defaultInstance = null;

                return config;
              }
              return currentConfig;
            };

            // 获取当前 Firebase 配置的函数
            const realGetFirebaseConfig = () => {
              return currentConfig;
            };

            // 创建真实的Firebase对象
            realFirebase = {
              initFirebase: realInitFirebase,
              setFirebaseConfig: realSetFirebaseConfig,
              getFirebaseConfig: realGetFirebaseConfig
            };

            // 替换全局Firebase对象
            firebase = realFirebase;
          })
          .catch((error) => {
            console.error('Error loading firebase/auth:', error);
          });
      })
      .catch((error) => {
        console.error('Error loading firebase/app:', error);
        // Fallback to mock if loading real Firebase fails on the client
        console.warn(
          '[Firebase] Client-side loading of firebase/app failed. `firebase` remains mockFirebase.'
        );
      });
  } catch (error) {
    console.error('Failed to import Firebase (sync):', error);
    // Fallback to mock if synchronous part of import fails
    console.warn(
      '[Firebase] Client-side import failed (sync). `firebase` remains mockFirebase.'
    );
  }
} else {
  // Server-side (vite-node, SSR, build) - use mockFirebase for both dev and prod
  // Not in dev mode AND on the server: use mockFirebase.
  // This ensures `firebase` is not null and server-side calls to exported functions use the mock.
  firebase = mockFirebase;
}

// 导出方法
export const initFirebase = () => {
  // 确保使用最新配置
  getFirebaseConfig();

  if (defaultInstance) {
    return defaultInstance;
  }

  defaultInstance = firebase.initFirebase();
  return defaultInstance;
};

export const setFirebaseConfig = (config) => {
  if (!config) {
    return currentConfig;
  }

  // 设置配置
  userConfig = config;
  currentConfig = config;

  // 设置全局配置
  if (typeof window !== 'undefined') {
    window.__FIREBASE_CONFIG__ = config;
  }

  // 清除默认实例
  defaultInstance = null;

  return currentConfig;
};

export const getFirebaseConfig = () => {
  // 如果当前配置为空，先检查全局配置
  if (!currentConfig || Object.keys(currentConfig).length === 0) {
    if (
      typeof window !== 'undefined' &&
      window.__FIREBASE_CONFIG__ &&
      Object.keys(window.__FIREBASE_CONFIG__).length > 0
    ) {
      currentConfig = window.__FIREBASE_CONFIG__;
    } else if (userConfig) {
      currentConfig = userConfig;
    } else {
      currentConfig = defaultFirebaseConfig;
    }
  }

  return currentConfig;
};

// 懒加载方式实现登录方法
export const _signUpWithGoogle = () => {
  // 确保使用最新配置
  getFirebaseConfig();
  if (!defaultInstance) {
    defaultInstance = firebase.initFirebase();
  }
  return defaultInstance.signUpWithGoogle();
};

export const _signUpWithFacebook = () => {
  // 确保使用最新配置
  getFirebaseConfig();
  if (!defaultInstance) {
    defaultInstance = firebase.initFirebase();
  }
  return defaultInstance.signUpWithFacebook();
};

export const _signUpWithTwitter = () => {
  // 确保使用最新配置
  getFirebaseConfig();
  if (!defaultInstance) {
    defaultInstance = firebase.initFirebase();
  }
  return defaultInstance.signUpWithTwitter();
};

export const _signUpWithApple = () => {
  // 确保使用最新配置
  getFirebaseConfig();
  if (!defaultInstance) {
    defaultInstance = firebase.initFirebase();
  }
  return defaultInstance.signUpWithApple();
};

export const _signUpWithMicrosoft = () => {
  // 确保使用最新配置
  getFirebaseConfig();
  if (!defaultInstance) {
    defaultInstance = firebase.initFirebase();
  }
  return defaultInstance.signUpWithMicrosoft();
};

export const _signOut = () => {
  if (!defaultInstance) defaultInstance = firebase.initFirebase();
  return defaultInstance.signOut();
};

export const _sendPasswordResetEmail = (email) => {
  if (!defaultInstance) defaultInstance = firebase.initFirebase();
  return defaultInstance.sendPasswordResetEmail(email);
};

export const _sendEmailVerification = () => {
  if (!defaultInstance) defaultInstance = firebase.initFirebase();
  return defaultInstance.sendEmailVerification();
};

export const _verifyEmail = (actionCode) => {
  if (!defaultInstance) defaultInstance = firebase.initFirebase();
  return defaultInstance.verifyEmail(actionCode);
};

export const _resetPassword = (actionCode) => {
  if (!defaultInstance) defaultInstance = firebase.initFirebase();
  return defaultInstance.resetPassword(actionCode);
};

// 错误消息映射
const errorMessages = {
  'auth/user-not-found': '用户不存在',
  'auth/wrong-password': '密码错误',
  'auth/email-already-in-use': '该邮箱已被使用',
  'auth/weak-password': '密码强度太弱',
  'auth/invalid-email': '邮箱格式不正确',
  'auth/operation-not-allowed': '操作不被允许',
  'auth/account-exists-with-different-credential': '该邮箱已被其他方式注册',
  'auth/popup-closed-by-user': '登录窗口被用户关闭',
  'auth/cancelled-popup-request': '登录请求被取消',
  'auth/popup-blocked': '登录窗口被浏览器阻止',
  'auth/network-request-failed': '网络请求失败',
  'auth/too-many-requests': '请求次数过多，请稍后再试',
  'auth/expired-action-code': '验证码已过期',
  'auth/invalid-action-code': '无效的验证码',
  'auth/user-disabled': '用户已被禁用',
  'auth/requires-recent-login': '需要重新登录',
  'auth/credential-already-in-use': '该凭证已被使用',
  'auth/email-already-in-use': '该邮箱已被使用',
  'auth/operation-not-allowed': '操作不被允许',
  'auth/popup-blocked': '登录窗口被浏览器阻止',
  'auth/popup-closed-by-user': '登录窗口被用户关闭',
  'auth/unauthorized-domain': '未授权的域名',
  'auth/invalid-verification-code': '无效的验证码',
  'auth/invalid-verification-id': '无效的验证ID',
  'auth/missing-verification-code': '缺少验证码',
  'auth/missing-verification-id': '缺少验证ID',
  'auth/quota-exceeded': '配额已超出',
  'auth/retry-limit-exceeded': '重试次数已超出',
  'auth/timeout': '操作超时',
  'auth/unsupported-persistence-type': '不支持的持久化类型',
  'auth/unsupported-tenant-operation': '不支持的租户操作',
  'auth/unsupported-user-operation': '不支持的用户操作',
  'auth/user-token-expired': '用户令牌已过期',
  'auth/web-storage-unsupported': '不支持的Web存储'
};

// 获取错误消息
const getErrorMessage = (errorCode) => {
  return errorMessages[errorCode] || '发生未知错误';
};

// 清理函数
export const cleanup = () => {
  defaultInstance = null;
  if (typeof window !== 'undefined') {
    window.__FIREBASE_CONFIG__ = null;
  }
};
