<template>
  <div
    :class="['sm-oauth-button', `sm-oauth-button--${provider}`]"
    @click="handleClick"
  >
    <img :src="iconSrc" :alt="provider" />
    <slot>{{ providerName }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  _signUpWithGoogle,
  _signUpWithFacebook,
  _signUpWithTwitter,
  _signUpWithMicrosoft,
  _signUpWithApple,
  getFirebaseConfig
} from '../assets/tools/firebase';

const props = defineProps({
  provider: {
    type: String,
    required: true,
    validator: (value) =>
      ['google', 'facebook', 'twitter', 'microsoft', 'apple'].includes(value)
  }
});

const emit = defineEmits(['login-complete']);

const iconSrc = computed(() => {
  const icons = {
    google: '/images/global/icon-google.webp',
    facebook: '/images/global/icon-facebook.webp',
    twitter: '/images/global/icon-twitter.webp',
    microsoft: '/images/global/icon-microsoft.webp',
    apple: '/images/global/icon-apple.svg'
  };
  return icons[props.provider];
});

const providerName = computed(() => {
  const names = {
    google: 'Google',
    facebook: 'Facebook',
    twitter: 'Twitter',
    microsoft: 'Microsoft',
    apple: 'Apple'
  };
  return names[props.provider];
});

const handleClick = async () => {
  try {
    // 先检查配置是否正确
    const config = getFirebaseConfig();
    // console.log('[OAuthButton] Current config before login:', config);

    let result;
    switch (props.provider) {
      case 'google':
        result = await _signUpWithGoogle();
        break;
      case 'facebook':
        result = await _signUpWithFacebook();
        break;
      case 'twitter':
        result = await _signUpWithTwitter();
        break;
      case 'microsoft':
        result = await _signUpWithMicrosoft();
        break;
      case 'apple':
        result = await _signUpWithApple();
        break;
    }

    emit('login-complete', { success: true, data: result });
  } catch (error) {
    console.error('Login error:', error);
    emit('login-complete', { success: false, error: error });
  }
};
</script>
