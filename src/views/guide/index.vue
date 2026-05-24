<template>
    <div class="algofy-guide-page">
        <PageTopBar
            :title="$t('income_guide')"
            show-back
            @click-left="onClickLeft"
        />

        <main class="guide-content">
            <section class="guide-intro-card">
                <div class="intro-eyebrow">
                    {{ $t("sug_profit_earnings_guide") }}
                </div>
                <h1>{{ $t("welcome_income_overview") }}</h1>
                <p>{{ $t("income_guide_desc") }}</p>
            </section>

            <section class="guide-section">
                <h2>{{ guideSectionTitle(0, "Basic Salary") }}</h2>
                <p class="section-subtitle">
                    {{ $t("guide_salary_scheme_subtitle") }}
                </p>
                <div class="white-panel salary-panel">
                    <p class="panel-copy" v-html="guideSectionContent(0)"></p>
                    <div
                        v-for="(row, index) in salaryRows"
                        :key="`salary-row-${index}`"
                        class="salary-row"
                    >
                        <span>{{ row.name }} {{ row.days }}</span>
                        <b>{{ row.amount }}</b>
                    </div>
                </div>
            </section>

            <section class="guide-section">
                <h2>{{ guideSectionTitle(1, "Reset Bonus") }}</h2>
                <p class="section-subtitle">
                    {{ $t("guide_reset_scheme_subtitle") }}
                </p>
                <div class="white-panel bonus-panel">
                    <p class="panel-copy" v-html="guideSectionContent(1)"></p>
                    <div class="reset-title">
                        ▫ {{ $t("guide_reset_scheme_title") }}
                    </div>
                    <div
                        v-for="(plan, index) in resetPlans"
                        :key="`reset-plan-${index}`"
                        class="bonus-row"
                        :class="{
                            'bonus-row-last': index === resetPlans.length - 1,
                        }"
                    >
                        <span>{{
                            formatResetAmount(plan.amountLabel, plan.amount)
                        }}</span>
                        <em>{{ plan.name }}</em>
                        <b>{{ formatResetExtra(plan.extra) }}</b>
                    </div>

                    <div class="deposit-title">
                        {{ $t("guide_reset_advance_title") }}
                    </div>
                    <div class="deposit-head">
                        <span>{{ $t("guide_reset_advance_day_title") }}</span
                        ><span>{{ $t("guide_reset_advance_bonus") }}</span>
                    </div>
                    <div
                        v-for="(item, index) in resetAdvanceRows"
                        :key="`deposit-row-${index}`"
                        class="deposit-row"
                    >
                        <span>{{ formatResetRange(item.range) }}</span>
                        <b>{{ formatResetBonusRate(item.bonus) }}</b>
                    </div>
                </div>
            </section>

            <section class="guide-section daily-section">
                <h2>{{ guideSectionTitle(2, "Daily Profits") }}</h2>
                <p class="section-subtitle">{{ dailyProfitSubtitle }}</p>
                <div class="white-panel daily-panel">
                    <p class="panel-copy" v-html="guideSectionContent(2)"></p>
                    <div
                        v-for="item in vipRates"
                        :key="item.label"
                        class="rate-row"
                    >
                        <span>{{ item.label }}</span>
                        <div class="rate-track">
                            <i :style="{ width: item.width }"></i>
                        </div>
                        <b>{{ item.rate }}</b>
                    </div>
                </div>
            </section>

            <button class="guide-upgrade" type="button" @click="goVips">
                {{ vipProfitButton }}
            </button>
        </main>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t, tm } = useI18n();

const incomeGuideSections = computed(() => {
    const sections = tm("income_guide_sections");
    return Array.isArray(sections) ? sections : [];
});

const guideSection = (index) => incomeGuideSections.value[index] || {};

const stripGuideTitleNumber = (title = "") => {
    return String(title).replace(/^\s*(?:\(\d+\)|\d+[).])\s*/, "");
};

const guideSectionTitle = (index, fallback) => {
    const title = stripGuideTitleNumber(guideSection(index).title || fallback);
    return `(${index + 1}) ${title}`;
};

