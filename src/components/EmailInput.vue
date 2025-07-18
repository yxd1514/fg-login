<template>
  <div class="sm-email-input">
    <div
      class="sm-email-input__field-wrapper"
      :class="[{ error: errorMessage }, { 'is-value': inputValue }]"
    >
      <img src="/images/global/email.svg" alt="icon-email" />
      <input
        type="email"
        :value="inputValue"
        @blur="handleInput"
        @focus="handleFocus"
        :placeholder="placeholder"
        class="sm-email-input__field"
        :class="{ error: errorMessage }"
        name="email"
        autocomplete="email"
      />
    </div>
    <div v-show="errorMessage" class="sm-email-input__error">
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
    default: 'Enter your email'
  },
  errorMessage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'validation']);

const inputValue = ref(props.modelValue);

const validateEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateAndEmit = (value) => {
  if (value && !validateEmail(value)) {
    emit('validation', false);
  } else {
    emit('validation', true);
  }
};

const handleFocus = () => {
  emit('validation', true);
};

const handleInput = (event) => {
  const value = event.target.value;
  inputValue.value = value;
  emit('update:modelValue', value);

  validateAndEmit(value);
};

// 同步外部值变化到内部状态
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue;
      validateAndEmit(newValue);
    }
  }
);
</script>
