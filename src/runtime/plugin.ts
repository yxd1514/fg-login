import { defineNuxtPlugin } from '#app';
import { setFirebaseConfig } from '../assets/tools/firebase';

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config.public.smLogin;

  // 如果配置了 Firebase，则设置 Firebase 配置
  if (config && config.firebase) {
    setFirebaseConfig(config.firebase);
  }

  return {
    provide: {
      smLogin: {
        // 这里可以提供一些方法或属性
      }
    }
  };
});
