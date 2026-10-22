<template>
  <svg class="site-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="(path, index) in paths[name] || paths.arrow" :key="index" :d="path" :fill="name === 'user' || name === 'chart' ? 'currentColor' : 'none'" />
  </svg>
</template>

<script>
const paths = {
  phone: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"],
  mail: ["M3 5h18v14H3Z", "m3 5 9 7 9-7"],
  copy: ["M9 3h11v14H9Z", "M5 7H3v14h11v-2"],
  clock: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", "M12 7v5l3 2"],
  bolt: ["m13 2-9 12h7l-1 8 10-12h-7Z"],
  arrow: ["M5 12h14m-6-6 6 6-6 6"],
  back: ["m14 5-7 7 7 7"],
  user: ["M15.3 7.2a3.3 3.3 0 1 1-6.6 0 3.3 3.3 0 0 1 6.6 0", "M5.5 20v-2a6.5 6.5 0 0 1 13 0v2Z"],
  chart: ["M4 13h3v7H4zM10.5 6h3v14h-3zM17 9h3v11h-3z"],
  code: ["m7 8-5 4 5 4m10-8 5 4-5 4m-3-12-4 20"],
  people: ["M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0", "M6 21v-2a6 6 0 0 1 12 0v2M3 10a2.5 2.5 0 0 1 2-4m14 0a2.5 2.5 0 0 1 2 4M2 18v-1a4 4 0 0 1 4-4m12 0a4 4 0 0 1 4 4v1"],
  media: ["M4 6h16M4 10h16M4 14h16M4 18h16"],
  megaphone: ["M3 10v5h4l10 5V5L7 10Zm4 5 2 6m11-12 2-2m-2 9 2 2"],
  search: ["M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-2 5 6 6"],
  database: ["M20 6c0 2-3.6 3.5-8 3.5S4 8 4 6s3.6-3.5 8-3.5S20 4 20 6Z", "M4 6v12c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5V6M4 12c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5"],
  star: ["m12 2 3 6 6.5 1-4.7 4.7 1.1 6.6L12 17.2l-5.9 3.1 1.1-6.6L2.5 9 9 8Z"],
  calendar: ["M4 5h16v16H4Zm4-3v6m8-6v6M4 10h16M8 13l-1 5"],
};

export default {
  name: "SiteIcon",
  props: { name: { type: String, default: "arrow" } },
  data: () => ({ paths }),
};
</script>
