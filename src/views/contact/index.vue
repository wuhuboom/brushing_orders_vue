<template>
  <main class="das-page contact-page">
    <DasPageHeader title-key="das.page.contact" />
    <section class="contact-body">
      <h2>{{ $t("das.contact.letsTalk") }}</h2>
      <p>{{ $t("das.contact.intro") }}</p>
      <div class="contact-channels">
        <button
          v-for="item in channels"
          :key="item.id || item.linkUrl"
          type="button"
          @click="openChannel(item.linkUrl)"
        >
          <span>{{ item.name }}</span
          ><b>›</b></button
        ><span v-if="loading">{{ $t("das.common.loading") }}</span
        ><span v-else-if="!channels.length">{{ $t("das.contact.empty") }}</span>
      </div>
      <h2 class="touch-title">{{ $t("das.contact.getInTouch") }}</h2>
      <p>{{ $t("das.contact.touchText") }}</p>
      <small>{{ $t("das.common.copyright") }}</small>
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getCustomerService } from "@/api/apis";
import DasPageHeader from "@/components/DasPageHeader.vue";
const channels = ref([]),
  loading = ref(true);
const openChannel = (url) => {
  if (url) window.open(url, "_blank", "noopener,noreferrer");
};
onMounted(async () => {
  try {
    channels.value = (await getCustomerService()).data || [];
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.contact-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.contact-body {
  max-width: 760px;
  margin: auto;
  padding: 18px 28px 80px;
}
.contact-body h2 {
  margin: 18px 0 12px;
  text-align: center;
  font-size: 28px;
}
.contact-body > p {
  margin: 0;
  color: #778079;
  font-size: 15px;
  line-height: 1.55;
}
.contact-channels {
  margin: 26px 0 42px;
  display: grid;
  gap: 12px;
}
.contact-channels button {
  width: 100%;
  min-height: 62px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  border-radius: 18px;
  background: #14392c;
  color: #fff;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}
.contact-channels button b {
  font-size: 28px;
  font-weight: 300;
}
.contact-channels > span {
  text-align: center;
  color: #89918b;
}
.contact-body .touch-title {
  text-align: left;
}
.contact-body small {
  display: block;
  margin-top: 34px;
  text-align: center;
  color: #9ba19c;
  font-size: 10px;
}
</style>
