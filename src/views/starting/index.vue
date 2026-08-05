<template>
    <div class="starting-page algofy-starting-page">
        <MainTabTopBar :title="$t('start')" />
        <div class="algofy-starting-shell">
            <section class="algofy-user-strip">
                <div class="algofy-user-avatar-wrap">
                    <img
                        class="algofy-user-avatar"
                        :src="displayAvatar"
                        alt=""
                        @error="(e) => (e.target.src = defaultAvatar)"
                    />
                </div>
                <div class="algofy-user-copy">
                    <div class="algofy-user-welcome">
                        {{ $t("welcome_back") }}
                    </div>
                    <div class="algofy-user-name">{{ displayName }}</div>
                </div>
                <img
                    class="algofy-user-vip"
                    :src="currentVipBadgeIcon"
                    alt=""
                />
            </section>

            <main class="algofy-starting-content">
                <section class="algofy-product-section">
                    <div class="algofy-product-gallery">
                        <div
                            class="algofy-product-thumbs algofy-product-thumbs--left"
                        >
                            <div
                                :key="getBlindBoxItemKey(galleryGoods[0], 0)"
                                class="algofy-thumb-card algofy-gallery-animated"
                                :class="[
                                    blindBoxAnimationClass,
                                    {
                                        'algofy-gallery-animated--placeholder':
                                            !galleryGoods[0]?.coverUrl ||
                                            !isBlindBoxReady,
                                    },
                                ]"
                                :style="{ '--blind-box-index': 0 }"
                            >
                                <img
                                    v-if="isGalleryItemLoaded(galleryGoods[0])"
                                    :src="getBlindBoxCoverUrl(galleryGoods[0])"
                                    alt=""
                                />
                                <div
                                    v-else
                                    class="algofy-skeleton algofy-skeleton--thumb"
                                ></div>
                            </div>
                            <div
                                :key="getBlindBoxItemKey(galleryGoods[1], 1)"
                                class="algofy-thumb-card algofy-gallery-animated"
                                :class="[
                                    blindBoxAnimationClass,
                                    {
                                        'algofy-gallery-animated--placeholder':
                                            !galleryGoods[1]?.coverUrl ||
                                            !isBlindBoxReady,
                                    },
                                ]"
                                :style="{ '--blind-box-index': 1 }"
                            >
                                <img
                                    v-if="isGalleryItemLoaded(galleryGoods[1])"
                                    :src="getBlindBoxCoverUrl(galleryGoods[1])"
                                    alt=""
                                />
                                <div
                                    v-else
                                    class="algofy-skeleton algofy-skeleton--thumb"
                                ></div>
                            </div>
                        </div>

                        <div
                            :key="getBlindBoxItemKey(featuredGoods, 2)"
                            class="algofy-product-main-img algofy-gallery-animated"
                            :class="[
                                blindBoxAnimationClass,
                                {
                                    'algofy-gallery-animated--placeholder':
                                        !featuredGoods?.coverUrl ||
                                        !isBlindBoxReady,
                                },
                            ]"
                            :style="{ '--blind-box-index': 2 }"
                        >
                            <img
                                v-if="isGalleryItemLoaded(featuredGoods)"
                                :src="getBlindBoxCoverUrl(featuredGoods)"
                                alt=""
                            />
                            <div
                                v-else
                                class="algofy-skeleton algofy-skeleton--main"
                            ></div>
                        </div>

                        <div
                            class="algofy-product-thumbs algofy-product-thumbs--right"
                        >
                            <div
                                :key="getBlindBoxItemKey(galleryGoods[3], 3)"
                                class="algofy-thumb-card algofy-gallery-animated"
                                :class="[
                                    blindBoxAnimationClass,
                                    {
                                        'algofy-gallery-animated--placeholder':
                                            !galleryGoods[3]?.coverUrl ||
                                            !isBlindBoxReady,
                                    },
                                ]"
                                :style="{ '--blind-box-index': 3 }"
                            >
                                <img
                                    v-if="isGalleryItemLoaded(galleryGoods[3])"
                                    :src="getBlindBoxCoverUrl(galleryGoods[3])"
                                    alt=""
                                />
                                <div
                                    v-else
                                    class="algofy-skeleton algofy-skeleton--thumb"
                                ></div>
                            </div>
                            <div
                                :key="getBlindBoxItemKey(galleryGoods[4], 4)"
                                class="algofy-thumb-card algofy-thumb-card--dark algofy-gallery-animated"
                                :class="[
                                    blindBoxAnimationClass,
                                    {
                                        'algofy-gallery-animated--placeholder':
                                            !galleryGoods[4]?.coverUrl ||
                                            !isBlindBoxReady,
                                    },
                                ]"
                                :style="{ '--blind-box-index': 4 }"
                            >
                                <img
                                    v-if="isGalleryItemLoaded(galleryGoods[4])"
                                    :src="getBlindBoxCoverUrl(galleryGoods[4])"
                                    alt=""
                                />
                                <div
                                    v-else
                                    class="algofy-skeleton algofy-skeleton--thumb"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <h1
                        :key="`title-${featuredGoodsKey}`"
                        class="algofy-product-title algofy-product-meta-animated"
                    >
                        {{ productTitleText }}
                    </h1>
                    <!-- <div class="algofy-product-rating">
                        <span class="algofy-rating-star">★</span>
                        <strong>{{ productScoreText }}</strong>
                        <span>{{ productReviewText }}</span>
                    </div> -->
                    <div
                        :key="`price-${featuredGoodsKey}`"
                        class="algofy-product-price algofy-product-meta-animated"
                    >
                        <span>{{ $t("order_amount") }}:</span>
                        <strong>USD {{ productPriceText }}</strong>
                    </div>
                    <button
                        type="button"
                        class="algofy-start-btn"
                        :disabled="!isBlindBoxReady"
                        @click="handleClick"
                    >
                        {{ translateWithFallback("start", "Start") }} ({{
                            userInfo.dealCount || 0
                        }}/{{ orderCount || 0 }})
                    </button>
                </section>

                <section class="algofy-balance-card">
                    <img
                        class="algofy-commission-icon"
                        src="@/static/images/starting-design/commission-icon.png"
                        alt=""
                    />
                    <div class="algofy-commission-label">
                        {{ $t("today") }} {{ $t("commission") }}
                    </div>
                    <div class="algofy-commission-amount">
                        USD {{ commissionAmountText }}
                    </div>
                    <div class="algofy-commission-desc">
                        {{ $t("auto_the_displayed_amount_reflects_the")
                        }}<br />{{
                            $t("auto_commissions_earned_today_as_an_indication")
                        }}
                    </div>
                    <div class="algofy-balance-grid">
                        <div class="algofy-mini-balance">
                            <img
                                src="@/static/images/starting-design/wallet-icon.png"
                                alt=""
                            />
                            <div class="algofy-mini-title">
                                {{ $t("balance") }}
                            </div>
                            <div class="algofy-mini-amount">
                                USD {{ balanceAmountText }}
                            </div>
                            <p>
                                {{ $t("auto_the_total_balance_reflects")
                                }}<br />{{ $t("auto_both_the_deposited")
                                }}<br />{{ $t("auto_amount_and") }}<br />{{
                                    $t("auto_commissions_earned")
                                }}
                            </p>
                        </div>
                        <div class="algofy-mini-balance">
                            <img
                                src="@/static/images/starting-design/freeze-icon.png"
                                alt=""
                            />
                            <div class="algofy-mini-title">
                                {{ $t("auto_freeze_amount") }}
                            </div>
                            <div class="algofy-mini-amount">
                                USD {{ frozenBalanceAmountText }}
                            </div>
                            <p>
                                {{ $t("auto_pinned_balance") }}<br />{{
                                    $t("auto_where_there_is_a")
                                }}<br />{{ $t("auto_pending_combination")
                                }}<br />{{ $t("auto_product_in_process") }}
                            </p>
                        </div>
                    </div>
                </section>

                <section class="algofy-notice-card">
                    <h2>
                        {{
                            translateWithFallback(
                                "important_notice",
                                "Important Notice",
                            )
                        }}:
                    </h2>
                    <p>
                        {{ $t("online_support_hours") }}
                        {{ TradeInfor?.workTimeStart || "10:00" }} -
                        {{ TradeInfor?.workTimeEnd || "23:00" }}<br />
                        {{ $t("please_contact_online_support") }}
                    </p>
                </section>

                <footer class="algofy-copyright-card">
                    <img
                        src="@/static/images/starting-design/footer-logo.png"
                        alt=""
                    />
                    <p>{{ $t("auto_copyright_2025_algofy_company") }}</p>
                    <p>
                        {{
                            translateWithFallback(
                                "all_rights_reserved",
                                "All Rights Reserved",
                            )
                        }}
                    </p>
                </footer>
            </main>

            <MissionGifLoadingScreen
                :visible="isMissionOpening || isMissionSubmitLoading"
            />

            <MissionSubmissionPopup
                v-model="showMissionDialog"
                :product-name="missionProductTitle"
                :cover-url="missionCoverUrl"
                :score-text="missionScoreText"
                :review-text="missionReviewText"
                :price-text="missionPriceText"
                :total-amount-text="missionTotalAmountText"
                :commission-text="missionCommissionText"
                :create-time-text="missionCreateTimeText"
                :order-no-text="missionOrderNoText"
                :submitting="isMissionSubmitting"
                @back="closeMissionDialog"
                @submit="submitForm"
            />

            <van-popup
                v-model:show="showImg"
                class="lucky-draw-van-popup"
                overlay-class="lucky-draw-popup-overlay"
                :style="{ background: 'transparent' }"
            >
                <div class="lucky-draw-popup" @click="closeImg">
                    <img
                        class="lucky-draw-popup__panel"
                        src="@/static/images/popup-design/lucky-draw-panel.png"
                        alt=""
                    />
                    <div class="lucky-draw-popup__content">
                        <div class="lucky-draw-popup__title">
                            <span
                                v-for="(line, index) in luckyDrawTitleLines"
                                :key="index"
                            >
                                {{ line }}
                            </span>
                        </div>
                        <div class="lucky-draw-popup__desc">
                            {{ $t("lucky_draw_desc_before") }}
                            <span class="lucky-draw-popup__amount">
                                {{ $t("lucky_draw_amount") }}
                            </span>
                        </div>
                        <div class="lucky-draw-popup__claim">
                            {{ $t("lucky_draw_claim_text") }}
                        </div>
                        <div class="lucky-draw-popup__disclaimer">
                            {{ $t("lucky_draw_disclaimer") }}
                        </div>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script setup>
