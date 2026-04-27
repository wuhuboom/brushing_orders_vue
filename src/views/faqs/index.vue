<template>
    <div class="faqs-page">
        <PageTopBar :title="$t('faqs')" show-back @click-left="onClickLeft" />

        <div class="faqs-body">
            <section class="faqs-hero">
                <div class="faqs-hero__icon">?</div>

                <div class="faqs-hero__content">
                    <div class="faqs-hero__title">
                        {{ $t("frequently_asked_questions") }}
                    </div>
                    <div class="faqs-hero__desc">
                        {{ $t("find_instant_answers") }}
                    </div>
                </div>

                <span class="faqs-hero__orb"></span>
            </section>

            <section v-if="faqSections.length" class="faqs-accordion">
                <van-collapse
                    v-model="activeNames"
                    :border="false"
                    class="faqs-collapse"
                >
                    <van-collapse-item
                        v-for="(section, index) in faqSections"
                        :key="`${section.title}-${index}`"
                        :name="String(index)"
                        class="faqs-card"
                    >
                        <template #title>
                            <div class="faqs-card__header">
                                <div class="faqs-card__icon">
                                    <van-icon name="question-o" />
                                </div>

                                <div class="faqs-card__title">
                                    {{ section.title }}
                                </div>
                            </div>
                        </template>

                        <div
                            v-if="section.content"
                            class="faqs-card__content rich-content"
                            v-html="section.content"
                        ></div>
                    </van-collapse-item>
                </van-collapse>
            </section>

            <div v-else class="faqs-fallback rich-content">
                {{ $t("faq") }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const activeNames = ref([]);
const { tm } = useI18n();

const faqSections = computed(() => {
    const sections = tm("faq_sections");
    return Array.isArray(sections) ? sections : [];
});

watch(
    faqSections,
    (val) => {
        activeNames.value = val
            .slice(0, Math.min(3, val.length))
            .map((_, index) => String(index));
    },
    { immediate: true },
);

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.faqs-page {
    min-height: 100vh;
    background: #edf4ef;
}

.faqs-body {
    padding: 78px 16px 24px;
}

.faqs-hero {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 18px;
    padding: 14px 14px;
    background: linear-gradient(135deg, #22984b 0%, #1f8440 100%);
    color: #fff;
    box-shadow: 0 16px 28px rgba(31, 132, 64, 0.16);
}

.faqs-hero__icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #ff3e3e;
    font-weight: 700;
    position: relative;
    z-index: 1;
}

.faqs-hero__content {
    position: relative;
    z-index: 1;
}

.faqs-hero__title {
    font-size: 19px;
    line-height: 26px;
    font-weight: 500;
}

.faqs-hero__desc {
    margin-top: 2px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    line-height: 18px;
}

.faqs-hero__orb {
    position: absolute;
    right: -20px;
    top: -24px;
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.faqs-accordion,
.faqs-fallback {
    margin-top: 14px;
}

.faqs-collapse {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;
}

.faqs-card,
.faqs-fallback {
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid #d8e9da;
    background: #fff;
    box-shadow: 0 10px 22px rgba(26, 77, 42, 0.05);
}

.faqs-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.faqs-card__icon {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    background: rgba(34, 160, 80, 0.08);
    color: #2ca24d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.faqs-card__title {
    flex: 1;
    min-width: 0;
    color: #1f2b1f;
    font-size: 15px;
    line-height: 22px;
    font-weight: 500;
}

.faqs-card__content,
.faqs-fallback {
    color: #607861;
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p),
.rich-content :deep(li) {
    margin: 0 0 10px;
    color: #607861;
    font-size: 13px;
    line-height: 24px;
}

.rich-content :deep(p:last-child),
.rich-content :deep(li:last-child) {
    margin-bottom: 0;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
    margin: 0 0 10px;
    padding-left: 18px;
}

.rich-content :deep(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
}

.rich-content :deep(td),
.rich-content :deep(th) {
    background: #eef6ef;
    padding: 12px;
    font-size: 13px;
    line-height: 20px;
    color: #314531;
}

.rich-content :deep(td:first-child),
.rich-content :deep(th:first-child) {
    border-radius: 10px 0 0 10px;
}

.rich-content :deep(td:last-child),
.rich-content :deep(th:last-child) {
    border-radius: 0 10px 10px 0;
}

.faqs-fallback {
    padding: 16px 14px;
}

:deep(.faqs-nav .van-nav-bar) {
    background: #fff;
}

:deep(.faqs-nav .van-nav-bar__title) {
    color: #202c20;
    font-size: 18px;
    font-weight: 500;
}

:deep(.faqs-nav .van-icon-arrow-left) {
    color: #27a14c;
    font-size: 22px;
}

:deep(.faqs-collapse .van-cell) {
    align-items: center;
    padding: 14px;
    background: #fff;
}

:deep(.faqs-collapse .van-collapse-item__title--expanded) {
    background: rgba(34, 160, 80, 0.04) !important;
}

:deep(.faqs-collapse .van-cell::after) {
    display: none;
}

:deep(.faqs-collapse .van-collapse-item__content) {
    padding: 0 14px 14px;
    background: #fff;
}

:deep(.faqs-collapse .van-icon-arrow) {
    color: #6d8d70;
}
</style>
