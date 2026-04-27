<template>
    <div class="clause-page">
        <PageTopBar
            :title="$t('terms_and_conditions')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="clause-body">
            <section class="clause-hero">
                <div class="clause-hero__main">
                    <div class="clause-hero__icon">
                        <img src="@/static/images/tcagree.png" />
                    </div>

                    <div class="clause-hero__content">
                        <div class="clause-hero__title">
                            {{ $t("terms_and_conditions") }}
                        </div>
                        <div class="clause-hero__meta">
                            {{ $t("terms_last_updated") }}
                        </div>
                    </div>
                </div>

                <span class="clause-hero__orb"></span>

                <div class="clause-hero__note">
                    {{ $t("terms_continue_notice") }}
                </div>
            </section>

            <section v-if="clauseSections.length" class="clause-toc-card">
                <div class="clause-section-title">
                    {{ $t("table_of_contents") }}
                </div>

                <div class="clause-toc-list">
                    <div
                        v-for="(item, index) in clauseSections"
                        :key="`toc-${index}`"
                        class="clause-toc-item"
                        @click="scrollToClause(index)"
                    >
                        <span class="clause-toc-item__index">
                            {{ index + 1 }}.
                        </span>
                        <span class="clause-toc-item__text">
                            {{ item.title }}
                        </span>
                    </div>
                </div>
            </section>

            <section v-if="clauseSections.length" class="clause-accordion">
                <van-collapse
                    v-model="activeNames"
                    :border="false"
                    class="clause-collapse"
                >
                    <van-collapse-item
                        v-for="(section, index) in clauseSections"
                        :key="`${section.title}-${index}`"
                        :ref="(el) => setClauseItemRef(el, index)"
                        :name="String(index)"
                        class="clause-card"
                    >
                        <template #title>
                            <div class="clause-card__header">
                                <div class="clause-card__icon">
                                    <img
                                        class="clause-card__icon-img"
                                        :src="
                                            clauseIcons[
                                                index % clauseIcons.length
                                            ]
                                        "
                                        alt=""
                                    />
                                </div>

                                <div class="clause-card__title">
                                    {{ index + 1 }}. {{ section.title }}
                                </div>
                            </div>
                        </template>

                        <div
                            v-if="section.content"
                            class="clause-card__content rich-content"
                            v-html="section.content"
                        ></div>
                    </van-collapse-item>
                </van-collapse>
            </section>

            <div v-else class="clause-fallback rich-content">
                {{ $t("terms_and_conditions") }}
            </div>

            <div class="clause-alert">
                <img src="@/static/images/tgcellwar.png" />
                <span>
                    {{ $t("terms_update_alert") }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import tgcell1Icon from "@/static/images/tgcell1.png";
import tgcell2Icon from "@/static/images/tgcell2.png";
import tgcell3Icon from "@/static/images/tgcell3.png";
import tgcell4Icon from "@/static/images/tgcell4.png";
import tgcell5Icon from "@/static/images/tgcell5.png";
import tgcell6Icon from "@/static/images/tgcell6.png";
import tgcell7Icon from "@/static/images/tgcell7.png";
import tgcell8Icon from "@/static/images/tgcell8.png";

const activeNames = ref([]);
const clauseItemRefs = ref([]);
const { tm } = useI18n();

const clauseIcons = [
    tgcell1Icon,
    tgcell2Icon,
    tgcell3Icon,
    tgcell4Icon,
    tgcell5Icon,
    tgcell6Icon,
    tgcell7Icon,
    tgcell8Icon,
];

const clauseSections = computed(() => {
    const sections = tm("clause_sections");
    return Array.isArray(sections) ? sections : [];
});

watch(
    clauseSections,
    (val) => {
        activeNames.value = val.length ? ["0"] : [];
    },
    { immediate: true },
);

const setClauseItemRef = (el, index) => {
    if (el) {
        clauseItemRefs.value[index] = el;
    }
};

const scrollToClause = async (index) => {
    const name = String(index);

    activeNames.value = [name];

    await nextTick();

    setTimeout(() => {
        const item = clauseItemRefs.value[index];
        const el = item?.$el || item;

        if (!el) return;

        const top = el.getBoundingClientRect().top + window.pageYOffset - 82;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    }, 80);
};

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.clause-page {
    min-height: 100vh;
    background: #edf4ef;
}

.clause-body {
    padding: 78px 16px 28px;
}

.clause-hero {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    background: linear-gradient(135deg, #20994c 0%, #1e8b43 100%);
    color: #fff;
    padding: 18px 16px 16px;
    box-shadow: 0 14px 30px rgba(31, 139, 67, 0.16);
}

.clause-hero__main {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.clause-hero__icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.clause-hero__content {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.clause-hero__title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
}

.clause-hero__meta {
    margin-top: 4px;
    font-size: 12px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.88);
}

.clause-hero__note {
    position: relative;
    z-index: 1;
    margin-top: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.14);
    padding: 14px 12px;
    font-size: 13px;
    line-height: 22px;
}

.clause-hero__orb {
    position: absolute;
    width: 92px;
    height: 92px;
    right: -18px;
    top: -18px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.clause-toc-card,
.clause-fallback {
    margin-top: 14px;
    border-radius: 18px;
    border: 1px solid #d7e9da;
    background: #fff;
    padding: 16px 14px;
    box-shadow: 0 10px 22px rgba(25, 77, 41, 0.05);
}

.clause-section-title {
    color: #1f2b1f;
    font-size: 17px;
    line-height: 24px;
    font-weight: 500;
}

.clause-toc-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.clause-toc-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    color: #6c866e;
    font-size: 13px;
    line-height: 20px;
    cursor: pointer;
}

.clause-toc-item:active {
    opacity: 0.72;
}

.clause-toc-item__index {
    color: #2aa24d;
    flex-shrink: 0;
}

.clause-toc-item__text {
    flex: 1;
    min-width: 0;
}

.clause-accordion {
    margin-top: 14px;
}

.clause-collapse {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;
}

.clause-card {
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid #d7e9da;
    background: #fff;
    box-shadow: 0 10px 22px rgba(25, 77, 41, 0.05);
}

.clause-card__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.clause-card__icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 16px;
    background: rgba(34, 160, 80, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.clause-card__icon-img {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.clause-card__title {
    flex: 1;
    min-width: 0;
    color: #202c20;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    padding-top: 2px;
}

.clause-card__content {
    padding-top: 2px;
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p),
.rich-content :deep(li) {
    margin: 0 0 12px;
    color: #5d755f;
    font-size: 13px;
    line-height: 24px;
}

.rich-content :deep(p:last-child),
.rich-content :deep(li:last-child) {
    margin-bottom: 0;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
    padding-left: 18px;
    margin: 0 0 10px;
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
    color: #364736;
    font-size: 13px;
    line-height: 20px;
}

.rich-content :deep(td:first-child),
.rich-content :deep(th:first-child) {
    border-radius: 10px 0 0 10px;
}

.rich-content :deep(td:last-child),
.rich-content :deep(th:last-child) {
    border-radius: 0 10px 10px 0;
}

.rich-content :deep(strong),
.rich-content :deep(b) {
    color: #1f2b1f;
    font-weight: 600;
}

.clause-alert {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 16px;
    border-radius: 16px;
    border: 1px solid #f2d2d2;
    background: #fff6f6;
    color: #7e8f80;
    padding: 14px 12px;
    font-size: 12px;
    line-height: 20px;
}

.clause-alert img {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
}

.clause-alert :deep(.van-icon) {
    color: #f25f5f;
    font-size: 16px;
    margin-top: 2px;
    flex-shrink: 0;
}

:deep(.clause-nav .van-nav-bar) {
    background: #fff;
}

:deep(.clause-nav .van-nav-bar__title) {
    color: #1d291d;
    font-size: 18px;
    font-weight: 500;
}

:deep(.clause-nav .van-icon-arrow-left) {
    color: #28a14d;
    font-size: 22px;
}

:deep(.clause-collapse .van-cell) {
    align-items: center;
    padding: 14px;
    background: #fff;
}

:deep(.clause-collapse .van-collapse-item__title--expanded) {
    background: rgba(34, 160, 80, 0.04) !important;
}

:deep(.clause-collapse .van-cell::after) {
    display: none;
}

:deep(.clause-collapse .van-collapse-item__content) {
    padding: 0 14px 14px;
    background: #fff;
}

:deep(.clause-collapse .van-icon-arrow) {
    color: #6c8d70;
}
</style>
