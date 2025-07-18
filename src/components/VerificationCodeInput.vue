<template>
  <div class="verification-code-input">
    <div
      class="input-container"
      :class="[{ error: errorMessage }, { 'is-value': code }]"
    >
      <img src="/images/global/code.svg" alt="icon-code" />
      <input
        type="text"
        v-model="code"
        :placeholder="placeholder"
        @input="handleInput"
      />
      <div
        class="send-code"
        @click="handleSendCode"
        :class="{ disabled: countdown > 0 }"
      >
        {{ countdown > 0 ? `${countdown}s` : sendText }}
      </div>
    </div>
    <div class="sm-verification-code__error" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter Verification Code'
  },
  errorMessage: {
    type: String,
    default: ''
  },
  shouldStartCountdown: {
    type: Boolean,
    default: false
  },
  sendText: {
    type: String,
    default: 'Send'
  }
});

const emit = defineEmits(['update:modelValue', 'send-code']);

const code = ref(props.modelValue);
const countdown = ref('');
const errorMessage = ref('');
// 处理输入
const handleInput = () => {
  // 输入时清除错误状态
  if (errorMessage.value) {
    errorMessage.value = '';
  }
  emit('update:modelValue', code.value);
};

// 发送验证码
const handleSendCode = () => {
  emit('send-code');
};

// 监听 shouldStartCountdown 变化
watch(
  () => props.shouldStartCountdown,
  (newVal) => {
    if (newVal) {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  }
);

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    code.value = newVal;
  }
);

// 监听错误状态
watch(
  () => props.errorMessage,
  (newVal) => {
    if (newVal) {
      errorMessage.value = newVal;
    }
  }
);
</script>
