<template>
    <div class="vip-page min-h-[100vh] bg-[#f2f4f8] text-[#14351f]">
        <MainTabTopBar :title="$t('vip')" />
        <main class="vip-page__main pb-[24px]">
            <section class="vip-showcase">
                <div class="vip-showcase__card">
                    <div class="vip-showcase__avatar-shell">
                        <img
                            :src="userAvatar"
                            class="vip-showcase__avatar"
                            alt=""
                        />
                    </div>
                    <div class="vip-showcase__badge">
                        <img :src="currentVipBadgeIcon" alt="" />
                    </div>
                    <div class="vip-showcase__name">
                        {{ userStore.userInfo?.username || "Wuhu1" }}
                    </div>
                    <div class="vip-showcase__level">
                        {{ currentLevelName }}
                    </div>
                    <p class="vip-showcase__desc">
                        {{ $t("vip_five_star_desc") }}
                    </p>
                </div>
            </section>

            <section class="mt-[16px] px-[14px]">
                <h2 class="vip-section-title">
                    {{ $t("vip_level_details_all_expanded") }}
                </h2>

                <div class="vip-card-list">
                    <article
                        v-for="(item, index) in displayLevels"
                        :key="item.id || item.nameEn || index"
                        class="vip-card overflow-hidden bg-white"
                        :class="vipCardBorderClass(item, index)"
                        :style="cardThemeStyle(item, index)"
                    >
                        <div
                            class="vip-card-head relative overflow-hidden px-[13px] py-[14px] text-white"
                            :class="cardTheme(item, index).headClass"
                        >
                            <div class="vip-card-bubble"></div>
                            <div
                                v-if="isCurrentLevel(item, index)"
                                class="absolute right-[14px] top-[12px] rounded-full bg-white/20 px-[8px] py-[3px] text-[8px] font-bold uppercase tracking-[0.5px]"
                            >
                                {{ $t("current") }}
                            </div>
                            <!-- <div
                                v-else-if="index === displayLevels.length - 1"
                                class="absolute right-[14px] top-[12px] rounded-full bg-white/20 px-[10px] py-[3px] text-[8px] font-bold uppercase tracking-[0.5px]"
                            >
                                {{ $t("top") }}
                            </div> -->
                            <div class="relative z-[1] flex items-center">
                                <div class="vip-medal">
                                    <img
                                        :src="medalIcon(item, index)"
                                        class="vip-medal-img"
                                        alt=""
                                    />
                                </div>
                                <div class="ml-[11px] min-w-0">
                                    <div
                                        class="text-[15px] font-semibold leading-[18px]"
                                    >
                                        {{ normalizeLevelName(item, index) }}
                                    </div>
                                    <div
                                        class="mt-[2px] text-[9px] leading-[12px] text-white/90"
                                    >
                                        {{ vipSubtitle(item, index) }}
                                    </div>
                                </div>
                            </div>
                            <div class="vip-head-stats relative z-[1]">
                                <div
                                    v-for="stat in levelStats(item, index)"
                                    :key="stat.label"
                                    class="vip-head-stat"
                                >
                                    <div class="vip-head-stat__label">
                                        {{ stat.label }}
                                    </div>
                                    <div class="vip-head-stat__value">
                                        {{ stat.value }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="vip-card-body">
                            <div class="vip-feature-panel">
                                <div
                                    class="text-[10px] font-semibold uppercase leading-[14px] tracking-[1px] text-[#333]"
                                >
                                    {{ $t("included_features") }}
                                </div>
                                <div class="mt-[10px] space-y-[7px]">
                                    <div
                                        v-for="feature in includedFeatures(
                                            index,
                                        )"
                                        :key="feature"
                                        class="flex items-start text-[10px] leading-[15px] text-[#222]"
                                    >
                                        <img
                                            :src="featureCheckIcon(index)"
                                            class="vip-feature-icon mr-[7px] mt-[1px] shrink-0"
                                            alt=""
                                        />
                                        <span>{{ feature }}</span>
                                    </div>
                                </div>

                                <!-- <div
                                    v-if="index === displayLevels.length - 1"
                                    class="mt-[10px] rounded-[8px] border border-[#efc76a] bg-[#fff7df] px-[12px] py-[10px] text-center text-[10px] leading-[16px] text-[#7a4b00]"
                                >
                                    {{
                                        $t("vip5_exclusive_desc", {
                                            level: highestLevelName,
                                        })
                                    }}
                                </div> -->
                            </div>
                            <button
                                v-if="shouldShowLevelButton(item, index)"
                                class="vip-level-button mt-[12px] h-[37px] w-full rounded-[5px] text-[11px] font-semibold text-white"
                                :class="levelButtonClass(item, index)"
                                :disabled="isLevelButtonDisabled(item, index)"
                                type="button"
                                @click="handleLevelButtonClick(item, index)"
                            >
                                <template v-if="isCurrentLevel(item, index)">
                                    <span
                                        class="inline-flex items-center justify-center"
                                    >
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
        </main>
    </div>
