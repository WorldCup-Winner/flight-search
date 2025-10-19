<template>
    <div class="max-w-6xl w-full">
        <TicketBookingCard :booking-response="bookingResponse" :bookingData="bookingData" />
        <PaymentMethodCard v-model:step="step" />
    </div>
</template>
<script setup>
const step = defineModel('step')

import TicketBookingCard from './TicketBookingCard.vue';
import PaymentMethodCard from './PaymentMethodCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useFlightSearchStore } from '@/stores/flightSearch';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const flightSearchStore = useFlightSearchStore()

const { bookingData } = storeToRefs(authStore)
const { bookingResponse } = storeToRefs(flightSearchStore)

window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>