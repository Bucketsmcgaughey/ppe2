<script setup>
import { ref, computed } from "vue";
import { navigateTo } from "#app";
import { useRuntimeConfig } from "#imports";
const { public: { nuxtUsers } } = useRuntimeConfig();
const { passwordValidation } = nuxtUsers;
const props = defineProps({
  apiEndpoint: { type: String, required: false },
  forgotPasswordEndpoint: { type: String, required: false },
  redirectTo: { type: String, required: false }
});
const emit = defineEmits(["success", "error", "forgot-password-error", "submit", "forgot-password-success"]);
const apiEndpoint = computed(() => props.apiEndpoint || `${nuxtUsers?.apiBasePath}/session`);
const forgotPasswordEndpoint = computed(() => props.forgotPasswordEndpoint || `${nuxtUsers?.apiBasePath}/password/forgot`);
const isLoading = ref(false);
const isForgotPasswordLoading = ref(false);
const error = ref("");
const forgotPasswordMessage = ref("");
const formData = ref({
  email: "",
  password: "",
  rememberMe: false
});
const handleSubmit = async () => {
  isLoading.value = true;
  error.value = "";
  try {
    emit("submit", formData.value);
    const response = await $fetch(apiEndpoint.value, {
      method: "POST",
      body: {
        email: formData.value.email,
        password: formData.value.password,
        rememberMe: formData.value.rememberMe
      }
    });
    emit("success", response.user, formData.value.rememberMe ?? false);
    if (props.redirectTo) {
      await navigateTo(props.redirectTo);
    }
  } catch (err) {
    const errorMessage = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "statusMessage" in err.data ? String(err.data.statusMessage) : err instanceof Error ? err.message : "Login failed";
    error.value = errorMessage;
    emit("error", errorMessage);
  } finally {
    isLoading.value = false;
  }
};
const handleForgotPassword = async () => {
  if (!formData.value.email) {
    error.value = "Please enter your email address first";
    return;
  }
  isForgotPasswordLoading.value = true;
  forgotPasswordMessage.value = "";
  error.value = "";
  try {
    const response = await $fetch(forgotPasswordEndpoint.value, {
      method: "POST",
      body: {
        email: formData.value.email
      }
    });
    forgotPasswordMessage.value = response.message;
    emit("forgot-password-success");
  } catch (err) {
    const errorMessage = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "statusMessage" in err.data ? String(err.data.statusMessage) : err instanceof Error ? err.message : "Failed to send password reset email";
    error.value = errorMessage;
    emit("forgot-password-error", errorMessage);
  } finally {
    isForgotPasswordLoading.value = false;
  }
};
</script>

<template>
  <div class="px-4 py-8">
    <v-form>
      <!-- Email field -->
      <slot name="email-field">
        <v-text-field id="email" v-model="formData.email" variant="outlined" type="email" name="email"
          :label="$t('YOUR_EMAIL_ADDRESS')" required />
      </slot>

      <!-- Password field -->
      <slot name="password-field">
        <v-text-field id="password" variant="outlined" v-model="formData.password" type="password" name="password"
          :label="$t('YOUR_PASSWORD')" required :minlength="passwordValidation.minLength" />
      </slot>

      <!-- Remember me slot -->
      <slot name="remember-me">
        <v-checkbox id="rememberMe" v-model="formData.rememberMe" type="checkbox" name="rememberMe"
          :label="$t('REMEMBER_ME')" />
      </slot>

      <!-- Submit button slot -->
      <slot name="submit-button">
        <v-btn type="submit" :disabled="isLoading" color="primary" style="border:none" @click="handleSubmit">
          <span v-if="isLoading" />
          {{ isLoading ? $t('SIGNING_IN') : $t('SIGN_IN') }}
        </v-btn>
      </slot>

      <!-- Footer slot -->
      <slot name="footer">
        <div class="n-users-login-footer">
          <p class="n-users-forgot-password">
            <a href="#" class="n-users-forgot-link" :class="{ loading: isForgotPasswordLoading }"
              @click.prevent="handleForgotPassword">
              <span v-if="isForgotPasswordLoading" class="n-users-loading-spinner" />
              {{ isForgotPasswordLoading ? "Sending..." : $t('FORGOT_YOUR_PASSWORD') }}
            </a>
          </p>
        </div>
      </slot>

      <!-- Success message slot -->
      <slot name="success-message" :message="forgotPasswordMessage">
        <div v-if="forgotPasswordMessage" class="n-users-success-message">
          {{ forgotPasswordMessage }}
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