import MainTabTopBar from "@/components/MainTabTopBar.vue";
import { computed, onMounted, ref, onUnmounted } from "vue";
import {
    showLoadingToast,
    closeToast,
    showToast,
    showSuccessToast,
} from "@/util/message";
import { useI18n } from "vue-i18n";
import {
    getGoodsListTwo,
    createOrder,
    submitOrder,
    getTradeConfig,
} from "../../api/apis";
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
import MissionSubmissionPopup from "@/components/MissionSubmissionPopup.vue";
import MissionGifLoadingScreen from "@/components/MissionGifLoadingScreen.vue";

const userStore = useUserStore();
const router = useRouter();
const { t, te, locale } = useI18n();

const missionOpenLoadingSeconds = Number(
    import.meta.env.PROD
        ? window.g?.VITE_MISSION_OPEN_LOADING_SECONDS
        : import.meta.env.VITE_MISSION_OPEN_LOADING_SECONDS,
);
const missionOpenLoadingDuration =
    Number.isFinite(missionOpenLoadingSeconds) &&
    missionOpenLoadingSeconds >= 0
        ? missionOpenLoadingSeconds * 1000
        : 3000;
const missionSubmitLoadingSeconds = Number(
    import.meta.env.PROD
        ? window.g?.VITE_MISSION_SUBMIT_LOADING_SECONDS
        : import.meta.env.VITE_MISSION_SUBMIT_LOADING_SECONDS,
);
const missionSubmitLoadingDuration =
    Number.isFinite(missionSubmitLoadingSeconds) &&
    missionSubmitLoadingSeconds >= 0
        ? missionSubmitLoadingSeconds * 1000
        : 3000;