</template>

<script setup>
import MainTabTopBar from "@/components/MainTabTopBar.vue";
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
    level2: new URL("@/static/images/design/vip-level-3.png", import.meta.url)
        .href,
    level3: new URL("@/static/images/design/vip-level-2.png", import.meta.url)
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
    vipLevel4: new URL(
        "@/static/images/design/vip-level-4.png",
        import.meta.url,
    ).href,
    designAvatar: new URL(
        "@/static/images/vip_design/avatar.png",
        import.meta.url,
    ).href,
    profileBadge: new URL(
        "@/static/images/vip_design/profile-badge.png",
        import.meta.url,
    ).href,
    designVip1: new URL("@/static/images/vip_design/vip1.png", import.meta.url)
        .href,
    designVip2: new URL("@/static/images/vip_design/vip2.png", import.meta.url)
        .href,
    designVip3: new URL("@/static/images/vip_design/vip3.png", import.meta.url)
        .href,
    designVip4: new URL("@/static/images/vip_design/vip4.png", import.meta.url)
        .href,
    designVip5: new URL("@/static/images/vip_design/vip5.png", import.meta.url)
        .href,
    checkGreen: new URL(
        "@/static/images/vip_design/check-green.png",
        import.meta.url,
    ).href,
    checkBlue: new URL(
        "@/static/images/vip_design/check-blue.png",
        import.meta.url,
    ).href,
    checkOrange: new URL(
        "@/static/images/vip_design/check-orange.png",
        import.meta.url,
    ).href,
    checkRed: new URL(
        "@/static/images/vip_design/check-red.png",
        import.meta.url,
    ).href,
    checkPurple: new URL(
        "@/static/images/vip_design/check-purple.png",
        import.meta.url,
    ).href,
    userFallback: new URL("@/static/images/userImg.png", import.meta.url).href,
};

const levelFallbacks = [
    {
        nameEn: "VIP1",
        commissionRatio: 0.5,
        orderCount: 80,
        price: "$100- 499",
    },
    { nameEn: "VIP2", commissionRatio: 1, orderCount: 90, price: "$500- 1599" },
    {
        nameEn: "VIP3",
        commissionRatio: 1.5,
        orderCount: 100,
        price: "$1600- 5499",
    },
    {
        nameEn: "VIP4",
        commissionRatio: 2,
        orderCount: 110,
        price: "$5500- 9999",
    },
    { nameEn: "VIP5", commissionRatio: 2.5, orderCount: 120, price: "$10000" },
];

const designLevelStats = [
    { deposit: "100-499", rate: 0.5, product: 40, tasks: 80, quota: 90 },
    { deposit: "500-1599", rate: 1, product: 45, tasks: 90, quota: 90 },
    { deposit: "1600-5499", rate: 1.5, product: 50, tasks: 100, quota: 100 },
    { deposit: "5500-9999", rate: 2, product: 55, tasks: 110, quota: 100 },
    { deposit: "10000", rate: 2.5, product: 60, tasks: 120, quota: 120 },
];

