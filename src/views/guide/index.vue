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
                    <img src="@/static/images/ansi.png" alt="" />
                    <span>{{ $t("sug_profit_earnings_guide") }}</span>
                </div>

                <h1 class="guide-hero__title">
                    {{ $t("welcome_income_overview") }}
                </h1>

                <p class="guide-hero__desc">
                    {{ $t("income_guide_desc") }}
                </p>

                <div class="guide-hero__actions">
                    <button
                        class="guide-chip guide-chip--solid"
                        type="button"
                        @click="goStarting"
                    >
                        <img src="@/static/images/flash.png" alt="" />
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
                                </div>
                            </div>
                        </template>

                        <div class="guide-section__content rich-content">
                            <div v-html="section.content"></div>

                            <div
                                v-if="section.salaryScheme"
                                class="guide-salary-scheme"
                            >
                                <div class="guide-scheme-header">
                                    <div>{{ section.salaryScheme.title }}</div>
                                    <span>
                                        {{ section.salaryScheme.subtitle }}
                                    </span>
                                </div>

                                <div class="guide-salary-table">
                                    <div
                                        v-for="(row, rowIndex) in section
                                            .salaryScheme.rows"
                                        :key="`salary-row-${rowIndex}`"
                                        class="guide-salary-row"
                                    >
                                        <div class="guide-salary-row__name">
                                            {{ row.name }}
                                        </div>
                                        <div class="guide-salary-row__days">
                                            {{ row.days }}
                                        </div>
                                        <div class="guide-salary-row__amount">
                                            {{ row.amount }}
                                        </div>
                                    </div>
                                </div>

                                <div class="guide-salary-how">
                                    <h4>{{ section.salaryScheme.howTitle }}</h4>
                                    <p>{{ section.salaryScheme.howText }}</p>
                                    <p>{{ section.salaryScheme.earnText }}</p>
                                    <strong>
                                        {{ section.salaryScheme.tip }}
                                    </strong>
                                </div>
                            </div>

                            <div
                                v-if="section.resetBonusScheme"
                                class="guide-reset-scheme"
                            >
                                <div class="guide-scheme-header">
                                    <div>
                                        {{ section.resetBonusScheme.title }}
                                    </div>
                                    <span>
                                        {{ section.resetBonusScheme.subtitle }}
                                    </span>
                                </div>

                                <div class="guide-reset-plans">
                                    <div
                                        v-for="(plan, planIndex) in section
                                            .resetBonusScheme.plans"
                                        :key="`reset-plan-${planIndex}`"
                                        class="guide-reset-plan"
                                    >
                                        <div class="guide-reset-plan__name">
                                            {{ plan.name }}
                                        </div>
                                        <div class="guide-reset-plan__label">
                                            {{ plan.amountLabel }}
                                        </div>
                                        <div class="guide-reset-plan__amount">
                                            {{ plan.amount }}
                                        </div>
                                        <div class="guide-reset-plan__label">
                                            {{ plan.extraLabel }}
                                        </div>
                                        <div class="guide-reset-plan__extra">
                                            {{ plan.extra }}
                                        </div>
                                    </div>
                                </div>

                                <div class="guide-reset-advance-title">
                                    {{ section.resetBonusScheme.advanceTitle }}
                                </div>

                                <div class="guide-reset-advance-grid">
                                    <div
                                        v-for="(item, itemIndex) in section
                                            .resetBonusScheme.advanceRows"
                                        :key="`reset-advance-${itemIndex}`"
                                        class="guide-reset-advance-card"
                                    >
                                        <div
                                            class="guide-reset-advance-card__title"
                                        >
                                            {{ item.title }}
                                        </div>
                                        <div
                                            class="guide-reset-advance-card__range"
                                        >
                                            {{ item.range }}
                                        </div>
                                        <div
                                            class="guide-reset-advance-card__desc"
                                        >
                                            {{ item.desc }}
                                        </div>
                                        <div
                                            class="guide-reset-advance-card__bonus"
                                        >
                                            {{ item.bonus }} {{ item.suffix }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-if="section.vipProfitRates"
                                class="guide-vip-profit"
                            >
                                <div
                                    v-for="(row, rowIndex) in section
                                        .vipProfitRates.rows"
                                    :key="`vip-profit-${rowIndex}`"
                                    class="guide-vip-profit__row"
                                >
                                    <span class="guide-vip-profit__level">
                                        {{ row.level }}
                                    </span>
                                    <span class="guide-vip-profit__bar">
                                        <i
                                            :style="{
                                                width: row.progress || '0%',
                                            }"
                                        ></i>
                                    </span>
                                    <span class="guide-vip-profit__rate">
                                        {{ row.rate }}
                                    </span>
                                </div>

                                <button
                                    class="guide-vip-profit__button"
                                    type="button"
                                    @click="goVips"
                                >
                                    {{ section.vipProfitRates.button }}
                                </button>
                            </div>

                            <img
                                v-if="
                                    section.image &&
                                    !section.salaryScheme &&
                                    !section.resetBonusScheme
                                "
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