const missionOpenGifLoadingEnabled = !["false", "0", "off", "no"].includes(
    String(
        import.meta.env.PROD
            ? window.g?.VITE_MISSION_OPEN_GIF_LOADING_ENABLED ?? "true"
            : import.meta.env.VITE_MISSION_OPEN_GIF_LOADING_ENABLED ?? "true",
    ).toLowerCase(),
);
const missionSubmitGifLoadingEnabled = ![
    "false",
    "0",
    "off",
    "no",
].includes(
    String(
        import.meta.env.PROD
            ? window.g?.VITE_MISSION_SUBMIT_GIF_LOADING_ENABLED ?? "true"
            : import.meta.env.VITE_MISSION_SUBMIT_GIF_LOADING_ENABLED ?? "true",
    ).toLowerCase(),
);

const translateWithFallback = (key, fallback) => {
    return te(key) ? t(key) : fallback;
};

const userInfo = ref({});
const VITE_API_IMG_URL = window.g.VITE_API_IMG_URL
    ? window.g.VITE_API_IMG_URL
    : import.meta.env.VITE_API_IMG_URL;
const url = VITE_API_IMG_URL;
const defaultAvatar = new URL(
    "@/static/images/my-design/my-default-avatar.png",
    import.meta.url,
).href;

const startingVipIcons = {
    level1: new URL("@/static/images/vip_design/vip1.png", import.meta.url)
        .href,
    level2: new URL("@/static/images/vip_design/vip2.png", import.meta.url)
        .href,
    level3: new URL("@/static/images/vip_design/vip3.png", import.meta.url)
        .href,
    level4: new URL("@/static/images/vip_design/vip4.png", import.meta.url)
        .href,
    level5: new URL("@/static/images/vip_design/vip5.png", import.meta.url)
        .href,
    levelDefault: new URL(
        "@/static/images/my-design/my-vip-badge.png",
        import.meta.url,
    ).href,
};
let timer = null;
let luckyDrawTimer = null;
let missionOpeningTimer = null;
let missionSubmitLoadingTimer = null;

const goodsList = ref([]);
const visibleGoodsSource = ref([]);
const showMissionDialog = ref(false);
const isMissionOpening = ref(false);
const isMissionSubmitLoading = ref(false);
const showImg = ref(false);
const goods = ref({});
const isMissionSubmitting = ref(false);

const blindBoxAnimationClass = ref("blind-box-item--anim-rise");
const blindBoxRenderSeed = ref(0);
const blindBoxAnimationClasses = [
    "blind-box-item--anim-rise",
    "blind-box-item--anim-pop",
    "blind-box-item--anim-flip",
    "blind-box-item--anim-slide-left",
    "blind-box-item--anim-slide-right",
    "blind-box-item--anim-zoom",
    "blind-box-item--anim-swing",
    "blind-box-item--anim-rotate",
    "blind-box-item--anim-drop",
    "blind-box-item--anim-blur",
];
let blindBoxAnimationQueue = [];

const shuffleBlindBoxAnimations = () => {
    const pool = [...blindBoxAnimationClasses];
    for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
};

const nextBlindBoxAnimationClass = () => {
    if (!blindBoxAnimationQueue.length) {
        blindBoxAnimationQueue = shuffleBlindBoxAnimations();
    }

    const nextClass = blindBoxAnimationQueue.shift();
    if (
        nextClass === blindBoxAnimationClass.value &&
        blindBoxAnimationQueue.length
    ) {
        blindBoxAnimationQueue.push(nextClass);
        return blindBoxAnimationQueue.shift();
    }

    return nextClass || blindBoxAnimationClasses[0];
};

const displayName = computed(() => {
    return userInfo.value.username || userStore.userInfo?.username || "--";
});

const displayAvatar = computed(
    () => userInfo.value?.avatar || userStore.userInfo?.avatar || defaultAvatar,
);

const currentVipLevelNumber = computed(() => {
    const matched =
        `${userLevel.value || userInfo.value?.userLevel?.nameEn || ""}`.match(
            /\d+/,
        );
    return matched ? Number(matched[0]) : 0;
});

const currentVipBadgeIcon = computed(() => {
    const iconKey = `level${currentVipLevelNumber.value}`;
    return startingVipIcons[iconKey] || startingVipIcons.levelDefault;
});

const formatMoneyText = (value) => {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount)
        ? amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
        : "0.00";
};

const commissionAmountText = computed(() =>
    formatMoneyText(userInfo.value?.commission),
);

const balanceAmountText = computed(() =>
    formatMoneyText(userInfo.value?.balance),
);

const frozenBalanceAmountText = computed(() =>
    formatMoneyText(userInfo.value?.frozenBalance),
);

const BLIND_BOX_VISIBLE_COUNT = 9;
const isBlindBoxReady = ref(false);
let blindBoxPreloadToken = 0;
let lastBlindBoxGoodsKey = "";
let isStartingPageUnmounted = false;

const normalizeBlindBoxList = (list) => {
    return (Array.isArray(list) ? list : []).slice(0, BLIND_BOX_VISIBLE_COUNT);
};

const getBlindBoxCoverUrl = (item) => {
    return item?.coverUrl ? `${url}${item.coverUrl}` : "";
};

const getBlindBoxItemKey = (item, index) => {
    const baseKey =
        item?.id || item?.orderNo || item?.coverUrl || `placeholder-${index}`;
    return `${blindBoxRenderSeed.value}-${baseKey}-${index}`;
};

const isGalleryItemLoaded = (item) => {
    return Boolean(item?.coverUrl && isBlindBoxReady.value);
};

