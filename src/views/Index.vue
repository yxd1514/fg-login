<script setup>
import { ref } from 'vue';
import OAuthButton from '@/components/OAuthButton.vue';
import EmailInput from '@/components/EmailInput.vue';
import VerificationCodeInput from '@/components/VerificationCodeInput.vue';
import ThirdPartyLoginModal from '@/components/ThirdPartyLoginModal.vue';
import { _signOut } from '@/assets/tools/firebase';
const placeholder = ref('Enter your email1111');
const errorMessage = ref('Please enter 44444444a valid email address');

const codeInput = ref(null);
const code = ref('');

const handleSendCode = () => {
  console.log('send code');
  errorMessage.value = 'Invalid verification code';
};

const validate = () => {
  if (!code.value) {
    errorMessage.value = 'Please enter verification code';
    return false;
  }
  return true;
};

const handleEmailSubmit = (email) => {
  console.log('email', email);
};

const handleCodeSend = () => {
  console.log('code send');
};

const handleGetStarted = () => {
  console.log('get started');
};

const handleOAuthSuccess = (result) => {
  console.log('oauth success', result);
};

const handleOAuthError = (error) => {
  console.log('oauth error', error);
};

const handleLogout = () => {
  console.log('logout');
  _signOut();
};
</script>

<template>
  <!-- <Login /> -->
  <OAuthButton provider="google" />
  <OAuthButton provider="facebook" />
  <OAuthButton provider="apple" />
  <EmailInput :placeholder="placeholder" :errorMessage="errorMessage" />
  <VerificationCodeInput
    v-model="code"
    :error="errorMessage"
    @send-code="handleSendCode"
    ref="codeInput"
  />
  <ThirdPartyLoginModal
    title="Login to your account"
    :providers="['google', 'facebook', 'microsoft', 'apple']"
    :show-email-login="true"
    :show-verification-code="true"
    email-placeholder="Enter your email"
    submit-button-text="Get Started"
    :theme="{
      primaryColor: '#000',
      secondaryColor: '#333',
      buttonRadius: '4px',
      fontFamily: 'Poppins'
    }"
    @email-submit="handleEmailSubmit"
    @code-send="handleCodeSend"
    @get-started="handleGetStarted"
    @oauth-success="handleOAuthSuccess"
    @oauth-error="handleOAuthError"
  />

  <div @click="handleLogout">登出</div>
</template>

<style lang="scss">
@media (min-width: 980px) {
}

@media (max-width: 980px) {
}
</style>