const defaultSalaryScheme = computed(() => {
    return {
        title: t("guide_salary_scheme_title"),
        subtitle: t("guide_salary_scheme_subtitle"),
        rows: [
            {
                name: t("guide_salary_sign_in"),
                days: t("guide_salary_2_days"),
                amount: t("guide_salary_amount_130"),
            },
            {
                name: t("guide_salary_sign_in"),
                days: t("guide_salary_4_days"),
                amount: t("guide_salary_amount_1200"),
            },
            {
                name: t("guide_salary_sign_in"),
                days: t("guide_salary_7_days"),
                amount: t("guide_salary_amount_1500"),
            },
            {
                name: t("guide_salary_sign_in"),
                days: t("guide_salary_15_days"),
                amount: t("guide_salary_amount_1800"),
            },
            {
                name: t("guide_salary_sign_in"),
                days: t("guide_salary_30_days"),
                amount: t("guide_salary_amount_2370"),
            },
        ],
        howTitle: t("guide_salary_how_title"),
        howText: t("guide_salary_how_text"),
        earnText: t("guide_salary_earn_text"),
        tip: t("guide_salary_tip"),
    };
});

const defaultResetBonusScheme = computed(() => {
    return {
        title: t("guide_reset_scheme_title"),
        subtitle: t("guide_reset_scheme_subtitle"),
        plans: [
            {
                name: t("guide_reset_plan_1_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_1_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_1_extra"),
            },
            {
                name: t("guide_reset_plan_2_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_2_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_2_extra"),
            },
            {
                name: t("guide_reset_plan_3_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_3_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_3_extra"),
            },
            {
                name: t("guide_reset_plan_4_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_4_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_4_extra"),
            },
            {
                name: t("guide_reset_plan_5_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_5_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_5_extra"),
            },
            {
                name: t("guide_reset_plan_6_name"),
                amountLabel: t("guide_reset_amount_label"),
                amount: t("guide_reset_plan_6_amount"),
                extraLabel: t("guide_reset_extra_label"),
                extra: t("guide_reset_plan_6_extra"),
            },
        ],
        advanceTitle: t("guide_reset_advance_title"),
        advanceRows: [
            {
                title: t("guide_reset_advance_day_title"),
                range: t("guide_reset_range_1500_9999"),
                desc: t("guide_reset_will_get"),
                bonus: t("guide_reset_bonus_4"),
                suffix: t("guide_reset_advance_bonus"),
            },
            {
                title: t("guide_reset_advance_day_title"),
                range: t("guide_reset_range_10000_19999"),
                desc: t("guide_reset_will_get"),
                bonus: t("guide_reset_bonus_8"),
                suffix: t("guide_reset_advance_bonus"),
            },
            {
                title: t("guide_reset_advance_day_title"),
                range: t("guide_reset_range_20000_49999"),
                desc: t("guide_reset_will_get"),
                bonus: t("guide_reset_bonus_4"),
                suffix: t("guide_reset_advance_bonus"),
            },
            {
                title: t("guide_reset_advance_day_title"),
                range: t("guide_reset_range_50000_above"),
                desc: t("guide_reset_will_get"),
                bonus: t("guide_reset_bonus_4"),
                suffix: t("guide_reset_advance_bonus"),
            },
        ],
    };
});

