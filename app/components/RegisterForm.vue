<script setup>
import { ref, computed, watch } from "vue";
import { navigateTo } from "#app";
import { useRuntimeConfig } from "#imports";
import { validatePassword } from "nuxt-users/utils";
const { public: { nuxtUsers } } = useRuntimeConfig();
const { passwordValidation } = nuxtUsers;
const props = defineProps({
  apiEndpoint: { type: String, required: false },
  redirectTo: { type: String, required: false },
  loginLink: { type: String, required: false }
});
const emit = defineEmits(["success", "error", "submit"]);
const apiEndpoint = computed(() => props.apiEndpoint || `${nuxtUsers?.apiBasePath}/register`);
const isLoading = ref(false);
const error = ref("");
const successMessage = ref("");
const passwordValidationResult = ref(null);
const formData = ref({
  email: "",
  name: "",
  password: "",
  confirmPassword: ""
});
watch(() => formData.value.password, (newPassword) => {
  if (newPassword) {
    passwordValidationResult.value = validatePassword(newPassword, passwordValidation);
  } else {
    passwordValidationResult.value = null;
  }
}, { immediate: true });
const passwordsMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword || !formData.value.confirmPassword;
});
const isFormValid = computed(() => {
  return formData.value.email && formData.value.name && formData.value.password && formData.value.confirmPassword && passwordsMatch.value && (passwordValidationResult.value?.isValid ?? false);
});
const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = "Please fill all fields correctly";
    return;
  }
  isLoading.value = true;
  error.value = "";
  successMessage.value = "";
  try {
    emit("submit", formData.value);
    const response = await $fetch(apiEndpoint.value, {
      method: "POST",
      body: {
        email: formData.value.email,
        name: formData.value.name,
        password: formData.value.password
      }
    });
    successMessage.value = response.message;
    emit("success", response);
    formData.value = {
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
    };
    if (props.redirectTo) {
      setTimeout(() => {
        navigateTo(props.redirectTo);
      }, 3e3);
    }
  } catch (err) {
    const errorMessage = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "statusMessage" in err.data ? String(err.data.statusMessage) : err instanceof Error ? err.message : "Registration failed";
    error.value = errorMessage;
    emit("error", errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <!-- <section class="n-users-register-section n-users-section"> -->
  <div class="px-4 py-8">
    <v-form>
      <!-- Name field -->
      <slot name="name-field">
        <!-- <div class="n-users-form-group"> -->
        <!-- <label for="name">Full Name</label> -->
        <v-text-field variant="outlined" id="name" v-model="formData.name" type="text" name="name"
          :label="$t('YOUR_FULL_NAME')" required />
        <!-- </div> -->
      </slot>

      <!-- Email field -->
      <slot name="email-field">
        <!-- <div class="n-users-form-group"> -->
        <!-- <label for="email">Email</label> -->
        <v-text-field variant="outlined" id="email" v-model="formData.email" type="email" name="email"
          :label="$t('YOUR_EMAIL_ADDRESS')" required />
        <!-- </div> -->
      </slot>

      <!-- Password field -->
      <slot name="password-field">
        <!-- <div class="n-users-form-group"> -->
        <!-- <label for="password">Password</label> -->
        <v-text-field variant="outlined" id="password" v-model="formData.password" type="password" name="password"
          :label="$t('YOUR_PASSWORD')" required :minlength="passwordValidation.minLength" />
        <!-- </div> -->
      </slot>

      <!-- Password strength indicator -->
      <slot name="password-strength">
        <NUsersPasswordStrengthIndicator v-if="formData.password" :password="formData.password"
          :validation-result="passwordValidationResult" :show-hints="true" :show-rules="true" />
      </slot>

      <!-- Confirm Password field -->
      <slot name="confirm-password-field">
        <!-- <div class="n-users-form-group"> -->
        <!-- <label for="confirmPassword">Confirm Password</label> -->
        <v-text-field variant="outlined" id="confirmPassword" v-model="formData.confirmPassword" type="password"
          name="confirmPassword" :label="$t('CONFIRM_PASSWORD')" required
          :class="{ 'n-users-input-error': !passwordsMatch }" />
        <small v-if="!passwordsMatch && formData.confirmPassword" class="n-users-error-text">
          Passwords do not match
        </small>
        <!-- </div> -->
      </slot>

      <!-- Submit button slot -->
      <slot name="submit-button">
        <v-btn color="primary" :disabled="isLoading || !isFormValid" @click="handleSubmit">
          <span v-if="isLoading" class="n-users-loading-spinner" />
          {{ isLoading ? $t('SIGNING_IN') : $t('SIGN_UP') }}
        </v-btn>
      </slot>

      <!-- Footer slot -->
      <!-- <slot name="footer">
        <div class="n-users-register-footer">
          <p class="n-users-login-link">
            Already have an account?
            <a :href="loginLink || '/login'" class="n-users-link">
              Sign in here
            </a>
          </p>
        </div>
      </slot> -->

      <!-- Success message slot -->
      <slot name="success-message" :message="successMessage">
        <div v-if="successMessage" class="n-users-success-message">
          {{ successMessage }}
        </div>
      </slot>

      <!-- Error message slot -->
      <slot name="error-message" :error="error">
        <div v-if="error" class="n-users-error-message">
          {{ error }}
        </div>
      </slot>
    </v-form>
  </div>
</template>
