<script setup lang="ts">

interface LogoutLinkProps {
  redirectTo?: string
  linkText?: string
  confirmMessage?: string
  class?: string
  style?: string | Record<string, string | number>
  linkClass?: string
  linkStyle?: string | Record<string, string | number>
  errorClass?: string
  errorStyle?: string | Record<string, string | number>
  containerClass?: string
  containerStyle?: string | Record<string, string | number>
}

interface Emits {
  (e: 'success' | 'click'): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<LogoutLinkProps>(), {
  redirectTo: '/login',
  linkText: 'Logout',
  confirmMessage: 'Are you sure you want to logout?'
})

const emit = defineEmits<Emits>()

let profile = useProfile()

// Initialize the composable state as null initially
let authComposable: ReturnType<typeof useAuthentication> | null = null
const isLoading = ref(false)
const error = ref('')

onMounted(() => {
  // Initialize the composable only after the component is mounted
  authComposable = useAuthentication()
})

const handleLogout = async (event: Event) => {
  event.preventDefault()

  if (!confirm(props.confirmMessage)) {
    return
  }

  if (!authComposable) {
    error.value = 'Authentication not initialized'
    return
  }

  isLoading.value = true
  error.value = ''
  profile.value = false

  try {
    emit('click')
    await authComposable.logout()
    emit('success')

    // Redirect if specified
    if (props.redirectTo) {
      await navigateTo(props.redirectTo)
    }
  }
  catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Logout failed'
    error.value = errorMessage
    emit('error', errorMessage)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="px-2">
    <!-- <div class="px-2" :class="['n-users-logout-container', props.containerClass]" :style="props.containerStyle"> -->
    <div v-if="error" :class="['n-users-error-message', props.errorClass]" :style="props.errorStyle">
      {{ error }}
    </div>
    <v-divider thickness="2"></v-divider>
    <v-btn block class="px-2 py-4" variant="tonal" :disabled="isLoading" @click="handleLogout">
      <span v-if="isLoading">Signing out...</span>
      <span v-else>{{ $t('SIGN_OUT') }}</span>
    </v-btn>
  </div>
</template>