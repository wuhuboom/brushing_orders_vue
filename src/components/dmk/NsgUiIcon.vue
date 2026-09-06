<template>
  <svg class="nsg-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'copy'"><rect x="8" y="3" width="12" height="15" rx="2" /><path d="M16 21H5a1 1 0 0 1-1-1V7" /></template>
    <template v-else-if="name === 'check'"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></template>
    <template v-else-if="name === 'clock'"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 3" /></template>
    <template v-else-if="name === 'history-clock'"><path d="M3 5v5h5M3.5 9a8.5 8.5 0 1 1 .5 8M12 7v5l4 2" /></template>
    <path v-else-if="name === 'withdraw'" d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4" />
    <template v-else-if="name === 'reject'"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></template>
    <template v-else-if="name === 'refresh'"><path d="M20 5v5h-5M4 19v-5h5M5.3 9a7 7 0 0 1 11.5-3L20 10M4 14l3.2 4A7 7 0 0 0 18.7 15" /></template>
    <template v-else-if="name === 'calendar'"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16" /></template>
    <template v-else-if="name === 'calendar-check'"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16M8 15l3 3 5-5" /></template>
    <template v-else-if="name === 'shield'"><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></template>
    <template v-else-if="name === 'user'"><circle cx="12" cy="7" r="3" /><path d="M5 20v-2a7 7 0 0 1 14 0v2H5Z" /></template>
    <template v-else-if="name === 'gift'"><path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14" /><path d="M12 7H8a2.5 2.5 0 1 1 2.5-2.5L12 7Zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 7Z" /></template>
    <template v-else-if="name === 'support'"><path d="M4 13v-2a8 8 0 0 1 16 0v6c0 3-3 4-7 4M4 11H2v6h4v-6H4Zm16 0h2v6h-4v-6h2Z" /><path d="M9 10v1m6-1v1m-6 4c2 2 4 2 6 0" /></template>
    <template v-else-if="name === 'medal'"><circle cx="12" cy="9" r="6" /><path d="m8 14-1 8 5-3 5 3-1-8M12 6l1 2 2 .3-1.5 1.5.3 2.2-1.8-1-1.8 1 .3-2.2L9 8.3l2-.3 1-2Z" /></template>
    <path v-else-if="name === 'star'" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    <template v-else-if="name === 'box'"><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V8M12 13v10" /></template>
    <template v-else-if="name === 'empty'"><path d="m3 5 8 1 1 5-8-1-3-4Zm18 0-8 1-1 5 8-1 3-4ZM4 12v7l8 3 8-3v-7M12 13v9" /></template>
    <path v-else-if="name === 'back'" d="m10 5-7 7 7 7M3 12h18" />
    <path v-else-if="name === 'previous'" d="m15 5-7 7 7 7" />
    <path v-else-if="name === 'next'" d="m9 5 7 7-7 7" />
    <path v-else-if="name === 'bolt'" d="m14 2-9 12h6l-1 8 9-13h-6l1-7Z" />
    <path v-else-if="name === 'trend'" d="m3 17 6-6 4 3 8-10m-6 0h6v6" />
    <template v-else-if="name === 'target'"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></template>
    <template v-else-if="name === 'history'"><path d="M6 3h14v18H6M6 16H3v4a1 1 0 0 0 1 1h3M10 7h6m-6 4h6m-6 4h6" /></template>
  </svg>
</template>
<script setup>
defineProps({ name: { type: String, required: true } });
</script>
<style>
.nsg-ui-icon { display: inline-block; width: 1em; height: 1em; flex: 0 0 auto; vertical-align: middle; }
</style>