const designFeatureGroups = computed(() => [
    [
        t("vip_d_all0"),
        t("vip_d_full"),
        t("vip_d_launch"),
        t("vip_d_deposit"),
        t("vip_d_loss"),
    ],
    [t("vip_d_all1"), t("vip_d_double"), t("vip_d_same3"), t("vip_d_deposit")],
    [
        t("vip_d_all2"),
        t("vip_d_enhanced2"),
        t("vip_d_bonus2"),
        t("vip_d_badge3"),
        t("vip_d_support"),
    ],
    [
        t("vip_d_manager"),
        t("vip_d_withdraw5"),
        t("vip_d_badge4"),
        t("vip_d_rebate1"),
    ],
    [
        t("vip_d_same"),
        t("vip_d_badge5"),
        t("vip_d_support"),
        t("vip_d_legend5"),
    ],
]);

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
        headClass: "bg-gradient-to-br from-[#34be70] to-[#28af64]",
        borderClass: "border-[#159947]",
        headFrom: "#34be70",
        headTo: "#28af64",
        headGradient:
            "linear-gradient(180deg, #34be70 0%, #28af64 56.04%, #ffffff 100%)",
        buttonColor: "#28AF64",
        borderColor: "#159947",
        statColor: "#19a653",
        statTextClass: "text-[#159947]",
        buttonClass: "vip-level-button--theme",
        iconFilter: "none",
    },
    {
        headClass: "bg-gradient-to-br from-[#3181CE] to-[#5BABEA]",
        borderClass: "border-[#2787d7]",
        headFrom: "#3181CE",
        headTo: "#5BABEA",
        headGradient:
            "linear-gradient(180deg, #3181CE 0%, #5BABEA 56.04%, #FFFFFF 100%)",
        buttonColor: "#2C7CCB",
        borderColor: "#2787d7",
        statColor: "#349be0",
        statTextClass: "text-[#349be0]",
        buttonClass: "vip-level-button--theme",
        iconFilter: "none",
    },
    {
        headClass: "bg-gradient-to-br from-[#FFA726] to-[#FD9810]",
        borderClass: "border-[#ff9e2c]",
        headFrom: "#FFA726",
        headTo: "#FD9810",
        headGradient:
            "linear-gradient(180deg, #FFA726 0%, #FD9810 56.67%, #FFFFFF 100%)",
        buttonColor: "#FA9B29",
        borderColor: "#ff9e2c",
        statColor: "#f29a21",
        statTextClass: "text-[#f29a21]",
        buttonClass: "vip-level-button--theme",
        iconFilter: "none",
    },
    {
        headClass: "bg-gradient-to-br from-[#F24A32] to-[#EF7F6F]",
        borderClass: "border-[#dd3426]",
        headFrom: "#F24A32",
        headTo: "#EF7F6F",
        headGradient:
            "linear-gradient(181deg, #F24A32 0%, #EF7F6F 52.71%, #FFFFFF 100%)",
        buttonColor: "#FF634D",
        borderColor: "#dd3426",
        statColor: "#ef4b3d",
        statTextClass: "text-[#ef4b3d]",
        buttonClass: "vip-level-button--theme",
        iconFilter: "none",
    },
    {
        headClass: "bg-gradient-to-br from-[#6131CE] to-[#985BEA]",
        borderClass: "border-[#7340df]",
        headFrom: "#6131CE",
        headTo: "#985BEA",
        headGradient:
            "linear-gradient(180deg, #6131CE 0%, #985BEA 56.04%, #FFFFFF 100%)",
        buttonColor: "#6C39D3",
        borderColor: "#7340df",
        statColor: "#7a48e7",
        statTextClass: "text-[#7a48e7]",
        buttonClass: "vip-level-button--theme",
        iconFilter: "hue-rotate(20deg) saturate(1.1) brightness(1.02)",
    },
];

const currentLevelName = computed(() => {
    return (
        userStore.userInfo?.userLevel?.nameEn ||
        userStore.userInfo?.levelName ||
        "VIP1"
    );
});

const userAvatar = computed(
    () => userStore.userInfo?.avatar || vipIcons.designAvatar,
);

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

const currentVipBadgeIcon = computed(() => {
    switch (currentLevelNumber.value) {
        case 1:
            return vipIcons.designVip1;
        case 2:
            return vipIcons.designVip2;
        case 3:
            return vipIcons.designVip3;
        case 4:
            return vipIcons.designVip4;
        case 5:
            return vipIcons.designVip5;
        default:
            return vipIcons.profileBadge;
    }
});

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
    { medal: vipIcons.designVip1, check: vipIcons.checkGreen },
    { medal: vipIcons.designVip2, check: vipIcons.checkBlue },
    { medal: vipIcons.designVip3, check: vipIcons.checkOrange },
    { medal: vipIcons.designVip4, check: vipIcons.checkRed },
    { medal: vipIcons.designVip5, check: vipIcons.checkPurple },
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
        return "vip-level-button--current";
    }

    if (isLevelButtonDisabled(item, index)) {
        return "vip-level-button--disabled";
    }

    return cardTheme(item, index).buttonClass;
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

