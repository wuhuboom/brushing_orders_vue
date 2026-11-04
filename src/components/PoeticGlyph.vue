<template>
  <svg
    class="poetic-glyph"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.chevron" />
  </svg>
</template>
<script setup>
defineProps({ name: String });
const paths = {
  lock: "M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4M12 14v3",
  key: "M9 15a5 5 0 1 1 0-6 5 5 0 0 1 0 6Zm0-3h12m-3 0v4m-4-4v3",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6L12 2Zm-4 10 3 3 5-6",
  user: "M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM4 22v-3a8 8 0 0 1 16 0v3H4Z",
  camera: "M3 7h4l2-3h6l2 3h4v14H3V7Zm5 6a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z",
  chevron: "m9 5 7 7-7 7",
  arrow: "M3 12h18m-7-7 7 7-7 7",
  incoming: "M18 5 5 18m0-11v11h11",
  history: "M3 4v6h6M3 10a9 9 0 1 1 1 8m8-13v7l4 2",
  copy: "M8 3h13v15H8zM4 7H2v15h13v-2",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm7 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
  support:
    "M3 14v-3a9 9 0 0 1 18 0v7a3 3 0 0 1-3 3h-5M3 10h4v8H3zM17 10h4v8h-4z",
  exit: "M10 3H3v18h7m-2-9h13m-5-5 5 5-5 5",
};
</script>
