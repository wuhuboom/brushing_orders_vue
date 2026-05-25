<template>
  <div class="faqs-design-page">
    <PageTopBar :title="$t('faqs')" show-back @click-left="onClickLeft" />

    <main class="faqs-content">
      <template v-for="section in faqSections" :key="section.title">
        <h2>{{ section.title }}</h2>
        <p v-for="item in section.items" :key="item">{{ item }}</p>
      </template>
    </main>
  </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t, tm } = useI18n();

const htmlToTextList = (value) => {
  if (!value) return [];
  return String(value)
    .match(/<p[\s\S]*?<\/p>/gi)
    ?.map((item) => item.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean) || [];
};

const faqSections = computed(() => {
  const sections = tm("faq_sections");
  if (Array.isArray(sections) && sections.length) {
    return sections.map((section) => ({
      title: section.title,
      items: htmlToTextList(section.content),
    }));
  }

  return [
    { title: t("faq_mission_title"), items: [t("faq_mission_1"), t("faq_mission_2"), t("faq_mission_3")] },
    { title: t("withdrawal"), items: [t("faq_withdraw_1"), t("faq_withdraw_2"), t("faq_withdraw_3"), t("faq_withdraw_4"), t("faq_withdraw_5")] },
    { title: t("faq_funds_title"), items: [t("faq_funds_1"), t("faq_funds_2")] },
  ];
});
const onClickLeft = () => {
  history.back();
};
</script>

<style scoped>
.faqs-design-page {
  min-height: 100vh;
  background: #eef2f8;
  color: #050505;
  font-family: inherit;
}

.design-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 52px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  background: #030303;
  color: #fff;
}

.design-title {
  text-align: center;
  font-size: 17px;
  line-height: 22px;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.design-back {
  width: 52px;
  height: 52px;
  border: 0;
  background: transparent;
  position: relative;
}

.design-back::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 18px;
  width: 13px;
  height: 13px;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #fff;
  transform: rotate(45deg);
  border-radius: 1px;
}

.faqs-content {
  padding: 27px 19px 30px;
}

.faqs-content h2 {
  margin: 0 0 26px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 800;
}

.faqs-content p {
  margin: 0 0 33px;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.faqs-content p:nth-of-type(3) { margin-bottom: 52px; }
.faqs-content p:nth-of-type(8) { margin-bottom: 54px; }
</style>
