<template>
  <div>Hello {{ user.name }}</div>
  <v-container>
    <v-row v-for="parcel in parcels" :key="parcel.id">
      <v-card class="pa-4 my-4">
        {{ parcel.current_holder }} has had a parcel for you since {{ parcel.date_created }}.
      </v-card>
    </v-row>
    <v-row>
      <v-card class="pa-4">
        <div class="text-h4">Got a parcel for someone?</div>
        <!-- <v-form> -->
        <v-autocomplete :items="users.users" item-title="name" item-value="email" />
        <!-- </v-form> -->
      </v-card>
    </v-row>
    <v-navigation-drawer location="right" permanent>
      <v-form class="pa-2">
        <v-text-field v-model="userToEdit.name" placeholder="name"></v-text-field>
        <v-text-field v-model="userToEdit.email" placeholder="email"></v-text-field>
        <v-text-field v-model="userToEdit.hausnummer" placeholder="Hausnummer"></v-text-field>
        <v-text-field v-model="userToEdit.floor" placeholder="Etage"></v-text-field>
        <v-btn @click="updateUser">Update</v-btn>
      </v-form>
      <!-- <NUsersUserForm /> -->
    </v-navigation-drawer>
  </v-container>

  <NUsersLogoutLink>Sign out</NUsersLogoutLink>

</template>

<script setup>
// import { v4 as uuidv4 } from 'uuid'
import { useCloned } from '@vueuse/core'

// const { user, initializeUser } = useAuthentication()
// initializeUser()
const { data: parcels } = await useFetch('/api/parcels', {
  query: {
    email: user.value.email
  }
})

const userToEdit = useCloned(user)

console.log(parcels)

const { data: users } = await useFetch('/api/nuxt-users')

async function updateUser() {
  const result = await $fetch('/api/nuxt-users', {
    method: 'PATCH',
    body: userToEdit.value
  })
}

if (!user.value) {
  navigateTo('/login')
}
</script>