<script setup>
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const { user, initializeUser, isAuthenticated } = useAuthentication()
initializeUser()
const updated = ref(false)
const submitted = ref(false)
const submissionError = ref(false)
const loading = ref(false)
const recipient = ref()
const notes = ref("")
let collectingParcel = ref(false)
const { data: residents } = await useFetch('/api/residents', {
  query: {
    email: user.value.email,
    inclusive: false
  }
})

const resident = ref(await getResidentData())
async function getResidentData() {
  const { data: res } = await useFetch('/api/residents', {
    query: {
      email: user.value.email,
      inclusive: true
    }
  })
  if (!res) {
    res = {
      surname: "",
      email: "",
      hausnummer: "",
      floor: "",
      klingel: ""
    }
  }
  return res
}

let myParcels = ref(await getParcelData())

async function getParcelData() {
  let { data: parcels } = await useFetch('/api/parcels', {
    query: {
      email: user.value.email,
      is_collected_yet: false
    }
  })
  if (parcels.value && parcels.value.length > 0) {
    for (let parcel of parcels.value) {
      const holder = residents.value.find((resident) => resident.email = parcel.current_holder)
      parcel.current_holder = holder
    }
  }
  return parcels.value
}

async function updateParcelData() {
  let parcels = await $fetch('/api/parcels', {
    query: {
      email: user.value.email,
      is_collected_yet: false
    }
  })
  if (parcels && parcels.length > 0) {
    for (let parcel of parcels) {
      const holder = residents.value.find((resident) => resident.email = parcel.current_holder)
      parcel.current_holder = holder
    }
  }
  return parcels
}

async function submitParcel() {
  loading.value = true
  const result = await $fetch('/api/parcels', {
    method: 'POST',
    body: {
      id: uuidv4(),
      intended_recipient: recipient.value,
      current_holder: user.value.email,
      is_collected_yet: 'false',
      notes: notes.value
    }
  })
  if (result === true) {
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
    }, "3000");
  } else {
    submissionError.value = true
  }
  loading.value = false
}

async function updateResident() {
  let result = {}
  if (resident.value.email) {
    // console.log('Patching', resident.value)
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

async function parcelCollected(id) {
  // console.log('sending', id)
  collectingParcel.value = true
  const result = await $fetch('/api/parcels', {
    method: 'PATCH',
    body: {
      id: id,
      is_collected_yet: 'true'
    }
  })
  // console.log('sent', result)
  myParcels.value = await updateParcelData()
  // console.log('myParcels', myParcels.value)
  collectingParcel.value = false
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="8">
        <p class="text-h5 py-4">{{ $t('YOUR_PARCELS') }}</p>
        <v-card v-if="myParcels && myParcels.length > 0">
          <!-- {{ myParcels }} -->
          <v-list>
            <v-list-item :key="parcel.id" v-for="parcel in myParcels" lines="three" v-if="parcel.current_holder">
              <template #prepend>
                <v-avatar><v-icon>mdi-package-variant-closed</v-icon></v-avatar>
              </template>
              <template #append><v-btn variant="tonal" @click="parcelCollected(parcel.id)"
                  :loading="collectingParcel">{{ $t('GOT_IT') }}</v-btn>
              </template>
              <v-list-item-title class="text-body-1" v-if="parcel.current_holder.surname">
                {{ parcel.current_holder.surname }}
              </v-list-item-title>
              <v-list-item-title>
                {{ parcel.current_holder.hausnummer }}, {{ parcel.current_holder.klingel }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="parcel.notes">{{ parcel.notes }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ dayjs(parcel.date_created).fromNow() }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card v-else><v-empty-state headline="Sorry!" :title="$t('NO_PARCELS_FOR_YOU.heading')"
            :text="$t('NO_PARCELS_FOR_YOU.subheading')" /></v-card>
        <div class="text-h5 pt-4 pb-2">{{ $t('GOT_A_PARCEL') }}</div>
        <p class="pb-4">{{ $t('GOT_A_PARCEL_PARA') }}</p>

        <v-card class="pa-4">
          <v-row class="px-4 pt-4">
            <v-autocomplete variant="outlined" :items="residents" item-title="surname" item-value="email"
              :label="$t('FIND_A_NEIGHBOUR')" v-model="recipient" />
          </v-row>
          <v-row class="px-4 pt-4">
            <v-textarea variant="outlined" v-model="notes" :label="$t('PARCEL_NOTES')" />
          </v-row>
          <v-row class="px-4 pb-4">
            <v-spacer />
            <v-btn color="primary" label="Submit" text="Submit" @click="submitParcel()" :loading="loading" />
          </v-row>
          <v-row class="pa-2">
            <v-alert v-if="submitted" icon="mdi-check-circle" color="success">{{ $t('PARCEL_SUBMITTED_THANK_YOU')
              }}</v-alert>
            <v-alert v-if="submissionError" icon="mdi-alert-circle" color="error">{{
              $t('PARCEL_SUBMISSION_ERROR') }}</v-alert>

          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="2"></v-col>
    </v-row>
    <ProfilePanel />
    <WelcomeDialog />
  </v-container>


</template>