function formatRate(item, index = 0) {
    return `${designLevelStats[index]?.rate ?? 0}%`;
}

function formatTaskCount(item, index) {
    return designLevelStats[index]?.tasks ?? 80 + index * 10;
}

function formatProductCount(item, index) {
    return designLevelStats[index]?.product ?? 40 + index * 5;
}

function formatDeposit(item, index) {
    return (
        designLevelStats[index]?.deposit ?? levelFallbacks[index]?.price ?? 0
    );
}

function vipSubtitle(item, index) {
    return `${t("min_deposit")}:$${formatDeposit(item, index)}`;
}

function cardTheme(item, index) {
    const levelNumber = getLevelNumericValue(normalizeLevelName(item, index));

    if (levelNumber > 0 && themes[levelNumber - 1]) {
        return themes[levelNumber - 1];
    }

    return themes[index] || themes[themes.length - 1];
}

function cardThemeStyle(item, index) {
    const theme = cardTheme(item, index);

    return {
        "--vip-head-from": theme.headFrom,
        "--vip-head-to": theme.headTo,
        "--vip-head-gradient": theme.headGradient,
        "--vip-button-color": theme.buttonColor || theme.statColor,
        "--vip-card-border": theme.borderColor,
        "--vip-card-accent": theme.statColor,
        "--vip-card-icon-filter": theme.iconFilter || "none",
    };
}

