<template>
  <iframe class="design500-home" :src="homeUrl" title="500 Designs"></iframe>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return { homeUrl: `${process.env.BASE_URL}design500/home.html` };
  },
};
</script>

<style scoped>
.design500-home {
  display: block;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  border: 0;
}
</style>
