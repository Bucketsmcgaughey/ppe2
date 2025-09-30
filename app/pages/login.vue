<template>
  <v-container fill-height>
    <v-img cover src="/images/bogen.jpg">
      <v-container fill-height>
        <v-row class="align-items: center">
          <v-col>
            <v-card class="mx-auto pa-4 blurred-background" max-width="500">
              <div class="dark-header py-4">
                <h2>{{ $t('WELCOME') }}</h2>
              </div>
              <v-tabs v-model="tab" align-tabs="center" fixed-tabs>
                <v-tab value="signin" :text="$t('SIGN_IN')" />
                <v-tab value="signup" :text="$t('SIGN_UP')" />
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="signin">
                  <LoginForm @success="handleLoginSuccess" />
                </v-tabs-window-item>
                <v-tabs-window-item value="signup">
                  <p class="pa-4">{{ $t('SIGN_UP_BENEFITS') }}</p>
                  <RegisterForm />
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-img>
  </v-container>
</template>

<script setup>
import { useAuthentication } from '#imports'

const { login } = useAuthentication()
const isLoading = ref(false)
let profile = useProfile()
console.log('profile', profile)
profile.value = false


const email = ref("")
const password = ref("")
const surname = ref("")

const tab = ref("signin")
const tabs = [
  {
    text: "$t('SIGN_IN')",
    value: "signin"
  },
  {
    text: "$t('SIGN_UP')",
    value: "signup"
  }
]

const handleLoginSuccess = (user) => {
  login(user)
  // Redirect to dashboard or home page
  navigateTo('/dashboard')
}

async function createNewUser() {
  const newUser = await createUser({
    email: email.value,
    name: surname.value,
    password: 'password.value',
    role: 'user',
    active: true
  })
  console.log('New user', newUser)
}


</script>

<style>
.blurred-background {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);

}
</style>