const getBlindBoxGoodsKey = (list) => {
    return normalizeBlindBoxList(list)
        .map((item, index) =>
            [
                item?.id || "",
                item?.orderNo || "",
                item?.coverUrl || "",
                index,
            ].join("|"),
        )
        .join("||");
};

const galleryGoods = computed(() =>
    normalizeBlindBoxList(visibleGoodsSource.value).filter(
        (item) => item?.coverUrl,
    ),
);

const featuredGoods = computed(
    () => galleryGoods.value[2] || galleryGoods.value[0] || {},
);

const featuredGoodsKey = computed(() => {
    const item = featuredGoods.value || {};
    return item.id || item.orderNo || item.coverUrl || "featured-placeholder";
});

const getGoodsTitle = (item = {}) => {
    return (
        item.goodsName ||
        item.name ||
        item.title ||
        item.productName ||
        item.commodityName ||
        item.goodsTitle ||
        item.productTitle ||
        "NIKE Dunk Low Retro Men's Shoe"
    );
};

const getGoodsAmount = (item = {}) => {
    return (
        item.price ??
        item.goodsPrice ??
        item.productPrice ??
        item.amount ??
        item.orderAmount ??
        item.salePrice ??
        0
    );
};

const formatGoodsAmount = (amount) => {
    const numberAmount = Number(amount);
    return Number.isFinite(numberAmount) ? numberAmount.toFixed(2) : "0.00";
};

const productTitleText = computed(() => getGoodsTitle(featuredGoods.value));

const productPriceText = computed(() =>
    formatGoodsAmount(getGoodsAmount(featuredGoods.value)),
);

const productScoreText = computed(
    () => featuredGoods.value?.score || featuredGoods.value?.rate || "4.9",
);

const productReviewText = computed(() => {
    const reviewCount =
        featuredGoods.value?.reviewCount ??
        featuredGoods.value?.commentCount ??
        featuredGoods.value?.saleCount ??
        123;
    return `${reviewCount} ${t("reviews")}`;
});

const missionCoverUrl = computed(() => {
    if (goods.value?.coverUrl) return `${url}${goods.value.coverUrl}`;
    return featuredGoods.value?.coverUrl
        ? `${url}${featuredGoods.value.coverUrl}`
        : "";
});

const missionGoods = computed(() => {
    const createdGoods = goods.value || {};
    if (
        createdGoods.id ||
        createdGoods.orderNo ||
        createdGoods.coverUrl ||
        createdGoods.goodsName
    ) {
        return createdGoods;
    }
    return featuredGoods.value;
});

const missionProductTitle = computed(() => getGoodsTitle(missionGoods.value));
const missionScoreText = computed(
    () =>
        missionGoods.value?.score ||
        missionGoods.value?.rate ||
        featuredGoods.value?.score ||
        featuredGoods.value?.rate ||
        "4.9",
);
const missionReviewText = computed(() => productReviewText.value);
const missionPriceText = computed(() =>
    formatGoodsAmount(getGoodsAmount(missionGoods.value)),
);
const missionTotalAmountText = computed(() => {
    const amount = Number(getGoodsAmount(goods.value || {}));
    return amount ? amount.toFixed(2) : "456.78";
});
const missionCommissionText = computed(() => {
    const amount = Number(goods.value?.commission || 0);
    return amount ? amount.toFixed(2) : "46.78";
});
const missionCreateTimeText = computed(() => {
    if (!goods.value?.createTime) return "2025-06-15 19:38:44";
    return formatWithTimezone(
        goods.value.createTime,
        userStore.zoneActive?.tzName,
    );
});
const missionOrderNoText = computed(
    () => goods.value?.orderNo || "202506157896541230123",
);

