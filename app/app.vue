<script setup>
import { useAuthentication } from '#imports'

const { user, initializeUser, isAuthenticated } = useAuthentication()
const { locales, setLocale, localeProperties } = useI18n()
const profile = useProfile()
// Initialize user from stored session on app start
onMounted(() => {
  initializeUser()
})

</script>

<template>
  <v-app>
    <v-app-bar color="primary" class="px-2">
      <div class="text-h6 pl-2">
        <v-icon icon="mdi-looks" class="pr-4" />Prenzlbogen Pakete
      </div>
      <v-spacer />
      <v-btn v-for="locale in locales" density="compact" @click="setLocale(locale.code)"
        :variant="locale.code === localeProperties.code ? 'outlined' : 'plain'">
        {{ locale.code.toUpperCase() }}
      </v-btn>
      <v-btn flat v-if="isAuthenticated" @click="profile = true"><v-icon>mdi-account</v-icon></v-btn>
    </v-app-bar>
    <ProfilePanel />
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style>
body {
  font-family: 'Arsenal';
}

.v-main {
  background-color: #eee;
}
</style>