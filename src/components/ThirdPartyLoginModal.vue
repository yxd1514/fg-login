<template>
  <div class="fg-login-modal" v-if="visible">
    <div class="fg-login-modal__overlay" @click="handleClose"></div>
    <div class="fg-login-modal__content">
      <div class="fg-login-modal__header">
        <h2 class="fg-login-modal__title">{{ title }}</h2>
        <button class="fg-login-modal__close" @click="handleClose">×</button>
      </div>

      <div class="fg-login-modal__body">
        <div v-if="showEmailLogin" class="fg-login-modal__email-section">
          <EmailInput
            v-model="email"
            :placeholder="emailPlaceholder"
            @validate="isEmailValid = $event"
          />

          <div v-if="showVerificationCode" class="fg-login-modal__verification">
            <VerificationCodeInput
              v-model="verificationCode"
              @validate="isCodeValid = $event"
            />
            <button
              class="fg-login-modal__send-code"
              :disabled="!isEmailValid || codeSent"
              @click="handleSendCode"
            >
              {{ codeSent ? 'Sent' : 'Send Code' }}
            </button>
          </div>

          <button
            class="fg-login-modal__submit"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            {{ submitButtonText }}
          </button>
        </div>

        <div v-if="showOAuthOptions" class="fg-login-modal__divider">
          <span>{{ showEmailLogin ? 'Or' : '' }}</span>
        </div>

        <div v-if="showOAuthOptions" class="fg-login-modal__oauth">
          <OAuthButton
            v-for="provider in providers"
            :key="provider"
            :provider="provider"
            @login-success="handleOAuthSuccess"
            @login-error="handleOAuthError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EmailInput from './EmailInput.vue'
import VerificationCodeInput from './VerificationCodeInput.vue'
import OAuthButton from './OAuthButton.vue'

// 样式在外部的theme/components/third-party-login-modal.scss文件中定义

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Login to your account'
  },
  providers: {
    type: Array,
    default: () => ['google', 'facebook']
  },
  showEmailLogin: {
    type: Boolean,
    default: true
  },
  showVerificationCode: {
    type: Boolean,
    default: true
  },
  emailPlaceholder: {
    type: String,
    default: 'Enter your email'
  },
  submitButtonText: {
    type: String,
    default: 'Get Started'
  }
})

const emit = defineEmits([
  'close',
  'email-submit',
  'code-send',
  'get-started',
  'oauth-success',
  'oauth-error'
])

const email = ref('')
const verificationCode = ref('')
const isEmailValid = ref(false)
const isCodeValid = ref(false)
const codeSent = ref(false)

const showOAuthOptions = computed(
  () => props.providers && props.providers.length > 0
)

const canSubmit = computed(() => {
  if (props.showVerificationCode) {
    return isEmailValid.value && isCodeValid.value
  }
  return isEmailValid.value
})

const handleClose = () => {
  emit('close')
}

const handleSendCode = () => {
  codeSent.value = true
  emit('code-send', email.value)
}

const handleSubmit = () => {
  if (props.showVerificationCode) {
    emit('get-started', {
      email: email.value,
      verificationCode: verificationCode.value
    })
  } else {
    emit('email-submit', email.value)
  }
}

const handleOAuthSuccess = (result) => {
  emit('oauth-success', result)
}

const handleOAuthError = (error) => {
  emit('oauth-error', error)
}
</script>