const luckyDrawTitleLines = computed(() => {
    const title = t("lucky_draw_title");
    if (!title) return [];
    if (title.includes("\n")) {
        return title
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    if (locale.value === "en" || /Lucky Draw/i.test(title)) {
        return ["You Have Won The", "Lucky Draw!"];
    }
    return [title];
});

const loadBlindBoxImage = async (src) => {
    return new Promise((resolve) => {
        if (!src) {
            resolve();
            return;
        }
        const image = new Image();
        let settled = false;
        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        image.onload = async () => {
            try {
                if (typeof image.decode === "function") {
                    await image.decode();
                }
            } catch (error) {}
            done();
        };
        image.onerror = done;
        image.src = src;
    });
};

const preloadBlindBoxImages = async (list) => {
    const normalizedList = normalizeBlindBoxList(list);
    const nextGoodsKey = getBlindBoxGoodsKey(normalizedList);
    if (isBlindBoxReady.value && nextGoodsKey === lastBlindBoxGoodsKey) return;

    const nextToken = ++blindBoxPreloadToken;
    const imageUrls = Array.from(
        new Set(normalizedList.map(getBlindBoxCoverUrl).filter(Boolean)),
    );
    await Promise.all(imageUrls.map(loadBlindBoxImage));

    if (nextToken !== blindBoxPreloadToken || isStartingPageUnmounted) return;

    blindBoxAnimationClass.value = nextBlindBoxAnimationClass();
    blindBoxRenderSeed.value += 1;
    visibleGoodsSource.value = normalizedList;
    lastBlindBoxGoodsKey = nextGoodsKey;
    isBlindBoxReady.value = true;
};

const getList = async () => {
    try {
        const res = await getGoodsListTwo();
        const nextList = Array.isArray(res.data) ? res.data : [];
        goodsList.value = nextList;
        await preloadBlindBoxImages(nextList);
    } catch (e) {
        console.error("获取商品列表失败:", e);
    } finally {
        if (!isStartingPageUnmounted) {
            timer = setTimeout(getList, 10000);
        }
    }
};

const handleClick = () => {
    doCreateOrder();
};

const closeImg = () => {
    showImg.value = false;
    if (luckyDrawTimer) {
        clearTimeout(luckyDrawTimer);
        luckyDrawTimer = null;
    }
};

const closeMissionDialog = () => {
    if (isMissionSubmitting.value) return;
    showMissionDialog.value = false;
};

const doCreateOrder = () => {
    showLoadingToast({
        message: t("creating"),
        forbidClick: true,
        duration: 0,
    });

    createOrder()
        .then((res) => {
            closeToast();
            goods.value = res.data || {};
            if (!missionOpenGifLoadingEnabled) {
                showMissionDialog.value = true;
                userGetInfoMethods({ force: true });
                return;
            }
            isMissionOpening.value = true;
            missionOpeningTimer = setTimeout(() => {
                isMissionOpening.value = false;
                showMissionDialog.value = true;
                missionOpeningTimer = null;
            }, missionOpenLoadingDuration);
            userGetInfoMethods({ force: true });
        })
        .catch((err) => {
            closeToast();
            if (err.code == 2000) {
                showImg.value = true;
                if (luckyDrawTimer) clearTimeout(luckyDrawTimer);
                luckyDrawTimer = setTimeout(() => {
                    showImg.value = false;
                    luckyDrawTimer = null;
                }, 15000);
            } else if (err.code == 909) {
                showToast(
                    `User has filled in ${err.data} pieces of data. please contact Customer Service to apply for resetting account`,
                );
            } else {
                showToast(t(errorMessages[err.code] || "creation_failed"));
            }
        });
};

const executeMissionSubmit = () => {
    submitOrder(goods.value.id)
        .then((res) => {
            closeToast();
            userGetInfoMethods({ force: true });
            if (res.code == 201 && res.data) {
                goods.value = res.data;
            }
            showSuccessToast(t("mission_submitted_completed"));
            showMissionDialog.value = false;
        })
        .catch((err) => {
            if (err.code == 916) {
                showToast(t("insufficient_balance_please"));
                return;
            }
            if (err.code == 906) {
                if (userInfo.value.balance <= 0) {
                    showToast(t("transaction_failed"));
                } else {
                    showToast(t(errorMessages[err.code] || "creation_failed"));
                }
            } else {
                showToast(t(errorMessages[err.code] || "creation_failed"));
            }
        })
        .finally(() => {
            isMissionSubmitting.value = false;
        });
};

const submitForm = () => {
    if (isMissionSubmitting.value || !goods.value?.id) return;
    isMissionSubmitting.value = true;

    if (!missionSubmitGifLoadingEnabled) {
        executeMissionSubmit();
        return;
    }

    isMissionSubmitLoading.value = true;
    missionSubmitLoadingTimer = setTimeout(() => {
        isMissionSubmitLoading.value = false;
        missionSubmitLoadingTimer = null;
        executeMissionSubmit();
    }, missionSubmitLoadingDuration);
};

const TradeInfor = ref({});
const tradeConfig = async () => {
    const res = await getTradeConfig();
    TradeInfor.value = res.data;
};

const userLevel = ref("");
const orderCount = ref(0);

const syncUserInfo = (info = {}) => {
    userInfo.value = info || {};

    const levelInfo = userInfo.value?.userLevel || {};
    orderCount.value = levelInfo.orderCount || 0;
    userLevel.value = levelInfo.nameEn || "";
};

const userGetInfoMethods = async (options = {}) => {
    const info = await userStore.getUserInfo(options);
    syncUserInfo(info);
    return info;
};

onUnmounted(() => {
    isStartingPageUnmounted = true;
    blindBoxPreloadToken += 1;
    if (timer) clearTimeout(timer);
    if (luckyDrawTimer) clearTimeout(luckyDrawTimer);
    if (missionOpeningTimer) clearTimeout(missionOpeningTimer);
    if (missionSubmitLoadingTimer) clearTimeout(missionSubmitLoadingTimer);
});

onMounted(() => {
    getList();
    userGetInfoMethods();
    tradeConfig();
});
</script>
<style scoped>
.algofy-starting-page {
    min-height: 100vh;
    background: #eef2f8;
    color: #111111;
}

.algofy-starting-shell {
    min-height: 100vh;
    background: #eef2f8;
    overflow-x: hidden;
    padding-top: var(--main-tab-top-bar-height, 104px);
}

.algofy-starting-header {
    position: relative;
    height: 100px;
    background: #191919 url("@/static/images/auth/algofy-register-hero.png") top
        center / cover no-repeat;
    color: #ffffff;
}

.algofy-starting-header__status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px 0 24px;
}

.algofy-starting-header__time {
    font-size: 13px;
    line-height: 1;
    font-weight: 700;
}

.algofy-starting-header__status-icons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.algofy-starting-header__signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
}

.algofy-starting-header__signal span {
    display: block;
    width: 3px;
    border-radius: 999px;
    background: #ffffff;
}

.algofy-starting-header__signal span:nth-child(1) {
    height: 5px;
    opacity: 0.7;
}
.algofy-starting-header__signal span:nth-child(2) {
    height: 7px;
    opacity: 0.8;
}
.algofy-starting-header__signal span:nth-child(3) {
    height: 10px;
    opacity: 0.9;
}
.algofy-starting-header__signal span:nth-child(4) {
    height: 12px;
}

.algofy-starting-header__wifi {
    position: relative;
    width: 16px;
    height: 11px;
}

.algofy-starting-header__wifi::before,
.algofy-starting-header__wifi::after {
    content: "";
    position: absolute;
    left: 50%;
    border: 2px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    transform: translateX(-50%) rotate(180deg);
}

.algofy-starting-header__wifi::before {
    top: 1px;
    width: 16px;
    height: 12px;
}

.algofy-starting-header__wifi::after {
    top: 4px;
    width: 9px;
    height: 7px;
}

.algofy-starting-header__battery {
    position: relative;
    width: 24px;
    height: 12px;
    border: 1.8px solid #ffffff;
    border-radius: 3px;
    box-sizing: border-box;
}

.algofy-starting-header__battery::after {
    content: "";
    position: absolute;
    top: 3px;
    right: -3px;
    width: 2px;
    height: 4px;
    border-radius: 0 1px 1px 0;
    background: #ffffff;
}

