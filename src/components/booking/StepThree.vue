<template>
    <div class="max-w-6xl w-full">
        <TicketBookingCard />
        <PaymentMethodCard v-model:step="step" />
    </div>
</template>
<script setup>
const step = defineModel('step')

import TicketBookingCard from './TicketBookingCard.vue';
import PaymentMethodCard from './PaymentMethodCard.vue';

window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>