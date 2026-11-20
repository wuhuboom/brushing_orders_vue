<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'home'">
      <path :fill="active ? 'currentColor' : 'none'" d="M4.5 10 12 3.8l7.5 6.2v10h-5v-6.5h-5V20h-5z" />
    </template>
    <template v-else-if="name === 'start'">
      <circle cx="12" cy="12" r="8.4" :fill="active ? 'currentColor' : 'none'" />
      <path :fill="active ? '#fbf9f3' : 'currentColor'" stroke="none" d="m10 8 6 4-6 4z" />
    </template>
    <template v-else-if="name === 'records'">
      <path :fill="active ? 'currentColor' : 'none'" d="M7 4h12v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2h12v2a2 2 0 0 0 2 2M7 4v12" />
      <path :stroke="active ? '#fbf9f3' : 'currentColor'" d="M10 8h6m-6 4h6" />
    </template>
    <template v-else-if="name === 'profile'">
      <circle cx="12" cy="7.4" r="3.2" :fill="active ? 'currentColor' : 'none'" />
      <path :fill="active ? 'currentColor' : 'none'" d="M4.5 20v-1.5c0-3 3.3-4.8 7.5-4.8s7.5 1.8 7.5 4.8V20z" />
    </template>
    <path v-else-if="name === 'back'" d="m14.5 5.2-6.8 6.8 6.8 6.8" />
    <template v-else>
      <circle cx="12" cy="12" r="9" />
      <path v-if="name === 'withdraw'" d="M12 16.5v-9m-3.5 3.5L12 7.5l3.5 3.5" />
      <path v-else d="M12 8v8m-4-4h8" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  active: Boolean,
});
</script>