const replaceI18nVars = (value = "") => {
    if (!value || typeof value !== "string") {
        return value;
    }

    return value.replace(/\{(\w+)\}/g, (_, key) => {
        return incomeGuideVars[key] || "";
    });
};

const normalizeSalaryScheme = (salaryScheme) => {
    if (!salaryScheme) {
        return null;
    }

    return {
        title: replaceI18nVars(salaryScheme.title),
        subtitle: replaceI18nVars(salaryScheme.subtitle),
        rows: Array.isArray(salaryScheme.rows)
            ? salaryScheme.rows.map((row) => {
                  return {
                      name: replaceI18nVars(row.name),
                      days: replaceI18nVars(row.days),
                      amount: replaceI18nVars(row.amount),
                  };
              })
            : [],
        howTitle: replaceI18nVars(salaryScheme.howTitle),
        howText: replaceI18nVars(salaryScheme.howText),
        earnText: replaceI18nVars(salaryScheme.earnText),
        tip: replaceI18nVars(salaryScheme.tip),
    };
};

const normalizeResetBonusScheme = (resetBonusScheme) => {
    if (!resetBonusScheme) {
        return null;
    }

    return {
        title: replaceI18nVars(resetBonusScheme.title),
        subtitle: replaceI18nVars(resetBonusScheme.subtitle),
        plans: Array.isArray(resetBonusScheme.plans)
            ? resetBonusScheme.plans.map((plan) => {
                  return {
                      name: replaceI18nVars(plan.name),
                      amountLabel: replaceI18nVars(plan.amountLabel),
                      amount: replaceI18nVars(plan.amount),
                      extraLabel: replaceI18nVars(plan.extraLabel),
                      extra: replaceI18nVars(plan.extra),
                  };
              })
            : [],
        advanceTitle: replaceI18nVars(resetBonusScheme.advanceTitle),
        advanceRows: Array.isArray(resetBonusScheme.advanceRows)
            ? resetBonusScheme.advanceRows.map((item) => {
                  return {
                      title: replaceI18nVars(item.title),
                      range: replaceI18nVars(item.range),
                      desc: replaceI18nVars(item.desc),
                      bonus: replaceI18nVars(item.bonus),
                      suffix: replaceI18nVars(item.suffix),
                  };
              })
            : [],
    };
};

const getSalaryScheme = (item, index) => {
    if (index === 0) {
        return defaultSalaryScheme.value;
    }

    if (item.salaryScheme) {
        return normalizeSalaryScheme(item.salaryScheme);
    }

    return null;
};

const getResetBonusScheme = (item, index) => {
    if (index === 1) {
        return defaultResetBonusScheme.value;
    }

    if (item.resetBonusScheme) {
        return normalizeResetBonusScheme(item.resetBonusScheme);
    }

    return null;
};

