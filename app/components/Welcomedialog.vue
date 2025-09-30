<template>
  <v-dialog v-model="showWelcomeDialog">
    <v-card class="mx-auto" width="500">
      <v-card-title class="text-h4 text-center">{{ $t('WELCOME') }}!</v-card-title>
      <v-card-text>
        <p>Let's set up your account.</p>
        <v-form class="pa-4">
          <v-text-field variant="outlined" v-model="resident.surname" label="Name"></v-text-field>
          <v-text-field variant="outlined" v-model="resident.hausnummer" label="Hausnummer"></v-text-field>
          <v-text-field variant="outlined" v-model="resident.floor" label="Etage"></v-text-field>
          <v-text-field variant="outlined" v-model="resident.klingel" label="Klingel"></v-text-field>
          <v-btn @click="updateResident" color="primary">{{ $t('UPDATE') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

import { v4 as uuidv4 } from 'uuid'
import { useAuthentication } from '#imports'
const { user, initializeUser, isAuthenticated } = useAuthentication()
const updated = ref(false)
onMounted(() => {
  initializeUser()
})

const resident = ref(await getResidentData())

async function getResidentData() {
  if (isAuthenticated.value) {
    let { data: res } = await useFetch('/api/residents', {
      query: {
        email: user.value.email,
        inclusive: true
      }
    })
    console.log('Resident', res)
    if (!res.value) {
      res.value = {
        surname: user.value.name,
        email: "",
        hausnummer: "",
        floor: "",
        klingel: ""
      }
    }
    return res.value
  }

}

async function updateResident() {
  let result = {}
  if (resident.value.email) {
    result = await $fetch('/api/residents', {
      method: 'PATCH',
      body: {
        surname: resident.value.surname,
        email: user.value.email,
        hausnummer: resident.value.hausnummer,
        floor: resident.value.floor,
        klingel: resident.value.klingel
      }
    })
  } else {
    result = await $fetch('/api/residents', {
      method: 'POST',
      body: {
        id: uuidv4(),
        surname: resident.value.surname,
        email: user.value.email,
        hausnummer: resident.value.hausnummer,
        floor: resident.value.floor,
        klingel: resident.value.klingel
      }
    })
  }
  resident.value = result
}

</script>

<style></style>