<template>
    <div class="vip-page min-h-[100vh] bg-[#f5faf6] text-[#14351f]">
        <main class="pb-[18px] pt-0">
            <section
                class="vip-hero relative overflow-hidden bg-gradient-to-br from-[#28bd60] to-[#0a8431] px-[22px] py-[34px] text-center text-white"
            >
                <div class="vip-bubble vip-bubble--top"></div>
                <div class="vip-bubble vip-bubble--bottom"></div>
                <div class="relative z-[1]">
                    <img
                        :src="vipIcons.crownLarge"
                        class="mx-auto h-[52px] w-[52px]"
                        alt=""
                    />
                    <h1
                        class="mt-[14px] text-[22px] font-semibold leading-[1.2] tracking-[0.5px]"
                    >
                        {{ $t("vip_five_star_title") }}
                    </h1>
                    <p
                        class="mx-auto mt-[14px] max-w-[280px] text-[12px] font-medium leading-[20px] text-white/90"
                    >
                        {{ $t("vip_five_star_desc") }}
                    </p>
                    <div
                        class="mx-auto mt-[18px] inline-flex min-w-[170px] items-center justify-center rounded-full bg-white/20 px-[18px] py-[8px] text-[12px] font-semibold"
                    >
                        <img
                            :src="vipIcons.user"
                            class="mr-[6px] h-[13px] w-[13px]"
                            alt=""
                        />
                        {{ $t("current_level") }}: {{ currentLevelName }}
                    </div>
                </div>
            </section>

            <section class="mt-[16px] px-[20px]">
                <h2
                    class="flex items-center text-[14px] font-medium text-[#152b1b]"
                >
                    <img
                        :src="vipIcons.star"
                        class="mr-[8px] h-[16px] w-[16px]"
                        alt=""
                    />
                    {{ $t("vip_universal_benefits") }}
                </h2>
                <div
                    class="mt-[12px] rounded-[9px] border border-[#d9eadc] bg-white px-[13px] py-[13px]"
                >
                    <div
                        v-for="item in benefitCards"
                        :key="item.title"
                        class="benefit-row"
                    >
                        <div class="benefit-icon">
                            <img
                                :src="item.icon"
                                class="h-[16px] w-[16px]"
                                alt=""
                            />
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-[12px] font-medium text-[#111]">
                                {{ item.title }}
                            </div>
                            <div
                                class="mt-[6px] text-[10px] leading-[17px] text-[#6b8b73]"
                            >
                                {{ item.desc }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mt-[18px] px-[20px]">
                <h2
                    class="flex items-center text-[14px] font-medium text-[#152b1b]"
                >
                    <img
                        :src="vipIcons.crownSmall"
                        class="mr-[8px] h-[11px] w-[11px]"
                        alt=""
                    />
                    {{ $t("vip_level_details_all_expanded") }}
                </h2>

                <div class="mt-[12px] space-y-[14px]">
                    <article
                        v-for="(item, index) in displayLevels"
                        :key="item.id || item.nameEn || index"
                        class="vip-card overflow-hidden border bg-white"
                        :class="vipCardBorderClass(item, index)"
                    >
                        <div
                            class="vip-card-head relative overflow-hidden px-[14px] py-[17px] text-white"
                            :class="cardTheme(index).headClass"
                        >
                            <div class="vip-card-bubble"></div>
                            <div
                                v-if="isCurrentLevel(item, index)"
                                class="absolute right-[14px] top-[12px] rounded-full bg-white/20 px-[8px] py-[3px] text-[8px] font-bold uppercase tracking-[0.5px]"
                            >
                                {{ $t("current") }}
                            </div>
                            <div
                                v-else-if="index === displayLevels.length - 1"
                                class="absolute right-[14px] top-[12px] rounded-full bg-white/20 px-[10px] py-[3px] text-[8px] font-bold uppercase tracking-[0.5px]"
                            >
                                {{ $t("top") }}
                            </div>
                            <div class="relative z-[1] flex items-center">
                                <div class="vip-medal">
                                    <img
                                        :src="medalIcon(item, index)"
                                        class="vip-medal-img"
                                        alt=""
                                    />
                                </div>
                                <div class="ml-[13px] min-w-0">
                                    <div
                                        class="text-[20px] font-medium leading-[24px]"
                                    >
                                        {{ normalizeLevelName(item, index) }}
                                    </div>
                                    <div
                                        class="mt-[8px] text-[10px] leading-[14px] text-white/85"
                                    >
                                        {{ $t("min_deposit") }}:${{
                                            formatDeposit(item, index)
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 bg-white">
                            <div
                                v-for="stat in levelStats(item, index)"
                                :key="stat.label"
                                class="vip-stat"
                                :class="cardTheme(index).statTextClass"
                            >
                                <img
                                    :src="stat.icon"
                                    class="vip-stat-icon"
                                    alt=""
                                />
                                <div
                                    class="mt-[8px] text-[18px] leading-[22px]"
                                >
                                    {{ stat.value }}
                                </div>
                                <div
                                    class="mt-[2px] text-[9px] leading-[12px] text-[#6f8a76]"
                                >
                                    {{ stat.label }}
                                </div>
                            </div>
                        </div>

                        <div class="px-[14px] pb-[14px] pt-[14px]">
                            <div
                                class="text-[10px] font-medium uppercase leading-[14px] tracking-[2px] text-[#67846f]"
                            >
                                {{ $t("included_features") }}
                            </div>
                            <div class="mt-[10px] space-y-[9px]">
                                <div
                                    v-for="feature in includedFeatures(index)"
                                    :key="feature"
                                    class="flex items-start text-[12px] leading-[17px] text-[#111]"
                                >
                                    <img
                                        :src="featureCheckIcon(index)"
                                        class="vip-feature-icon mr-[8px] mt-[2px] shrink-0"
                                        alt=""
                                    />
                                    <span>{{ feature }}</span>
                                </div>
                            </div>

                            <div
                                v-if="index === displayLevels.length - 1"
                                class="mt-[14px] rounded-[6px] border border-[#efc76a] bg-[#fff7df] px-[12px] py-[12px] text-center text-[11px] leading-[18px] text-[#7a4b00]"
                            >
                                {{
                                    $t("vip5_exclusive_desc", {
                                        level: highestLevelName,
                                    })
                                }}
                            </div>

                            <button
                                v-if="shouldShowLevelButton(item, index)"
                                class="vip-level-button mt-[14px] h-[36px] w-full rounded-[7px] text-[12px] font-medium text-white"
                                :class="levelButtonClass(item, index)"
                                :disabled="isLevelButtonDisabled(item, index)"
                                type="button"
                                @click="handleLevelButtonClick(item, index)"
                            >
                                <template v-if="isCurrentLevel(item, index)">
                                    <span
                                        class="inline-flex items-center justify-center"
                                    >
                                        <img
                                            :src="vipIcons.currentLevel"
                                            class="mr-[6px] h-[12px] w-[12px] shrink-0"
                                            alt=""
                                        />
                                        {{ $t("your_current_level") }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{
                                        $t("upgrade_to_level", {
                                            level: normalizeLevelName(
                                                item,
                                                index,
                                            ),
                                        })
                                    }}
                                    <span class="ml-[10px]">→</span>
                                </template>
                            </button>
                        </div>
                    </article>

                    <div
                        v-if="!displayLevels.length && loaded"
                        class="rounded-[10px] border border-[#c7ead0] bg-white px-[16px] py-[28px] text-center text-[13px] text-[#6b8b73]"
                    >
                        {{ $t("no_vip_level_data") }}
                    </div>
                </div>
            </section>

            <section v-if="displayLevels.length" class="mt-[18px] px-[20px]">
                <h2
                    class="flex items-center text-[14px] font-medium text-[#152b1b]"
                >
                    <img :src="vipIcons.vip12" class="mr-[8px]" />
                    {{ $t("level_up_comparison_table") }}
                </h2>
                <div
                    class="mt-[24px] overflow-hidden rounded-[8px] border border-[#c9e8d2] bg-white"
                >
                    <div
                        class="grid grid-cols-4 bg-[#21b756] py-[11px] text-center text-[10px] font-medium text-white"
                    >
                        <div>VIP</div>
                        <div>{{ $t("rebate") }}</div>
                        <div>{{ $t("product_plus") }}</div>
                        <div>{{ $t("daily_limit") }}</div>
                    </div>

                    <div
                        v-for="(item, index) in displayLevels"
                        :key="`table-${item.id || index}`"
                        class="grid grid-cols-4 border-t border-[#d9eadf] py-[13px] text-center text-[10px] text-[#234a2f]"
                    >
                        <div class="flex items-center justify-center">
                            <span
                                v-if="index === 0"
                                class="inline-flex min-w-[34px] items-center justify-center rounded-full bg-[#159947] px-[7px] py-[2px] text-center text-[8px] font-bold text-white"
                            >
                                {{ normalizeLevelName(item, index) }}
                            </span>

                            <span v-else class="block w-full text-center">
                                {{ normalizeLevelName(item, index) }}
                            </span>
                        </div>

                        <div
                            class="flex items-center justify-center text-[#159947]"
                        >
                            {{
                                $t("rate_per_task", { rate: formatRate(item) })
                            }}
                        </div>

                        <div class="flex items-center justify-center">
                            {{ formatProductCount(item, index) }}
                        </div>

                        <div class="flex items-center justify-center">
                            {{
                                $t("unit_count", {
                                    count: formatTaskCount(item, index),
                                })
                            }}
                        </div>
                    </div>
                </div>
                <p
                    class="mx-auto mt-[8px] max-w-[250px] text-center text-[9px] leading-[15px] text-[#708a76]"
                >
                    {{ $t("vip_upgrade_rule") }}
                </p>
            </section>

            <section v-if="showVipUpgradeCard" class="mt-[18px] px-[20px]">
                <div
                    class="vip-upgrade-card relative overflow-hidden bg-gradient-to-br from-[#1fb658] to-[#078331] px-[24px] py-[28px] text-center text-white"
                >
                    <div class="vip-bubble vip-bubble--upgrade"></div>
                    <div class="relative z-[1]">
                        <img
                            :src="vipIcons.rocketf"
                            class="mx-auto h-[30px] w-[30px]"
                            alt=""
                        />
                        <div class="mt-[18px] text-[18px] font-medium">
                            {{ $t("ready_to_upgrade") }}
                        </div>
                        <p
                            class="mx-auto mt-[12px] max-w-[250px] text-[11px] leading-[20px] text-white/88"
                        >
                            {{ $t("recharge_unlock_vip") }}
                        </p>
                        <button
                            class="upgrade-cta mt-[20px] h-[40px] w-[206px] rounded-[9px] bg-white text-[13px] font-medium text-[#178c3c]"
                            type="button"
                            @click="goDeposit"
                        >
                            <span class="upgrade-cta__icon" aria-hidden="true">
                                <img
                                    :src="vipIcons.userbottom"
                                    class="upgrade-cta__icon-img"
                                    alt=""
                                />
                            </span>
                            <span>{{ $t("recharge_to_upgrade_vip") }}</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getLevel } from "@/api/apis";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const levelList = ref([]);
const loaded = ref(false);

const vipIcons = {
    crownLarge: new URL(
        "@/static/images/design/vip-crown-large.png",
        import.meta.url,
    ).href,
    crownSmall: new URL(
        "@/static/images/design/vip-crown-small.png",
        import.meta.url,
    ).href,
    rocket: new URL("@/static/images/design/vip-rocket.png", import.meta.url)
        .href,
    rocketf: new URL("@/static/images/design/vip-rocketf.png", import.meta.url)
        .href,
    check: new URL("@/static/images/design/vip-check.png", import.meta.url)
        .href,
    star: new URL("@/static/images/design/vip-star.png", import.meta.url).href,
    userbottom: new URL(
        "@/static/images/design/userbottom.png",
        import.meta.url,
    ).href,
    user: new URL("@/static/images/design/vip-user.png", import.meta.url).href,
    level1: new URL("@/static/images/design/vip-level-1.png", import.meta.url)
        .href,
    level2: new URL("@/static/images/design/vip-level-2.png", import.meta.url)
        .href,
    level3: new URL("@/static/images/design/vip-level-3.png", import.meta.url)
        .href,
    currentLevel: new URL(
        "@/static/images/design/vip-current-level-icon.png",
        import.meta.url,
    ).href,
    vip11: new URL("@/static/images/design/vip11.png", import.meta.url).href,
    vip12: new URL("@/static/images/design/vip12.png", import.meta.url).href,
    vip13: new URL("@/static/images/design/vip13.png", import.meta.url).href,
    vip14: new URL("@/static/images/design/vip14.png", import.meta.url).href,
    vip21: new URL("@/static/images/design/vip21.png", import.meta.url).href,
    vip22: new URL("@/static/images/design/vip22.png", import.meta.url).href,
    vip23: new URL("@/static/images/design/vip23.png", import.meta.url).href,
    vip24: new URL("@/static/images/design/vip24.png", import.meta.url).href,
    vip31: new URL("@/static/images/design/vip31.png", import.meta.url).href,
    vip32: new URL("@/static/images/design/vip32.png", import.meta.url).href,
    vip33: new URL("@/static/images/design/vip33.png", import.meta.url).href,
    vip34: new URL("@/static/images/design/vip34.png", import.meta.url).href,
};

const benefitCards = computed(() => [
    {
        icon: new URL("@/static/images/auth/auth-trade.png", import.meta.url)
            .href,
        title: t("vip_data_security"),
        desc: t("vip_data_security_desc"),
    },
    {
        icon: new URL("@/static/images/user-invite.png", import.meta.url).href,
        title: t("vip_referral_bonus"),
        desc: t("vip_referral_bonus_desc"),
    },
    {
        icon: vipIcons.rocket,
        title: t("vip_instant_commission"),
        desc: t("vip_instant_commission_desc"),
    },
    {
        icon: vipIcons.star,
        title: t("vip_event_access"),
        desc: t("vip_event_access_desc"),
    },
]);

const levelFallbacks = [
    { nameEn: "VIP1", commissionRatio: 0.5, orderCount: 80, price: 50 },
    { nameEn: "VIP2", commissionRatio: 1, orderCount: 90, price: 200 },
    { nameEn: "VIP3", commissionRatio: 1.5, orderCount: 100, price: 500 },
    { nameEn: "VIP4", commissionRatio: 2, orderCount: 110, price: 1500 },
    { nameEn: "VIP5", commissionRatio: 2.5, orderCount: 120, price: 5000 },
];

const featureGroups = computed(() => [
    [
        t("vip_feature_full_access"),
        t("vip_feature_premium_unlocked"),
        t("vip_feature_invite_team"),
        t("vip_feature_deposit_rebate"),
        t("vip_feature_optimized_income"),
    ],
    [
        t("vip_feature_all_vip1"),
        t("vip_feature_double_rebate"),
        t("vip_feature_priority_queue"),
        t("vip_feature_invite_team"),
        t("vip_feature_deposit_rebate"),
    ],
    [
        t("vip_feature_all_vip2"),
        t("vip_feature_high_value_tasks"),
        t("vip_feature_fast_withdrawal_2_days"),
        t("vip_feature_invite_team"),
        t("vip_feature_deposit_rebate"),
    ],
    [
        t("vip_feature_all_vip3"),
        t("vip_feature_account_manager"),
        t("vip_feature_one_day_withdrawal"),
        t("vip_feature_vip4_pools"),
        t("vip_feature_deposit_rebate"),
    ],
    [
        t("vip_feature_all_vip4"),
        t("vip_feature_highest_rebate"),
        t("vip_feature_same_day_withdrawal"),
        t("vip_feature_top_support"),
        t("vip_feature_vip5_pools"),
    ],
]);

const themes = [
    {
        headClass: "bg-gradient-to-br from-[#2ec363] to-[#0a8934]",
        borderClass: "border-[#159947]",
        statColor: "#19a653",
        statTextClass: "text-[#159947]",
        buttonClass: "bg-[#159947]",
    },
    {
        headClass: "bg-gradient-to-br from-[#62bbea] to-[#2787d7]",
        borderClass: "border-[#2787d7]",
        statColor: "#349be0",
        statTextClass: "text-[#349be0]",
        buttonClass: "bg-[#2b8fde]",
    },
    {
        headClass: "bg-gradient-to-br from-[#ff6656] to-[#dd3426]",
        borderClass: "border-[#dd3426]",
        statColor: "#ef4b3d",
        statTextClass: "text-[#ef4b3d]",
        buttonClass: "bg-[#e03a2b]",
    },
    {
        headClass: "bg-gradient-to-br from-[#f4bb2e] to-[#d68d0f]",
        borderClass: "border-[#d68d0f]",
        statColor: "#e39a18",
        statTextClass: "text-[#e39a18]",
        buttonClass: "bg-[#d99114]",
    },
];

const currentLevelName = computed(() => {
    return (
        userStore.userInfo?.userLevel?.nameEn ||
        userStore.userInfo?.levelName ||
        "VIP1"
    );
});

const currentLevelId = computed(() => userStore.userInfo?.levelId);

const hasCurrentLevel = computed(() =>
    Boolean(
        currentLevelId.value ||
        userStore.userInfo?.userLevel?.nameEn ||
        userStore.userInfo?.levelName,
    ),
);

const displayLevels = computed(() =>
    levelList.value.length ? levelList.value : levelFallbacks,
);

const currentLevelNumber = computed(() =>
    getLevelNumericValue(currentLevelName.value),
);

const currentLevelIdNumber = computed(() => {
    const value = Number(currentLevelId.value);
    return Number.isNaN(value) ? 0 : value;
});

const highestDisplayLevelNumber = computed(() => {
    const levels = displayLevels.value || [];
    const numbers = levels
        .map((item, index) =>
            getLevelNumericValue(normalizeLevelName(item, index)),
        )
        .filter((num) => num > 0);

    if (!numbers.length) return levels.length;
    return Math.max(...numbers);
});

const highestDisplayLevelId = computed(() => {
    const ids = (displayLevels.value || [])
        .map((item) => Number(item?.id))
        .filter((id) => !Number.isNaN(id) && id > 0);

    return ids.length ? Math.max(...ids) : 0;
});

const isCurrentLevelIdAboveDisplay = computed(() => {
    if (!currentLevelIdNumber.value) return false;
    if (!highestDisplayLevelId.value) return false;

    return currentLevelIdNumber.value > highestDisplayLevelId.value;
});

const isCurrentLevelNumberAboveDisplay = computed(() => {
    if (!currentLevelNumber.value) return false;
    if (!highestDisplayLevelNumber.value) return false;

    return currentLevelNumber.value > highestDisplayLevelNumber.value;
});

const isCurrentLevelAboveDisplay = computed(() => {
    if (!hasCurrentLevel.value) return false;
    if (!displayLevels.value.length) return false;

    return (
        isCurrentLevelIdAboveDisplay.value ||
        isCurrentLevelNumberAboveDisplay.value
    );
});

const matchedCurrentLevelIndex = computed(() => {
    const levels = displayLevels.value || [];

    if (isCurrentLevelAboveDisplay.value) {
        return -1;
    }

    const byIdIndex = levels.findIndex(
        (item) =>
            currentLevelId.value &&
            item?.id &&
            String(currentLevelId.value) === String(item.id),
    );
    if (byIdIndex >= 0) return byIdIndex;

    if (currentLevelNumber.value > 0) {
        return levels.findIndex(
            (item, index) =>
                getLevelNumericValue(normalizeLevelName(item, index)) ===
                currentLevelNumber.value,
        );
    }

    return -1;
});

const currentLevelIndex = computed(() => {
    if (isCurrentLevelAboveDisplay.value) {
        return displayLevels.value.length;
    }

    if (matchedCurrentLevelIndex.value >= 0) {
        return matchedCurrentLevelIndex.value;
    }

    if (currentLevelNumber.value > 0) {
        return currentLevelNumber.value - 1;
    }

    return 0;
});

const highestLevelIndex = computed(() =>
    Math.max(displayLevels.value.length - 1, 0),
);

const highestLevelName = computed(() => {
    const index = highestLevelIndex.value;
    return normalizeLevelName(displayLevels.value[index], index);
});

const isCurrentHighestLevel = computed(() => {
    if (!hasCurrentLevel.value) return false;
    if (isCurrentLevelAboveDisplay.value) return true;

    return currentLevelIndex.value >= highestLevelIndex.value;
});

const showVipUpgradeCard = computed(
    () => displayLevels.value.length > 0 && !isCurrentHighestLevel.value,
);

const vipLevelIconSets = [
    {
        medal: vipIcons.level2,
        stats: [vipIcons.vip12, vipIcons.vip13, vipIcons.vip14],
        check: vipIcons.vip11,
    },
    {
        medal: vipIcons.level3,
        stats: [vipIcons.vip22, vipIcons.vip23, vipIcons.vip24],
        check: vipIcons.vip21,
    },
    {
        medal: vipIcons.level1,
        stats: [vipIcons.vip32, vipIcons.vip33, vipIcons.vip34],
        check: vipIcons.vip31,
    },
];

function normalizeLevelName(item, index) {
    return item?.nameEn || item?.name || `VIP${index + 1}`;
}

function getLevelNumericValue(value) {
    const match = String(value || "").match(/\d+/);
    return match ? Number(match[0]) : 0;
}

function shouldShowLevelButton() {
    return true;
}

function isLevelButtonDisabled(item, index) {
    if (isCurrentLevel(item, index)) return true;
    if (isCurrentLevelAboveDisplay.value) return true;

    return index <= currentLevelIndex.value;
}

function levelButtonClass(item, index) {
    if (isCurrentLevel(item, index)) {
        return "bg-[#edf7f0] !text-[#159947] border border-[#b7dec1]";
    }

    if (isLevelButtonDisabled(item, index)) {
        return "vip-level-button--disabled";
    }

    return cardTheme(index).buttonClass;
}

function handleLevelButtonClick(item, index) {
    if (isLevelButtonDisabled(item, index)) return;

    goDeposit();
}

function goDeposit() {
    router.push({ path: "/deposit" });
}

function isCurrentLevel(item, index) {
    if (!hasCurrentLevel.value) return false;
    if (isCurrentLevelAboveDisplay.value) return false;

    if (currentLevelId.value && item?.id) {
        return String(currentLevelId.value) === String(item.id);
    }

    return index === currentLevelIndex.value;
}

function formatRate(item) {
    const value = item?.commissionRatio ?? item?.rebateRatio ?? item?.rate ?? 0;
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `${value}`;
    return `${numeric}%`;
}

function formatTaskCount(item, index) {
    return (
        item?.orderCount ??
        item?.taskCount ??
        item?.maxOrderCount ??
        80 + index * 10
    );
}

function formatProductCount(item, index) {
    return (
        item?.productCount ??
        item?.goodsCount ??
        item?.incomeCount ??
        40 + index * 5
    );
}

function formatDeposit(item, index) {
    return item?.price ?? item?.minDeposit ?? levelFallbacks[index]?.price ?? 0;
}

function cardTheme(index) {
    return themes[index] || themes[themes.length - 1];
}

function vipCardBorderClass(item, index) {
    return [
        cardTheme(index).borderClass,
        isCurrentLevel(item, index) ? "vip-card--current" : "",
    ];
}

function getVipIconSet(item, index) {
    const numericLevel = Math.max(
        getLevelNumericValue(normalizeLevelName(item, index)) - 1,
        0,
    );
    return (
        vipLevelIconSets[numericLevel] ||
        vipLevelIconSets[index] ||
        vipLevelIconSets[vipLevelIconSets.length - 1]
    );
}

function medalIcon(item, index) {
    return getVipIconSet(item, index)?.medal || vipIcons.crownSmall;
}

function featureCheckIcon(index) {
    return (
        getVipIconSet(displayLevels.value[index], index)?.check ||
        vipIcons.check
    );
}

function includedFeatures(index) {
    const taskCount = formatTaskCount(displayLevels.value[index], index);
    return [
        ...(featureGroups.value[index] || featureGroups.value[0]),
        t("daily_task_submission_quota", { count: taskCount }),
    ];
}

function levelStats(item, index) {
    const iconSet = getVipIconSet(item, index);
    return [
        {
            icon: iconSet?.stats?.[0] || vipIcons.star,
            value: formatRate(item),
            label: t("rebate_task"),
        },
        {
            icon: iconSet?.stats?.[1] || vipIcons.rocket,
            value: `$${formatProductCount(item, index)}`,
            label: t("product_income"),
        },
        {
            icon: iconSet?.stats?.[2] || vipIcons.user,
            value: formatTaskCount(item, index),
            label: t("daily_tasks"),
        },
    ];
}

async function loadLevels() {
    loaded.value = false;
    try {
        const res = await getLevel();
        levelList.value = Array.isArray(res?.data) ? res.data : [];
    } finally {
        loaded.value = true;
    }
}

onMounted(() => {
    if (userStore.token) {
        userStore.getUserInfo();
    }
    loadLevels();
});
</script>

<style scoped>
.vip-page {
    font-family: "Montserrat", "Poppins", sans-serif;
    width: 100%;
    overflow-x: hidden;
}

.vip-hero {
    min-height: 236px;
    border-radius: 0;
    width: 100%;
}

.vip-bubble,
.vip-card-bubble {
    position: absolute;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
}

.vip-bubble--top {
    right: -22px;
    top: -43px;
    height: 128px;
    width: 128px;
}

.vip-bubble--bottom {
    bottom: -28px;
    left: -28px;
    height: 86px;
    width: 86px;
}

.vip-bubble--upgrade {
    right: -26px;
    top: -40px;
    height: 104px;
    width: 104px;
}

.benefit-row {
    display: flex;
    align-items: flex-start;
    padding: 4px 0;
}

.benefit-row + .benefit-row {
    margin-top: 6px;
}

.benefit-icon {
    margin-right: 12px;
    display: flex;
    height: 36px;
    width: 36px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: #eef8f1;
}

.benefit-icon img {
    object-fit: contain;
}

.vip-card {
    border-width: 1px;
    border-radius: 12px;
}

.vip-card--current {
    border-width: 2px;
}

.vip-card-head {
    min-height: 77px;
}

.vip-card-bubble {
    right: -22px;
    top: -32px;
    height: 94px;
    width: 94px;
}

.vip-medal {
    position: relative;
    display: flex;
    height: 48px;
    width: 48px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.vip-medal-num {
    position: absolute;
    bottom: 6px;
    left: 50%;
    min-width: 14px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: rgba(150, 99, 35, 0.72);
    padding: 1px 4px;
    font-size: 8px;
    font-weight: 700;
    line-height: 10px;
}

.vip-stat {
    min-height: 74px;
    border-right: 1px solid #d9eadf;
    padding: 14px 4px 11px;
    text-align: center;
}

.vip-stat:last-child {
    border-right: 0;
}

.vip-upgrade-card {
    min-height: 212px;
    border-radius: 10px;
}

.vip-medal-img {
    width: 34px;
    height: 34px;
    object-fit: contain;
    display: block;
}

.vip-stat-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    display: inline-block;
    vertical-align: middle;
}

.vip-feature-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.vip-level-button:disabled {
    cursor: not-allowed;
    pointer-events: none;
}

.vip-level-button--disabled {
    border: 1px solid #cfe3d3;
    background: #edf7f0 !important;
    color: #7b9682 !important;
    opacity: 0.72;
}

.upgrade-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.upgrade-cta__icon {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.upgrade-cta__icon-img {
    width: 12px;
    height: 12px;
    object-fit: contain;
    display: block;
}

.upgrade-cta__icon-inner {
    color: #178c3c;
    font-size: 14px;
    line-height: 1;
    font-weight: 700;
}
</style>