.algofy-starting-header__battery-level {
    position: absolute;
    inset: 2px;
    border-radius: 1px;
    background: #ffffff;
}

.algofy-starting-header__title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    font-size: 18px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.algofy-user-strip {
    height: 93px;
    padding: 18px 16px 16px;
    background: linear-gradient(180deg, #3e86ff 0%, #2554de 100%);
    display: flex;
    align-items: center;
    color: #ffffff;
}

.algofy-user-avatar-wrap {
    width: 54px;
    height: 54px;
    flex: 0 0 54px;
    border-radius: 50%;
    overflow: hidden;
    background: #d7ecff;
}

.algofy-user-avatar {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.algofy-user-copy {
    flex: 1;
    min-width: 0;
    padding-left: 12px;
}

.algofy-user-welcome {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.algofy-user-name {
    margin-top: 8px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.algofy-user-vip {
    width: 48px;
    height: 48px;
    object-fit: contain;
    margin-left: 8px;
}

.algofy-starting-content {
    padding: 0 0 10px;
    background: #eef2f8;
}

.algofy-product-section {
    position: relative;
    background: #ffffff;
    padding: 26px 16px 24px;
    overflow: hidden;
}

.algofy-product-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 42px;
    background: #eef2f8;
    clip-path: polygon(0 0, 100% 0, 100% 31%, 0 100%);
}

.algofy-product-gallery {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 85px 1fr 73px;
    gap: 12px;
    align-items: center;
    min-height: 190px;
}

.algofy-product-thumbs {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.algofy-thumb-card {
    width: 78px;
    height: 78px;
    border-radius: 6px;
    background: #f3f5f8;
    overflow: hidden;
}

.algofy-thumb-card--dark {
    background: #111111;
}

.algofy-thumb-card img,
.algofy-product-main-img img,
.algofy-skeleton {
    width: 100%;
    height: 100%;
    display: block;
}

.algofy-thumb-card img,
.algofy-product-main-img img {
    object-fit: cover;
}

.algofy-product-main-img {
    height: 178px;
    border: 2px solid #7592ff;
    border-radius: 8px;
    background: #f8f8f8;
    overflow: hidden;
}

.algofy-gallery-animated {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
    animation-duration: 560ms;
    animation-timing-function: cubic-bezier(0.2, 0.9, 0.25, 1.15);
    animation-fill-mode: forwards;
    animation-delay: calc(var(--blind-box-index, 0) * 90ms);
    will-change: transform, opacity, filter;
}

.algofy-gallery-animated--placeholder {
    opacity: 1;
    transform: none;
    animation: none;
}

.algofy-gallery-animated--placeholder.algofy-thumb-card--dark {
    background: #f3f5f8;
}

.algofy-skeleton {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
    background: linear-gradient(90deg, #edf1f6 20%, #f7f9fc 50%, #edf1f6 80%);
    background-size: 200% 100%;
    animation: algofySkeletonShimmer 1.4s ease-in-out infinite;
}

.algofy-skeleton::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.55) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: algofySkeletonGlow 1.6s linear infinite;
}

.algofy-skeleton--thumb {
    border-radius: 6px;
}

.algofy-skeleton--main {
    border-radius: 8px;
}

.blind-box-item--anim-rise {
    animation-name: blindBoxRevealRise;
}

.blind-box-item--anim-pop {
    animation-name: blindBoxRevealPop;
}

.blind-box-item--anim-flip {
    animation-name: blindBoxRevealFlip;
}

.blind-box-item--anim-slide-left {
    animation-name: blindBoxRevealSlideLeft;
}

.blind-box-item--anim-slide-right {
    animation-name: blindBoxRevealSlideRight;
}

.blind-box-item--anim-zoom {
    animation-name: blindBoxRevealZoom;
}

.blind-box-item--anim-swing {
    animation-name: blindBoxRevealSwing;
}

.blind-box-item--anim-rotate {
    animation-name: blindBoxRevealRotate;
}

.blind-box-item--anim-drop {
    animation-name: blindBoxRevealDrop;
}

.blind-box-item--anim-blur {
    animation-name: blindBoxRevealBlur;
}

@keyframes blindBoxRevealRise {
    0% {
        opacity: 0;
        transform: translateY(14px) scale(0.96);
    }

    70% {
        opacity: 1;
        transform: translateY(-3px) scale(1.02);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes blindBoxRevealPop {
    0% {
        opacity: 0;
        transform: scale(0.72);
    }

    65% {
        opacity: 1;
        transform: scale(1.08);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes blindBoxRevealFlip {
    0% {
        opacity: 0;
        transform: perspective(420px) rotateX(72deg) translateY(10px);
    }

    100% {
        opacity: 1;
        transform: perspective(420px) rotateX(0deg) translateY(0);
    }
}

@keyframes blindBoxRevealSlideLeft {
    0% {
        opacity: 0;
        transform: translateX(-24px) scale(0.96);
    }

    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes blindBoxRevealSlideRight {
    0% {
        opacity: 0;
        transform: translateX(24px) scale(0.96);
    }

    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes blindBoxRevealZoom {
    0% {
        opacity: 0;
        transform: scale(1.18);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes blindBoxRevealSwing {
    0% {
        opacity: 0;
        transform: translateY(12px) rotate(-6deg);
    }

    60% {
        opacity: 1;
        transform: translateY(-2px) rotate(3deg);
    }

    100% {
        opacity: 1;
        transform: translateY(0) rotate(0);
    }
}

@keyframes blindBoxRevealRotate {
    0% {
        opacity: 0;
        transform: scale(0.86) rotate(-10deg);
    }

    100% {
        opacity: 1;
        transform: scale(1) rotate(0);
    }
}

@keyframes blindBoxRevealDrop {
    0% {
        opacity: 0;
        transform: translateY(-18px) scale(0.96);
    }

    70% {
        opacity: 1;
        transform: translateY(4px) scale(1.01);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes blindBoxRevealBlur {
    0% {
        opacity: 0;
        filter: blur(8px);
        transform: translateY(10px) scale(1.04);
    }

    100% {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0) scale(1);
    }
}

@keyframes algofySkeletonShimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

@keyframes algofySkeletonGlow {
    100% {
        transform: translateX(100%);
    }
}

.algofy-product-meta-animated {
    animation: algofyProductMetaFade 260ms ease-out both;
}

@keyframes algofyProductMetaFade {
    0% {
        opacity: 0;
        transform: translateY(6px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .algofy-gallery-animated,
    .algofy-product-meta-animated,
    .algofy-skeleton,
    .algofy-skeleton::after {
        opacity: 1;
        transform: none;
        animation: none;
    }
}

.algofy-product-title {
    margin: 18px auto 0;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-product-rating {
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #6f7787;
    font-size: 16px;
    line-height: 1;
}

.algofy-product-rating strong {
    color: #111111;
    font-weight: 800;
}

.algofy-rating-star {
    color: #f5b400;
    font-size: 22px;
    line-height: 1;
}

.algofy-product-price {
    margin-top: 18px;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;

    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-product-price strong {
    color: #3043e3;
}

.algofy-start-btn {
    width: 100%;
    height: 52px;
    margin-top: 25px;
    border: 0;
    border-radius: 8px;
    background: #3043e3;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-start-btn:disabled {
    opacity: 0.72;
}

.algofy-balance-card {
    margin: 0 16px;
    padding: 28px 18px 26px;
    border-radius: 8px;
    background: #243f90;
    color: #ffffff;
    text-align: center;
}

.algofy-commission-icon {
    width: 54px;
    height: 54px;
    object-fit: contain;
    margin: 0 auto 12px;
}

.algofy-commission-label {
    color: #ffcf17;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #facc15;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-commission-amount {
    margin-top: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 30px;
    color: #ffffff;
    line-height: 36px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-commission-desc {
    margin-top: 12px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #bfdbfe;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-balance-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 17px;
}

.algofy-mini-balance img {
    width: 53px;
    height: 53px;
    object-fit: contain;
    margin: 0 auto;
}

.algofy-mini-title {
    color: #ffcf17;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #facc15;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-mini-amount {
    margin-top: 5px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-mini-balance p {
    margin: 13px 0 0;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #bfdbfe;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-notice-card {
    margin: 16px 16px 0;
    padding: 18px 12px 20px;
    border-radius: 8px;
    background: #e5e7eb;
    text-align: center;
}

.algofy-notice-card h2 {
    margin: 0;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-notice-card p {
    margin: 6px 0 0;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #4b5563;
    line-height: 23px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.algofy-copyright-card {
    margin-top: 18px;
    padding: 26px 16px 26px;
    background: #111827;
    color: #ffffff;
    text-align: center;
}

.algofy-copyright-card img {
    display: block;
    width: 53px;
    height: 53px;
    object-fit: contain;
    margin: 0 auto 12px;
}

.algofy-copyright-card p {
    margin: 0;
    font-family: Geist-Regular, Geist-Regular;
    font-weight: normal;
    font-size: 12px;
    color: #ffffff;
    line-height: 16px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.task-panel {
    padding: 20px 18px;
    border-radius: 18px;
    background: #ffffff;
}

.task-panel__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    line-height: 1.2;
}

.task-panel__title--warn {
    color: #bf7d1d;
}

.task-panel__instructions {
    margin-top: 18px;
    color: #516b53;
    font-size: 15px;
    line-height: 1.9;
}

.task-panel__heading {
    text-align: center;
    color: #1c261d;
    font-size: 18px;
    font-weight: 500;
}

.task-order-card {
    margin-top: 18px;
    padding: 18px;
    border: 1px solid #b8debf;
    border-radius: 16px;
    background: #f3fbf5;
    text-align: center;
}

.task-order-card__label {
    color: #495e4b;
    font-size: 16px;
}

.task-order-card__id {
    margin-top: 12px;
    color: #17a445;
    font-size: 17px;
    font-weight: 600;
    word-break: break-all;
}

.task-order-card__time {
    margin-top: 22px;
    text-align: center;
    color: #6a7e6b;
    font-size: 14px;
    line-height: 1.5;
}

.lucky-draw-van-popup {
    background: transparent;
    overflow: visible;
}

:deep(.lucky-draw-popup-overlay) {
    background: rgba(0, 0, 0, 0.55);
}

.lucky-draw-popup {
    position: relative;
    width: 286px;
    text-align: center;
}

.lucky-draw-popup__panel {
    display: block;
    width: 100%;
    height: auto;
}

.lucky-draw-popup__content {
    position: absolute;
    inset: 152px 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.lucky-draw-popup__title {
    margin: 0;
    max-width: 224px;
    color: #ffffff;
    font-size: 17px;
    line-height: 1.28;
    font-weight: 800;
    letter-spacing: 0.01em;
}

.lucky-draw-popup__title span {
    display: block;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.lucky-draw-popup__desc,
.lucky-draw-popup__claim,
.lucky-draw-popup__disclaimer {
    margin: 12px 0 0;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 500;
    word-break: break-word;
}

.lucky-draw-popup__desc {
    max-width: 224px;

    font-family: Montserrat, Montserrat;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.lucky-draw-popup__claim {
    max-width: 218px;
    margin-top: 12px;
}

.lucky-draw-popup__disclaimer {
    max-width: 236px;
    margin-top: 10px;
    padding-bottom: 6px;
    line-height: 1.25;
}

.lucky-draw-popup__amount {
    font-weight: 600;
    font-size: 14px;
    color: #ffed12;
}

.mission-submission-van-popup {
    background: #edeef5;
}

:deep(.mission-submission-popup-overlay) {
    background: rgba(0, 0, 0, 0.45);
}

.mission-submission-popup {
    min-height: 100vh;
    min-height: 100dvh;
    background: #e9ebf2;
}

.mission-submission-header {
    background: #000000;
    color: #ffffff;
}

.mission-submission-header__status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px 0 24px;
}

.mission-submission-header__time {
    font-size: 13px;
    line-height: 1;
    font-weight: 700;
}

.mission-submission-header__status-icons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.mission-submission-header__signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
}

.mission-submission-header__signal span {
    display: block;
    width: 3px;
    border-radius: 999px;
    background: #ffffff;
}

.mission-submission-header__signal span:nth-child(1) {
    height: 5px;
    opacity: 0.7;
}
.mission-submission-header__signal span:nth-child(2) {
    height: 7px;
    opacity: 0.8;
}
.mission-submission-header__signal span:nth-child(3) {
    height: 10px;
    opacity: 0.9;
}
.mission-submission-header__signal span:nth-child(4) {
    height: 12px;
}

.mission-submission-header__wifi {
    position: relative;
    width: 16px;
    height: 11px;
}

.mission-submission-header__wifi::before,
.mission-submission-header__wifi::after {
    content: "";
    position: absolute;
    left: 50%;
    border: 2px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    transform: translateX(-50%) rotate(180deg);
}

.mission-submission-header__wifi::before {
    top: 1px;
    width: 16px;
    height: 12px;
}

.mission-submission-header__wifi::after {
    top: 4px;
    width: 9px;
    height: 7px;
}

.mission-submission-header__battery {
    position: relative;
    width: 22px;
    height: 11px;
    border: 1.8px solid #ffffff;
    border-radius: 3px;
}

.mission-submission-header__battery::after {
    content: "";
    position: absolute;
    top: 2px;
    right: -3px;
    width: 2px;
    height: 5px;
    border-radius: 1px;
    background: #ffffff;
}

.mission-submission-header__battery-level {
    position: absolute;
    inset: 1px;
    border-radius: 2px;
    background: #ffffff;
}

.mission-submission-header__bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
}

.mission-submission-header__back {
    position: absolute;
    left: 12px;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    transform: translateY(-50%);
}

.mission-submission-header__title {
    font-size: 16px;
    letter-spacing: 0.02em;
}

.mission-submission-body {
    padding: 22px 16px 30px;
}

.mission-card {
    border-radius: 22px;
    background: #28459b;
    padding: 22px 20px 24px;
    box-shadow: 0 8px 18px rgba(30, 51, 114, 0.08);
}

.mission-card__image-wrap {
    width: 212px;
    height: 212px;
    margin: 0 auto;
    border-radius: 18px;
    overflow: hidden;
    background: #c52b31;
}

.mission-card__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mission-card__title {
    margin: 22px 0 0;
    color: #ffffff;
    font-size: 25px;
    line-height: 1.22;
    font-weight: 600;
    text-align: center;
}

.mission-card__rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
    color: #ffffff;
    font-size: 18px;
}

.mission-card__rating strong {
    font-size: 21px;
    font-weight: 600;
}

.mission-card__star {
    color: #ffcc21;
    font-size: 28px;
    line-height: 1;
}

.mission-card__price {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
    color: #ffffff;
    font-size: 24px;
    font-weight: 500;
}

.mission-card__price strong {
    font-size: 24px;
    font-weight: 700;
}

.mission-card__summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 26px;
}

.mission-card__summary-box,
.mission-card__meta-box {
    border-radius: 14px;
    background: #08153c;
    color: #ffffff;
}

.mission-card__summary-box {
    min-height: 128px;
    padding: 18px 18px 16px;
}

.mission-card__summary-label {
    color: #ffd835;
    font-size: 16px;
    line-height: 1.25;
}

.mission-card__summary-value {
    margin-top: 18px;
    font-size: 30px;
    line-height: 1;
    font-weight: 300;
}

.mission-card__summary-value--large {
    margin-top: 18px;
    font-size: 30px;
    line-height: 1.1;
    font-weight: 300;
}

.mission-card__meta-box {
    margin-top: 18px;
    padding: 16px 18px;
}

.mission-card__meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    color: rgba(255, 255, 255, 0.96);
    font-size: 16px;
    line-height: 1.5;
}

.mission-card__meta-row + .mission-card__meta-row {
    margin-top: 14px;
}

.mission-card__meta-row strong {
    font-size: 16px;
    font-weight: 500;
    text-align: right;
}

.mission-card__submit {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 58px;
    margin-top: 30px;
    border: 0;
    border-radius: 14px;
    background: #3b48e8;
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.mission-card__submit:disabled {
    opacity: 0.7;
}

.mission-card__submit-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: mission-submit-spin 0.8s linear infinite;
}

@keyframes mission-submit-spin {
    to {
        transform: rotate(360deg);
    }
}

.mission-submission-footer {
    padding: 26px 0 8px;
    color: #6c7892;
    font-size: 17px;
    line-height: 1.45;
    text-align: center;
}

.lucky-draw-popup__content {
    inset: 148px 24px 26px;
}

.lucky-draw-popup__title {
    max-width: 218px;
    font-size: 17px;
    line-height: 1.2;
}

.lucky-draw-popup__disclaimer {
    max-width: 218px;
    margin-top: 12px;
    line-height: 1.22;
}

/* starting top: remove fake status bar and keep compact header */
.algofy-starting-header {
    height: 78px !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
    padding-bottom: 17px !important;
    box-sizing: border-box !important;
}

.algofy-starting-header__status,
.algofy-starting-header__time,
.algofy-starting-header__status-icons,
.algofy-starting-header__signal,
.algofy-starting-header__wifi,
.algofy-starting-header__battery {
    display: none !important;
}

.algofy-starting-header__title {
    height: auto !important;
}

/* final starting header adjustment: no fake phone status bar */
.algofy-starting-header {
    height: 78px !important;
}
.algofy-starting-header__status,
.algofy-starting-header__time,
.algofy-starting-header__status-icons,
.algofy-starting-header__signal,
.algofy-starting-header__wifi,
.algofy-starting-header__battery,
.algofy-starting-header__battery-level {
    display: none !important;
}
</style>