const guideSectionContent = (index) => {
    return guideSection(index).content || "";
};

const compactCurrencyText = (value = "") => {
    return String(value)
        .replace(/USD\s*/gi, "$")
        .replace(/\$\s+/g, "$")
        .replace(/:\s+/g, ": ")
        .trim();
};

const formatResetAmount = (label = "Amount", amount = "") => {
    return `${label}: ${compactCurrencyText(amount)}`;
};

const formatResetExtra = (value = "") => {
    const text = compactCurrencyText(value);
    return text && !text.startsWith("+") ? `+${text}` : text;
};

const formatResetRange = (value = "") => {
    return compactCurrencyText(value);
};

const formatResetBonusRate = (value = "") => {
    return String(value)
        .replace(/\s*advance\s+bonus\s*/gi, "")
        .trim();
};

const salaryRows = computed(() => [
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
]);

const resetPlans = computed(() => [
    {
        name: t("guide_reset_plan_1_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_1_amount"),
        extra: t("guide_reset_plan_1_extra"),
    },
    {
        name: t("guide_reset_plan_2_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_2_amount"),
        extra: t("guide_reset_plan_2_extra"),
    },
    {
        name: t("guide_reset_plan_3_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_3_amount"),
        extra: t("guide_reset_plan_3_extra"),
    },
    {
        name: t("guide_reset_plan_4_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_4_amount"),
        extra: t("guide_reset_plan_4_extra"),
    },
    {
        name: t("guide_reset_plan_5_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_5_amount"),
        extra: t("guide_reset_plan_5_extra"),
    },
    {
        name: t("guide_reset_plan_6_name"),
        amountLabel: t("guide_reset_amount_label"),
        amount: t("guide_reset_plan_6_amount"),
        extra: t("guide_reset_plan_6_extra"),
    },
]);

const resetAdvanceRows = computed(() => [
    {
        range: t("guide_reset_range_1500_9999"),
        bonus: t("guide_reset_bonus_4"),
        suffix: t("guide_reset_advance_bonus"),
    },
    {
        range: t("guide_reset_range_10000_19999"),
        bonus: t("guide_reset_bonus_8"),
        suffix: t("guide_reset_advance_bonus"),
    },
    {
        range: t("guide_reset_range_20000_49999"),
        bonus: t("guide_reset_bonus_4"),
        suffix: t("guide_reset_advance_bonus"),
    },
    {
        range: t("guide_reset_range_50000_above"),
        bonus: t("guide_reset_bonus_4"),
        suffix: t("guide_reset_advance_bonus"),
    },
]);

const vipRates = computed(() => {
    const rows = guideSection(2).vipProfitRates?.rows;
    if (Array.isArray(rows) && rows.length) {
        return rows.map((row) => ({
            label: row.level,
            width: row.progress || "0%",
            rate: row.rate,
        }));
    }

    return [
        { label: "VIP 1", width: "20%", rate: "0.5%" },
        { label: "VIP 2", width: "35%", rate: "1%" },
        { label: "VIP 3", width: "50%", rate: "1.5%" },
        { label: "VIP 4", width: "65%", rate: "2%" },
        { label: "VIP 5", width: "80%", rate: "2.5%" },
    ];
});

const dailyProfitSubtitle = computed(() => {
    return (
        guideSection(2).subtitle ||
        "0.5% - 2.5% Of Product Price Per Optimization"
    );
});

const vipProfitButton = computed(() => {
    return (
        guideSection(2).vipProfitRates?.button || "Upgrade VIP to Earn More →"
    );
});

const goVips = () => {
    router.push({ path: "/vips" });
};

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.algofy-guide-page {
    min-height: 100vh;
    background: #f0f2f8;
    color: #111;
    font-family: inherit;
}

.design-topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    height: 52px;
    display: grid;
    grid-template-columns: 56px 1fr 56px;
    align-items: center;
    background: #030303;
    color: #fff;
}

.design-title {
    text-align: center;
    font-size: 13px;
    line-height: 18px;
    font-weight: 800;
    letter-spacing: 0.02em;
}

