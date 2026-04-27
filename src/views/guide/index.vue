<template>
    <div class="guide-page">
        <PageTopBar
            :title="$t('income_guide')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="guide-body">
            <section class="guide-hero">
                <div class="guide-hero__eyebrow">
                    <img src="@/static/images/ansi.png" /><span>
                        {{ $t("sug_profit_earnings_guide") }}</span
                    >
                </div>

                <h1 class="guide-hero__title">
                    {{ $t("welcome_income_overview") }}
                </h1>

                <p class="guide-hero__desc">
                    {{ $t("income_guide_desc") }}
                </p>

                <div class="guide-hero__actions">
                    <button class="guide-chip guide-chip--solid" type="button" @click="goStarting">
                        <img src="@/static/images/flash.png" />
                        <span>{{ $t("start_earning") }}</span>
                    </button>

                    <button class="guide-chip" type="button" @click="goVips">
                        {{ $t("view_vip") }}
                    </button>
                </div>

                <span class="guide-hero__orb guide-hero__orb--top"></span>
                <span class="guide-hero__orb guide-hero__orb--bottom"></span>
            </section>

            <div v-if="guideSections.length" class="guide-card-list">
                <van-collapse
                    v-model="activeNames"
                    :border="false"
                    class="guide-collapse"
                >
                    <van-collapse-item
                        v-for="(section, index) in guideSections"
                        :key="`${section.title}-${index}`"
                        :name="String(index)"
                        class="guide-section-card"
                    >
                        <template #title>
                            <div class="guide-section__title-row">
                                <div class="guide-section__icon">
                                    <img
                                        class="guide-section__icon-img"
                                        :src="
                                            sectionIcons[
                                                index % sectionIcons.length
                                            ]
                                        "
                                        alt=""
                                    />
                                </div>

                                <div class="guide-section__headings">
                                    <div class="guide-section__title">
                                        {{ formatGuideTitle(section, index) }}
                                    </div>

                                    <!-- <div class="guide-section__subtitle">
                                        {{
                                            sectionSubtitles[index] ||
                                            $t("detailed_explanation_rules")
                                        }}
                                    </div> -->
                                </div>
                            </div>
                        </template>

                        <div class="guide-section__content rich-content">
                            <div v-html="section.content"></div>

                            <img
                                v-if="section.image"
                                class="guide-section__image"
                                :src="section.image"
                                alt=""
                            />
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>

            <div v-else class="guide-fallback rich-content">
                {{ $t("income_overview") }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import guideTab3Icon from "@/static/images/guidetab3.png";
import guideTab1Icon from "@/static/images/guidetab1.png";
import guideTab2Icon from "@/static/images/guidetab2.png";

const activeNames = ref([]);
const { t, tm } = useI18n();
const router = useRouter();

const sectionIcons = [guideTab1Icon, guideTab2Icon, guideTab3Icon];

const incomeGuideVars = {
    basicSalaryImage:
        "https://api-shuadan.pigk.xyz/profile/upload/2026/04/19/ksnip_20260419-232600_20260419152644A007.png",
    resetBonusImage:
        "https://api-shuadan.pigk.xyz/profile/upload/2026/04/19/ksnip_20260419-232600_20260419152644A007.png",
};

const sectionSubtitles = computed(() => [
    t("guide_subtitle_salary_structure"),
    t("guide_subtitle_rewards_bonuses"),
    t("guide_subtitle_member_rewards"),
    t("guide_subtitle_daily_rules"),
    t("guide_subtitle_account_support"),
]);

const replaceI18nVars = (value = "") => {
    if (!value || typeof value !== "string") {
        return value;
    }

    return value.replace(/\{(\w+)\}/g, (_, key) => {
        return incomeGuideVars[key] || "";
    });
};

const guideSections = computed(() => {
    const sections = tm("income_guide_sections");

    if (!Array.isArray(sections)) {
        return [];
    }

    return sections.map((item) => {
        return {
            ...item,
            title: replaceI18nVars(item.title),
            content: replaceI18nVars(item.content),
            image: replaceI18nVars(item.image),
        };
    });
});

watch(
    guideSections,
    (val) => {
        activeNames.value = val.map((_, index) => String(index));
    },
    { immediate: true },
);

const formatGuideTitle = (section, index) => {
    const title = section?.title || t("income_overview");

    if (/^\(\d+\)/.test(title) || /^\d+[\).]/.test(title)) {
        return title;
    }

    return `(${index + 1}) ${title}`;
};

const goStarting = () => {
    router.push({ path: "/starting" });
};

