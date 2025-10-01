<template>
  <v-dialog v-model="profile" v-if="resident">
    <v-card class="mx-auto" :min-width="smAndUp ? '500px' : '100%'" :max-width="smAndUp ? '500px' : '100%'">
      <v-toolbar>
        <div class="text-h5 pa-4">{{ $t('YOUR_DETAILS') }}</div><v-spacer />
        <v-btn @click="profile = false"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
      </v-toolbar>
      <v-form class="pa-4">
        <v-text-field variant="outlined" v-model="resident.surname" label="Name"></v-text-field>
        <v-text-field variant="outlined" v-model="resident.hausnummer" label="Hausnummer"></v-text-field>
        <v-text-field variant="outlined" v-model="resident.floor" label="Etage"></v-text-field>
        <v-text-field variant="outlined" v-model="resident.klingel" label="Klingel"></v-text-field>
        <v-btn block @click="updateResident" color="primary" :loading="loading">{{ $t('UPDATE') }}</v-btn>
      </v-form>
      <v-fab-transition>
        <v-alert v-if="updated" icon="mdi-alert-circle" color="success" class="mx-4">
          {{ $t('UPDATE_SUCCESSFUL') }}
        </v-alert>
      </v-fab-transition>
      <div class="pa-2">
        <LogoutLink />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { useDisplay } from 'vuetify'

// import { useAuthentication } from '#imports'
const { user, initializeUser, isAuthenticated } = useAuthentication()
const profile = useProfile()
const resident = ref(null)
const { smAndUp, mobile } = useDisplay()
const updated = ref(false)
const loading = ref(false)
// const props = defineProps({
//   welcome: Boolean
// })
onMounted(() => {
  initializeUser()
})

resident.value = await getResidentData()

async function getResidentData() {
  if (isAuthenticated.value) {
    let res = await $fetch('/api/residents', {
      query: {
        email: user.value.email,
        inclusive: true
      }
    })
    if (!res) {
      res = {
        surname: user.value.name,
        email: "",
        hausnummer: "",
        floor: "",
        klingel: ""
      }
    }
    return res
  }

}

async function updateResident() {
  loading.value = true
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
  updated.value = true
  loading.value = false
  setTimeout(() => {
    updated.value = false
  }, "3000");
}

</script>

<style>
.v-overlay {
  --v-overlay-opacity: 0.6;
  backdrop-filter: blur(4px);

}
</style>