.design-back {
    width: 52px;
    height: 52px;
    border: 0;
    background: transparent;
    position: relative;
}

.design-back::before {
    content: "";
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

.guide-content {
    padding: 12px 15px 25px;
}

.guide-intro-card {
    min-height: 226px;
    padding: 23px 23px 18px;
    border-radius: 5px;
    background: linear-gradient(135deg, #24419c 0%, #438dff 100%);
    color: #fff;
    box-shadow: 0 2px 6px rgba(44, 82, 177, 0.35);
}

.intro-eyebrow {
    font-size: 12px;
    line-height: 15px;
    opacity: 0.9;
    letter-spacing: 0.01em;
    margin-bottom: 18px;
}

.guide-intro-card h1 {
    margin: 0 0 15px;
    font-size: 24px;
    line-height: 31px;
    font-weight: 800;
}

.guide-intro-card p {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.86);
}

.guide-section {
    margin-top: 18px;
}

.guide-section h2 {
    margin: 0 0 2px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 800;
    color: #111;
}

.section-subtitle {
    margin: 0 0 14px;
    font-size: 12px;
    line-height: 16px;
    color: #7e8796;
    font-weight: 600;
}

.white-panel {
    background: #fff;
    border-radius: 7px;
    padding: 17px 15px;
}

.panel-copy {
    margin: 0 0 22px;
    font-size: 14px;
    line-height: 21px;
    color: #667080;
    font-weight: 600;
}

.salary-panel {
    padding-bottom: 10px;
}

.salary-row,
.bonus-row,
.deposit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ee;
}

.salary-row {
    min-height: 50px;
    font-size: 13px;
    color: #333b48;
    font-weight: 800;
}

.salary-row:last-child,
.deposit-row:last-child {
    border-bottom: 0;
}

.salary-row b,
.deposit-row b,
.bonus-row b {
    color: #3264f5;
    font-weight: 900;
}

.reset-title {
    margin: 0 0 12px;
    color: #333b48;
    font-size: 13px;
    font-weight: 800;
}

.bonus-row {
    min-height: 52px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto max-content;
    column-gap: 10px;
    align-items: center;
    color: #3d4653;
    font-size: 13px;
    font-weight: 800;
}

.bonus-row span {
    min-width: 0;
    white-space: nowrap;
}

.bonus-row em {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 58px;
    max-width: 110px;
    height: 22px;
    padding: 0 8px;
    border-radius: 4px;
    background: #3345f5;
    color: #fff;
    font-size: 10px;
    line-height: 12px;
    font-style: normal;
    font-weight: 500;
    white-space: nowrap;
}

.bonus-row b {
    text-align: right;
    white-space: nowrap;
}

.bonus-row-last {
    border-bottom: 0;
}

.deposit-title {
    margin: 22px 0 12px;
    color: #333b48;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
}

.deposit-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
}

.deposit-head span {
    height: 32px;
    border-radius: 3px;
    background: #3345f5;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
}

.deposit-row {
    min-height: 51px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
    color: #667080;
    font-weight: 800;
}

.deposit-row span,
.deposit-row b {
    white-space: nowrap;
}

.deposit-row b {
    flex-shrink: 0;
    text-align: right;
}

.daily-section {
    margin-top: 21px;
}

.daily-panel {
    padding-bottom: 15px;
}

.daily-panel .panel-copy {
    margin-bottom: 19px;
}

.rate-row {
    display: grid;
    grid-template-columns: 48px 1fr 42px;
    align-items: center;
    gap: 10px;
    min-height: 31px;
    color: #424b58;
    font-size: 13px;
    font-weight: 900;
}

.rate-track {
    height: 7px;
    border-radius: 999px;
    background: #e1e4eb;
    overflow: hidden;
}

.rate-track i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #3445f3;
}

.rate-row b {
    text-align: right;
    color: #3445f3;
    font-weight: 900;
}

.guide-upgrade {
    width: 100%;
    height: 51px;
    margin-top: 18px;
    border: 0;
    border-radius: 6px;
    background: #3445f3;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 3px 6px rgba(45, 72, 214, 0.28);
}
</style>