const goVips = () => {
    router.push({ path: "/vips" });
};

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.guide-page {
    min-height: 100vh;
    background: #edf4ef;
}

.guide-body {
    padding: 74px 16px 24px;
}

.guide-hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 18px 16px 20px;
    background: linear-gradient(135deg, #28b95d 0%, #1f9e4f 100%);
    color: #fff;
    box-shadow: 0 14px 30px rgba(38, 166, 91, 0.18);
}

.guide-hero__eyebrow {
    font-size: 11px;
    line-height: 16px;
    letter-spacing: 0.08em;
    opacity: 0.88;
    display: flex;
    img {
        margin-right: 8px;
    }
}

.guide-hero__title {
    margin: 10px 0 8px;
    font-size: 19px;
    line-height: 28px;
    font-weight: 600;
}

.guide-hero__desc {
    position: relative;
    z-index: 1;
    margin: 0;
    font-size: 13px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.92);
}

.guide-hero__actions {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 10px;
    margin-top: 16px;
}

.guide-chip {
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    padding: 9px 16px;
    font-size: 13px;
    line-height: 18px;
    display: flex;
    align-items: center;
    img {
        margin-right: 6px;
    }
}

.guide-chip--solid {
    border-color: transparent;
    background: rgba(255, 255, 255, 0.18);
}

.guide-hero__orb {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.guide-hero__orb--top {
    width: 96px;
    height: 96px;
    top: -18px;
    right: -10px;
}

.guide-hero__orb--bottom {
    width: 74px;
    height: 74px;
    right: 24px;
    bottom: -28px;
}

.guide-card-list,
.guide-fallback {
    margin-top: 14px;
}

.guide-collapse {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;
}

.guide-section-card {
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid #cfe6d2;
    background: #fff;
    box-shadow: 0 10px 24px rgba(26, 86, 47, 0.06);
}

.guide-section__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 2px 4px 2px 0;
}

.guide-section__icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: #e5f3e8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.guide-section__icon-img {
    display: block;
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.guide-section__headings {
    flex: 1;
    min-width: 0;
}

.guide-section__title {
    color: #212b21;
    font-size: 17px;
    line-height: 24px;
    font-weight: 600;
}

.guide-section__subtitle {
    margin-top: 2px;
    color: #8aa08e;
    font-size: 11px;
    line-height: 16px;
}

.guide-section__content {
    padding-top: 4px;
}

.guide-section__image {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin-top: 12px;
    border-radius: 14px;
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p),
.rich-content :deep(li) {
    color: #5e7360;
    font-size: 13px;
    line-height: 24px;
}

.rich-content :deep(p) {
    margin: 0 0 10px;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
    padding-left: 18px;
    margin: 0 0 10px;
}

.rich-content :deep(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
}

.rich-content :deep(tr) {
    background: #eef6ef;
}

.rich-content :deep(td),
.rich-content :deep(th) {
    padding: 12px 14px;
    font-size: 13px;
    line-height: 20px;
    color: #263626;
}

.rich-content :deep(td:first-child),
.rich-content :deep(th:first-child) {
    border-radius: 12px 0 0 12px;
}

.rich-content :deep(td:last-child),
.rich-content :deep(th:last-child) {
    border-radius: 0 12px 12px 0;
    text-align: right;
    color: #1fa24f;
    font-weight: 600;
}

.rich-content :deep(strong),
.rich-content :deep(b) {
    color: #1e2a1f;
    font-weight: 600;
}

.guide-fallback {
    border-radius: 18px;
    border: 1px solid #cfe6d2;
    background: #fff;
    padding: 18px 16px;
    box-shadow: 0 10px 24px rgba(26, 86, 47, 0.06);
}

:deep(.guide-nav .van-nav-bar) {
    background: #fff;
}

:deep(.guide-nav .van-nav-bar__title) {
    color: #1c291c;
    font-size: 18px;
    font-weight: 500;
}

:deep(.guide-nav .van-icon-arrow-left) {
    color: #25a14d;
    font-size: 22px;
}

:deep(.guide-collapse .van-collapse-item__wrapper) {
    border-radius: 0 0 18px 18px;
}

:deep(.guide-collapse .van-collapse-item__content) {
    padding: 0 14px 16px;
    background: #fff;
}

:deep(.guide-collapse .van-cell) {
    align-items: center;
    padding: 14px 14px 12px;
    background: #fff;
}

:deep(.guide-collapse .van-cell::after) {
    display: none;
}

:deep(.guide-collapse .van-collapse-item__title--expanded) {
    color: inherit;
}

:deep(.guide-collapse .van-icon-arrow) {
    color: #6b8d72;
}
</style>