function vipCardBorderClass(item, index) {
    return [
        cardTheme(item, index).borderClass,
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
    const dailyQuota = formatProductCount(displayLevels.value[index], index);
    return [
        ...(featureGroups.value[index] || featureGroups.value[0]),
        t("daily_task_submission_quota", { count: dailyQuota }),
    ];
}

function levelStats(item, index) {
    const iconSet = getVipIconSet(item, index);
    return [
        {
            icon: iconSet?.stats?.[0] || vipIcons.star,
            value: formatRate(item, index),
            label: t("rebate_task"),
        },
        // {
        //     icon: iconSet?.stats?.[1] || vipIcons.rocket,
        //     value: `$ ${formatProductCount(item, index)}`,
        //     label: t("product_income"),
        // },
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
.vip-page__main {
    padding-top: var(--main-tab-top-bar-height, 104px);
}

.vip-page {
    font-family: "Montserrat", "Poppins", sans-serif;
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    overflow-x: hidden;
    background: #f2f4f8;
    color: #111;
}

.vip-showcase {
    position: relative;
    padding-bottom: 0;
}

.vip-showcase__top {
    position: relative;
    height: 83px;
    overflow: hidden;
    background: #181818 url("@/static/images/auth/algofy-register-hero.png")
        center top / cover no-repeat;
}

.vip-showcase__title {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.2px;
}

.vip-showcase__card {
    position: relative;
    margin: 0;
    padding: 14px 22px 16px;
    min-height: 198px;
    border-radius: 0;
    background: linear-gradient(180deg, #3f8cff 0%, #2d62ee 100%);
    text-align: center;
    color: #fff;
    box-shadow: none;
}

.vip-showcase__card::after {
    content: "";
    position: absolute;
    right: -20px;
    top: -20px;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.vip-showcase__avatar-shell {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
}

.vip-showcase__avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vip-showcase__badge {
    position: absolute;
    top: 80px;
    left: calc(50% + 19px);
    width: 31px;
    height: 31px;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vip-showcase__badge img {
    width: 31px;
    height: 31px;
    object-fit: contain;
}

.vip-showcase__name {
    position: relative;
    z-index: 1;
    margin-top: 3px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 18px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-showcase__level {
    position: relative;
    z-index: 1;
    margin-top: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    line-height: 23px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-showcase__desc {
    position: relative;
    z-index: 1;
    margin: 8px auto 0;
    max-width: 311px;
    font-family: Montserrat, Montserrat;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-section-title {
    display: flex;
    align-items: center;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #374151;
    line-height: 23px;
    text-align: left;
    font-style: normal;
    text-transform: none;
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
    margin-right: 10px;
    display: flex;
    height: 34px;
    width: 34px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #eef8f1;
}

.benefit-icon img {
    object-fit: contain;
}

.vip-card--current {
    box-shadow:
        0 10px 24px rgba(31, 41, 55, 0.08),
        0 0 0 2px rgba(255, 255, 255, 0.9);
}

.vip-card-bubble {
    right: -16px;
    top: -16px;
    height: 86px;
    width: 86px;
}

.vip-medal {
    position: relative;
    display: flex;
    height: 44px;
    width: 44px;
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

.vip-head-stat {
    text-align: left;
}

.vip-card-body {
    padding: 0 0 12px;
}

.vip-feature-panel {
    border-radius: 7px;
    background: #fff;
    margin: 0 16px;
    margin-top: -1px;
    box-shadow: inset 0 0 0 1px #e6edf5;
    padding: 11px 14px 12px;
}

.vip-upgrade-card {
    min-height: 212px;
    border-radius: 12px;
}

.vip-medal-img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    display: block;
    filter: var(--vip-card-icon-filter, none);
}

.vip-feature-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: var(--vip-card-icon-filter, none);
}

.vip-level-button--theme {
    background: var(--vip-button-color) !important;
}

.vip-level-button:disabled {
    cursor: not-allowed;
    pointer-events: none;
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
    width: 14px;
    height: 14px;
    object-fit: contain;
    display: block;
}

.upgrade-cta__icon-inner {
    color: #178c3c;
    font-size: 14px;
    line-height: 1;
    font-weight: 700;
}

.vip-card-list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.vip-card {
    border-width: 0;
    border-color: transparent;
    border-radius: 8px;
    box-shadow: none;
}

.vip-card-head {
    min-height: 114px;
    background: linear-gradient(
        135deg,
        var(--vip-head-from, #2ec363),
        var(--vip-head-to, #0a8934)
    ) !important;
    padding: 16px 25px 15px !important;
}

.vip-card-head .text-\[15px\] {
    font-size: 20px !important;
    line-height: 24px !important;
    font-weight: 700 !important;
}

.vip-card-head .text-\[9px\] {
    font-size: 12px !important;
    line-height: 15px !important;
    font-weight: 600 !important;
}

.vip-head-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.vip-head-stat__label {
    color: rgba(255, 255, 255, 0.88);
    font-size: 11px;
    line-height: 14px;
    font-weight: 700;
}

.vip-head-stat__value {
    color: #fff;
    margin-top: 5px;
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
}

.vip-feature-panel > div:first-child {
    font-size: 13px !important;
    line-height: 16px !important;
    letter-spacing: 0;
    font-weight: 500 !important;
    color: #2c2c2c !important;
}

.vip-feature-panel .space-y-\[7px\] {
    margin-top: 12px !important;
}

.vip-feature-panel .text-\[10px\] {
    font-size: 13px !important;
    line-height: 17px !important;
    color: #242424 !important;
}

.vip-feature-panel .space-y-\[7px\] > :not([hidden]) ~ :not([hidden]) {
    margin-top: 9px !important;
}

.vip-level-button {
    margin-left: 16px !important;
    margin-right: 16px !important;
    width: calc(100% - 32px) !important;
    height: 58px !important;
    margin-top: 14px !important;
    border-radius: 7px !important;
    font-size: 16px !important;
    line-height: 20px !important;
}

.vip-level-button--current {
    background: #2bb66a !important;
    border: 0 !important;
    color: #fff !important;
}

.vip-level-button--disabled {
    height: 38px !important;
    background: #f7faff !important;
    border: 0 !important;
    color: #9aa2af !important;
    opacity: 1;
}

@media (min-width: 376px) {
    .vip-page {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
}

.vip-card-list .vip-medal {
    width: 54px !important;
    height: 54px !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
}

.vip-card-list .vip-medal-img {
    width: 54px !important;
    height: 54px !important;
}

.vip-card-list .vip-card-bubble {
    opacity: 0.28 !important;
}

.vip-card-list .vip-card-head .absolute.right-\[14px\] {
    top: 32px !important;
    right: 26px !important;
    min-width: 80px !important;
    padding: 9px 15px 9px 18px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 999px !important;
    background: #fff !important;
    font-family: Geist-SemiBold, Geist-SemiBold;
    font-weight: normal;
    font-size: 12px !important;
    color: #005a28 !important;
    line-height: 17px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-card {
    background: #fff !important;
    position: relative;
    overflow: hidden;
    border-radius: 8px !important;
    box-shadow: none !important;
    padding: 0 !important;
}

.vip-card-list .vip-card-head {
    position: relative;
    z-index: 1;
    min-height: 326px !important;
    padding: 34px 24px 106px !important;
    border-radius: 8px 8px 0 0 !important;
    background: var(--vip-head-gradient) !important;
}

.vip-card-list .vip-card-body {
    position: relative;
    z-index: 3;
    margin-top: -136px !important;
    padding: 0 24px 20px !important;
    background: transparent !important;
    border-radius: 0 0 8px 8px !important;
}

.vip-card-list .vip-feature-panel {
    position: relative;
    z-index: 4;
    width: 100% !important;
    margin: 0 !important;
    padding: 18px 18px 22px !important;
    border-radius: 8px !important;
    background: #fff !important;
    box-shadow: none !important;
    overflow: visible !important;
}

.vip-card-list .vip-level-button {
    display: block;
    margin-bottom: 0 !important;
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.vip-card-list .vip-level-button--current {
    height: 58px !important;
    margin-top: 31px !important;
    border-radius: 7px !important;
    background: var(--vip-button-color) !important;
    border: 0 !important;
    color: #fff !important;
    font-size: 16px !important;
    font-weight: 600 !important;
}

.vip-card-list .vip-level-button--disabled,
.vip-card-list .vip-level-button--theme {
    height: 48px !important;
    margin-top: 14px !important;
    border-radius: 8px !important;
}

.vip-card-list .vip-level-button--theme {
    background: var(--vip-button-color) !important;
    color: #fff !important;
}

.vip-card-list .vip-level-button--disabled {
    background: #f7faff !important;
    border: 0 !important;
    color: #9aa2af !important;
    opacity: 1;
}

.vip-card-list .vip-medal,
.vip-card-list .vip-medal-img {
    width: 62px !important;
    height: 62px !important;
    margin-left: -10px;
}

.vip-card-list .vip-card-head .text-\[15px\] {
    font-family: Montserrat, Montserrat;
    font-weight: 600 !important;
    font-size: 18px !important;
    color: #ffffff;
    line-height: 20px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-card-head .text-\[9px\] {
    margin-top: 4px !important;
    font-family: Montserrat, Montserrat;
    font-weight: 500 !important;
    font-size: 12px !important;
    color: #ffffff;
    line-height: 18px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-head-stats {
    grid-template-columns: 1fr 1.2fr 1fr !important;
    gap: 14px !important;
    margin-top: 17px !important;
}

.vip-card-list .vip-head-stat__label {
    white-space: nowrap !important;
    font-family: Montserrat, Montserrat;
    font-weight: 600 !important;
    font-size: 12px !important;
    color: #ffffff;
    line-height: 17px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-head-stat__value {
    margin-top: 7px !important;
    font-family: Montserrat, Montserrat;
    font-weight: 600 !important;
    font-size: 16px !important;
    color: #ffffff;
    line-height: 24px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-feature-panel > div:first-child {
    letter-spacing: 0 !important;
    font-family: Geist-SemiBold, Geist-SemiBold;
    font-weight: normal;
    font-size: 12px !important;
    color: #212121 !important;
    line-height: 18px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list .vip-feature-panel .space-y-\[7px\] {
    margin-top: 18px !important;
}

.vip-card-list .vip-feature-panel .text-\[10px\] {
    font-family: Montserrat, Montserrat;
    font-weight: 500 !important;
    font-size: 12px !important;
    color: #212121 !important;
    line-height: 18px !important;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.vip-card-list
    .vip-feature-panel
    .space-y-\[7px\]
    > :not([hidden])
    ~ :not([hidden]) {
    margin-top: 12px !important;
}

.vip-card-list .vip-feature-icon {
    width: 16px !important;
    height: 16px !important;
    margin-right: 12px !important;
    margin-top: 2px !important;
}
@media (max-width: 767px) {
    .vip-page {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}

@media (min-width: 768px) {
    .vip-page {
        max-width: var(--app-pc-max-width, 375px);
        margin: 0 auto;
    }
}
</style>