const guideSections = computed(() => {
    const sections = tm("income_guide_sections");

    if (!Array.isArray(sections)) {
        return [];
    }

    return sections.map((item, index) => {
        const salaryScheme = getSalaryScheme(item, index);
        const resetBonusScheme = getResetBonusScheme(item, index);

        return {
            ...item,
            title: replaceI18nVars(item.title),
            content: replaceI18nVars(item.content),
            image:
                salaryScheme || resetBonusScheme
                    ? ""
                    : replaceI18nVars(item.image),
            salaryScheme,
            resetBonusScheme,
            vipProfitRates: item.vipProfitRates || null,
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
    router.push({ path: "/deposit" });
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
    background: var(--theme-button-gradient);
    color: #fff;
    box-shadow: 0 14px 30px rgba(38, 166, 91, 0.18);
}

.guide-hero__eyebrow {
    display: flex;
    align-items: center;
    font-size: 11px;
    line-height: 16px;
    letter-spacing: 0.08em;
    opacity: 0.88;
}

.guide-hero__eyebrow img {
    margin-right: 8px;
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
}

.guide-chip img {
    margin-right: 6px;
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

.rich-content :deep(strong),
.rich-content :deep(b) {
    color: #1e2a1f;
    font-weight: 600;
}

.guide-salary-scheme,
.guide-reset-scheme {
    overflow: hidden;
    width: 100%;
    margin: 12px auto 2px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
}

.guide-scheme-header {
    padding: 9px 8px 8px;
    background: var(--theme-button-gradient);
    color: #fff;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
}

.guide-scheme-header span {
    display: block;
}

.guide-salary-table {
    background: #fff;
}

.guide-salary-row {
    display: grid;
    grid-template-columns: 32% 33% 35%;
    min-height: 56px;
    border-bottom: 1px solid #d9d9d9;
    color: #000;
    font-size: 13px;
    line-height: 20px;
}

.guide-salary-row > div {
    display: flex;
    align-items: center;
    padding: 8px 10px;
}

.guide-salary-row__days {
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    word-break: keep-all;
}

.guide-salary-row__amount {
    justify-content: flex-end;
    text-align: right;
}

.guide-salary-how {
    padding: 8px 10px 12px;
    background: #fff;
}

.guide-salary-how h4 {
    margin: 0 0 6px;
    color: #000;
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
}

.guide-salary-how p {
    margin: 0 0 8px;
    color: #395f6a;
    font-size: 10px;
    line-height: 16px;
}

.guide-salary-how strong {
    display: block;
    color: #ff6a00;
    font-size: 10px;
    line-height: 16px;
}

.guide-reset-scheme {
    padding-bottom: 8px;
    background:
        linear-gradient(rgba(34, 45, 50, 0.64), rgba(34, 45, 50, 0.64)),
        linear-gradient(135deg, #64756b 0%, #293b42 100%);
}

.guide-reset-plans {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    padding: 12px 10px 10px;
}

.guide-reset-plan {
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    text-align: center;
    color: #000;
    font-size: 11px;
    line-height: 16px;
}

.guide-reset-plan__name {
    padding: 4px 2px;
    background: #321a10;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 14px;
}

.guide-reset-plan__label {
    padding-top: 6px;
}

.guide-reset-plan__amount,
.guide-reset-plan__extra {
    padding: 5px 2px 7px;
    color: #ff6a00;
    font-size: 10px;
    line-height: 14px;
}

.guide-reset-advance-title {
    margin-top: 4px;
    padding: 10px 8px;
    background: #ff6a00;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
}

.guide-reset-advance-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    padding: 8px;
}

.guide-reset-advance-card {
    min-height: 92px;
    padding: 8px 4px;
    background: #fff;
    text-align: center;
    color: #000;
}

.guide-reset-advance-card__title {
    font-size: 10px;
    font-weight: 700;
    line-height: 14px;
}

.guide-reset-advance-card__range {
    margin-top: 8px;
    color: #ff6a00;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
}

.guide-reset-advance-card__desc {
    margin-top: 8px;
    font-size: 10px;
    line-height: 14px;
}

.guide-reset-advance-card__bonus {
    margin-top: 8px;
    color: #ff6a00;
    font-size: 9px;
    line-height: 13px;
}

.guide-vip-profit {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 14px 0 4px;
}

.guide-vip-profit__row {
    display: grid;
    grid-template-columns: 74px 1fr 58px;
    align-items: center;
    min-height: 56px;
    padding: 0 16px;
    border: 1px solid #cfead7;
    border-radius: 12px;
    background: #eaf7ee;
    color: #1b3020;
}

.guide-vip-profit__level {
    font-size: 14px;
    line-height: 20px;
}

.guide-vip-profit__bar {
    position: relative;
    display: block;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #cfecd8;
}

.guide-vip-profit__bar i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #1ca052;
}

.guide-vip-profit__rate {
    text-align: right;
    color: #1ca052;
    font-size: 18px;
    line-height: 24px;
}

.guide-vip-profit__button {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(90deg, #36c96f 0%, #178e41 100%);
    color: #fff;
    font-size: 15px;
    line-height: 20px;
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
    color: var(--theme-primary);
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
