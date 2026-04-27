<template>
    <div class="starting-page">
        <div class="starting-shell">
            <header class="top-welcome">
                <div>
                    <div class="top-welcome__eyebrow">
                        {{ $t("welcome_back") }}
                        <span aria-hidden="true">👋</span>
                    </div>
                    <div class="top-welcome__name">{{ displayName }}</div>
                </div>
                <div class="top-welcome__actions">
                    <button
                        type="button"
                        class="top-icon-btn"
                        aria-label="notice"
                        @click="toNotice"
                    >
                        <img src="@/static/images/home/alert1.png" />
                        <!-- <span class="top-icon-btn__badge"></span> -->
                    </button>
                    <button
                        type="button"
                        class="top-icon-btn"
                        aria-label="profile"
                        @click="toMy"
                    >
                        <img src="@/static/images/starting/starting-menu.png" />
                    </button>
                </div>
            </header>

            <main class="starting-content">
                <section class="hero-card">
                    <div class="hero-card__bubble hero-card__bubble--one"></div>
                    <div class="hero-card__bubble hero-card__bubble--two"></div>
                    <div
                        class="hero-card__bubble hero-card__bubble--three"
                    ></div>

                    <div class="hero-card__header">
                        <div class="hero-avatar">
                            <div class="hero-avatar__inner">
                                {{ displayInitial }}
                            </div>
                            <span class="hero-avatar__dot"></span>
                        </div>

                        <div class="hero-card__identity">
                            <div class="hero-card__welcome">
                                {{ $t("welcome_back") }}
                                <span aria-hidden="true">👋</span>
                            </div>
                            <div class="hero-card__name">
                                {{ $t("hi") }},{{ displayName }}
                            </div>
                            <div class="hero-card__tags">
                                <span class="hero-tag hero-tag--vip"
                                    ><img
                                        src="@/static/images/home/hggg.png"
                                        class="h-[16px] w-[16px] mr-[5px]"
                                    />
                                    <span>{{ userLevel || "VIP1" }}</span>
                                </span>
                                <span class="hero-tag"
                                    >{{ orderCount || 0 }}
                                    {{ $t("tasks") }}</span
                                >
                            </div>
                        </div>

                        <button
                            type="button"
                            class="hero-setting-btn"
                            @click="toMy"
                        >
                            <img src="@/static/images/starting/setin.png" />
                        </button>
                    </div>

                    <div class="hero-stats">
                        <div class="hero-stat">
                            <div class="hero-stat__label">
                                <img
                                    src="@/static/images/starting/wallet.png"
                                />
                                <span>{{ $t("balance") }}</span>
                            </div>
                            <div class="hero-stat__value">
                                ${{ userInfo.balance || "0.00" }}
                            </div>
                            <div class="hero-stat__meta">
                                {{ $t("ui_usd") }}
                            </div>
                        </div>
                        <div class="hero-stat">
                            <div class="hero-stat__label">
                                <img src="@/static/images/starting/ansia.png" />
                                <span>{{ $t("today") }}</span>
                            </div>
                            <div class="hero-stat__value">
                                ${{ userInfo.commission || "0.00" }}
                            </div>
                            <div class="hero-stat__meta">
                                {{ $t("earned") }}
                            </div>
                        </div>
                        <div class="hero-stat">
                            <div class="hero-stat__label">
                                <img src="@/static/images/starting/task.png" />
                                <span>{{ $t("tasks") }}</span>
                            </div>
                            <div class="hero-stat__value">
                                {{ userInfo.dealCount || 0 }}/{{
                                    orderCount || 0
                                }}
                            </div>
                            <div class="hero-stat__meta">{{ $t("today") }}</div>
                        </div>
                    </div>
                </section>

                <section class="blind-box-panel">
                    <div class="blind-box-panel__top">
                        <div class="blind-box-panel__title-wrap">
                            <div class="blind-box-panel__title-icon">
                                <img src="@/static/images/starting/giff.png" />
                            </div>
                            <div class="blind-box-panel__title">
                                {{ $t("mystery_blind_box") }}
                            </div>
                        </div>
                        <div class="blind-box-panel__actions">
                            <span class="today-pill">{{ $t("today") }}</span>
                            <!-- <button type="button" class="reset-btn">
                                <van-icon name="replay" size="14" />
                                <span>{{ $t("reset") }}</span>
                            </button> -->
                        </div>
                    </div>

                    <div class="opened-progress">
                        {{
                            $t("opened_boxes", {
                                opened: userInfo.dealCount || 0,
                                total: orderCount || 0,
                            })
                        }}
                    </div>

                    <!-- <div class="blind-box-tags">
                        <span class="blind-box-tag blind-box-tag--common"
                            >ommon</span
                        >
                        <span class="blind-box-tag blind-box-tag--rare"
                            >Rare</span
                        >
                        <span class="blind-box-tag blind-box-tag--epic"
                            >Epic</span
                        >
                        <span class="blind-box-tag blind-box-tag--legendary"
                            >Legendary</span
                        >
                    </div> -->

                    <div class="blind-box-grid">
                        <button
                            v-for="(item, index) in visibleGoods"
                            :key="getBlindBoxItemKey(item, index)"
                            type="button"
                            class="blind-box-item"
                            :class="[
                                blindBoxAnimationClass,
                                {
                                    'blind-box-item--placeholder':
                                        !item.coverUrl || !isBlindBoxReady,
                                },
                            ]"
                            :style="{ '--blind-box-index': index }"
                            :disabled="!item.coverUrl || !isBlindBoxReady"
                            @click="handleClick"
                        >
                            <div class="blind-box-item__corner"></div>
                            <div class="blind-box-item__icon">
                                <img
                                    v-if="item.coverUrl && isBlindBoxReady"
                                    :src="getBlindBoxCoverUrl(item)"
                                    alt=""
                                    class="blind-box-item__image"
                                    decoding="async"
                                />
                                <van-icon
                                    v-else
                                    name="gift-o"
                                    size="28"
                                    color="#22a447"
                                />
                            </div>
                            <div class="blind-box-item__text">
                                {{ $t("tap_to_open") }}
                            </div>
                        </button>
                    </div>
                </section>

                <section class="support-card">
                    <div class="support-card__icon">
                        <van-icon name="star-o" size="18" color="#1ca447" />
                    </div>
                    <div class="support-card__text">
                        <div class="support-card__title">
                            {{ $t("online_support_hours") }}
                            {{ TradeInfor?.workTimeStart || "--:--" }} -
                            {{ TradeInfor?.workTimeEnd || "--:--" }}
                        </div>
                        <div class="support-card__desc">
                            {{ $t("please_contact_online_support") }}
                        </div>
                    </div>
                </section>
            </main>

            <TaskOrderDialog
                v-model="showCenter"
                :title="$t('complete_the_order')"
                :step="currentStep"
                :step-labels="taskStepLabels"
                :product-name="goods.goodsName"
                :cover-url="goods.coverUrl ? url + goods.coverUrl : ''"
                :amount-label="$t('order_amount')"
                :amount-text="`$${goods.price || '0.00'}`"
                :commission-label="$t('commission')"
                :commission-text="`+$${goods.commission || '0.00'}`"
                :success-message="taskSuccessMessage"
                :show-warning="currentStep === 2 && showInsufficientWarning"
                :warning-text="$t('insufficient_balance_please')"
                :warning-action-text="$t('recharge')"
                :action-text="
                    currentStep === 1
                        ? $t('accept_task')
                        : currentStep === 2
                          ? $t('complete_the_order')
                          : $t('continue_tasks')
                "
                :action-loading="currentStep === 2 && isTaskSubmitting"
                :action-disabled="currentStep === 2 && isTaskSubmitting"
                @back="handleDialogBack"
                @closed="resetDialogState"
                @warning-action="goRecharge"
                @primary="
                    currentStep === 1
                        ? goToOrderStep()
                        : currentStep === 2
                          ? submitForm()
                          : handleContinueTasks()
                "
            >
                <template #panel="{ step }">
                    <div v-if="step === 1" class="task-panel">
                        <div class="task-panel__title task-panel__title--warn">
                            <van-icon
                                name="warning-o"
                                size="20"
                                color="#e39a1a"
                            />
                            <span>{{ $t("task_instructions") }}</span>
                        </div>
                        <div class="task-panel__instructions">
                            {{ $t("task_instruction_1") }}<br />
                            {{ $t("task_instruction_2") }}<br />
                            {{ $t("task_instruction_3") }}<br />
                            {{ $t("task_instruction_4") }}
                        </div>
                    </div>

                    <div v-else-if="step === 2" class="task-panel">
                        <div class="task-panel__heading">
                            {{ $t("place_order") }}
                        </div>
                        <div class="task-order-card">
                            <div class="task-order-card__label">
                                {{ $t("order_id") }}
                            </div>
                            <div class="task-order-card__id">
                                #{{ goods.orderNo }}
                            </div>
                        </div>
                        <div class="task-order-card__time">
                            {{ $t("creation_at_colon") }}
                            {{
                                formatWithTimezone(
                                    goods.createTime,
                                    userStore.zoneActive.tzName,
                                )
                            }}
                        </div>
                    </div>
                </template>
            </TaskOrderDialog>

            <van-popup
                v-model:show="showImg"
                round
                :style="{ width: '80%', background: 'transparent' }"
            >
                <img
                    @click="closeImg"
                    class="w-[100%] mb-5"
                    src="../../static/images/super.png"
                    alt=""
                />
                <van-button
                    color="rgb(10, 77, 162)"
                    round
                    class="w-full"
                    @click="closeImg"
                    >{{ $t("ok") }}</van-button
                >
            </van-popup>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, onUnmounted } from "vue";
import { showLoadingToast, closeToast, showToast, showSuccessToast } from "@/util/message";
import { useI18n } from "vue-i18n";
import TaskOrderDialog from "@/components/TaskOrderDialog.vue";
import {
    userGetInfo,
    getGoodsListTwo,
    createOrder,
    submitOrder,
    getTradeConfig,
} from "../../api/apis";
const url = window.g.VITE_API_IMG_URL;
import { formatWithTimezone } from "../../util/utils";
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { errorMessages } from "../../api/errorCodeMap";
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const userInfo = ref({});
const avatarUrl = ref("");

let timer = null;
const goodsList = ref([]);
const visibleGoodsSource = ref([]);
const showCenter = ref(false);
const showImg = ref(false);
const goods = ref({});
const totalCount = ref(0);
const currentStep = ref(1);
const showInsufficientWarning = ref(false);
const isTaskSubmitting = ref(false);
const taskSuccessMessage = ref(t("task_completed_successfully"));
const taskStepLabels = computed(() => [
    t("accept_task"),
    t("place_order"),
    t("submit_proof"),
]);
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

const displayInitial = computed(() => {
    const name = `${displayName.value || "?"}`.trim();
    return name ? name.charAt(0).toUpperCase() : "?";
});

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

const visibleGoods = computed(() => {
    const list = [...(visibleGoodsSource.value || [])].slice(
        0,
        BLIND_BOX_VISIBLE_COUNT,
    );
    while (list.length < BLIND_BOX_VISIBLE_COUNT) {
        list.push({ id: `placeholder-${list.length}` });
    }
    return list;
});

const loadBlindBoxImage = (src) => {
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
            } catch (error) {
                // decode 失败时仍然继续渲染，避免坏图阻塞九宫格。
            }
            done();
        };
        image.onerror = done;
        image.src = src;
    });
};

const preloadBlindBoxImages = async (list) => {
    const normalizedList = normalizeBlindBoxList(list);
    const nextGoodsKey = getBlindBoxGoodsKey(normalizedList);

    // 轮询接口返回同一批商品时不再重复赋值，避免九宫格每 10 秒重新动画/重刷。
    if (isBlindBoxReady.value && nextGoodsKey === lastBlindBoxGoodsKey) {
        return;
    }

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

const toLogin = () => {
    router.replace({ path: "/projectspage" });
};

const getImageByIndex = (i) => {
    if (i === 4) return null;
    const realIndex = i < 5 ? i : i - 1;
    return goodsList.value[realIndex]?.coverUrl || "";
};

const handleClick = () => {
    doCreateOrder();
};

const closeImg = () => {
    showImg.value = false;
};

const resetDialogState = () => {
    currentStep.value = 1;
    showInsufficientWarning.value = false;
    isTaskSubmitting.value = false;
    taskSuccessMessage.value = t("task_completed_successfully");
};

const goToOrderStep = () => {
    currentStep.value = 2;
    showInsufficientWarning.value = false;
};

const handleDialogBack = () => {
    if (isTaskSubmitting.value) return;

    if (currentStep.value === 2) {
        currentStep.value = 1;
        showInsufficientWarning.value = false;
        return;
    }

    if (currentStep.value >= 3) {
        showCenter.value = false;
        resetDialogState();
        return;
    }

    showCenter.value = false;
};

const handleContinueTasks = () => {
    showCenter.value = false;
    resetDialogState();
};

const goRecharge = () => {
    router.push("/deposit");
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
            showCenter.value = true;
            currentStep.value = 1;
            showInsufficientWarning.value = false;
            userGetInfoMethods();
            goods.value = res.data;
        })
        .catch((err) => {
            closeToast();
            if (err.code == 2000) {
                showImg.value = true;
                setTimeout(() => {
                    showImg.value = false;
                }, 2000);
            } else if (err.code == 909) {
                showToast(
                    `User has filled in ${err.data} pieces of data. please contact Customer Service to apply for resetting account`,
                );
            } else {
                showToast(t(errorMessages[err.code]));
            }
        });
};

const submitForm = () => {
    if (isTaskSubmitting.value) return;

    showInsufficientWarning.value = false;
    isTaskSubmitting.value = true;
    submitOrder(goods.value.id)
        .then((res) => {
            closeToast();
            userGetInfoMethods();
            if (res.code == 201) {
                goods.value = res.data;
            }
            showSuccessToast(t("mission_submitted_completed"));
            taskSuccessMessage.value = t("mission_submitted_completed");
            currentStep.value = 3;
        })
        .catch((err) => {
            if (err.code == 916) {
                showInsufficientWarning.value = true;
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
            isTaskSubmitting.value = false;
        });
};

const toNotice = () => {
    router.push({ path: "/notice" });
};

const toMy = () => {
    router.push({ path: "/my" });
};

const TradeInfor = ref({});
const tradeConfig = async () => {
    let res = await getTradeConfig();
    TradeInfor.value = res.data;
};

onUnmounted(() => {
    isStartingPageUnmounted = true;
    blindBoxPreloadToken += 1;
    if (timer) clearTimeout(timer);
});

const userLevel = ref("");
const userGetInfoMethods = () => {
    userGetInfo().then((res) => {
        userInfo.value = res.data;
        avatarUrl.value = `${url}${res.data.userLevel.icon}`;
        orderCount.value = res.data.userLevel.orderCount;
        userLevel.value = res.data.userLevel.nameEn;
    });
};

const orderCount = ref(0);
onMounted(() => {
    getList();
    userGetInfoMethods();
    tradeConfig();
});
</script>
<style scoped>
.starting-page {
    min-height: 100vh;
    background: #f4faf5;
}

.starting-shell {
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0 59px, #f4faf5 59px 100%);
}

.top-welcome {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: 59px;
    padding: 0 16px;
    background: #ffffff;
}

.top-welcome::before {
    content: "";
    display: block;
    width: 72px;
    height: 38px;
    background: url("@/static/images/starting/starting-logo.png") center /
        contain no-repeat;
    flex: 0 0 72px;
}

.top-welcome > div:first-child {
    display: none;
}

.top-welcome__eyebrow {
    color: #1fa44b;
    font-size: 13px;
    line-height: 1.25;
}

.top-welcome__name {
    margin-top: 4px;
    color: #0f1f12;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.05;
}

.top-welcome__actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.top-icon-btn {
    position: relative;
    width: 34px;
    height: 34px;
    border: 1px solid #cce8d3;
    border-radius: 999px;
    background: linear-gradient(180deg, #f7fdf8 0%, #e8f7ed 100%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.top-icon-btn__badge {
    position: absolute;
    top: 10px;
    right: 11px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff4d55;
    box-shadow: 0 0 0 2px #ffffff;
}

.top-welcome__actions .top-icon-btn:last-child {
    border: 0;
    background: url("@/static/images/starting/starting-menu.png") center / 34px
        34px no-repeat;
    box-shadow: none;
}

.top-welcome__actions .top-icon-btn:last-child :deep(.van-icon) {
    display: none;
}

@media (min-width: 768px) {
    .top-welcome {
        left: 50%;
        right: auto;
        width: 100%;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}

.starting-content {
    padding: 59px 0 108px;
}

.hero-card {
    position: relative;
    overflow: hidden;
    margin-top: 0;
    padding: 18px 18px 0;
    /*border-radius: 0 0 18px 18px;*/
    background: linear-gradient(135deg, #2bc35b 0%, #18a046 100%);
    box-shadow: 0 12px 28px rgba(33, 150, 72, 0.18);
}

.hero-card__bubble {
    position: absolute;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
}

.hero-card__bubble--one {
    top: -24px;
    right: -28px;
    width: 108px;
    height: 108px;
}

.hero-card__bubble--two {
    top: 42px;
    right: 86px;
    width: 56px;
    height: 56px;
}

.hero-card__bubble--three {
    bottom: 14px;
    left: -12px;
    width: 70px;
    height: 70px;
}

.hero-card__header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
}

.hero-avatar {
    position: relative;
    width: 66px;
    height: 66px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.hero-avatar__inner {
    color: #ffffff;
    font-size: 34px;
    font-weight: 500;
    line-height: 1;
}

.hero-avatar__dot {
    position: absolute;
    right: -2px;
    bottom: 1px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #78f0a0;
    border: 2px solid #ffffff;
}

.hero-card__identity {
    flex: 1;
    min-width: 0;
    margin-left: 14px;
    padding-top: 3px;
    color: #ffffff;
}

.hero-card__welcome {
    font-size: 14px;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.92);
}

.hero-card__name {
    margin-top: 6px;
    font-size: 19px;
    font-weight: 700;
    line-height: 1.2;
    word-break: break-all;
}

.hero-card__tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.hero-tag {
    display: inline-flex;
    align-items: center;
    height: 28px;
    padding: 0 11px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    color: #eaf8ee;
    font-size: 12px;
    line-height: 1;
}

.hero-tag--vip {
    background: rgba(255, 215, 97, 0.26);
    color: #fff4d0;
}

.hero-setting-btn {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.34);
    background: rgba(255, 255, 255, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
}

.hero-stats {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 18px;
    background: rgba(20, 126, 57, 0.3);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    overflow: hidden;
}

.hero-stat {
    min-width: 0;
    padding: 14px 10px 16px;
    text-align: center;
    color: #ffffff;
}

.hero-stat + .hero-stat {
    border-left: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-stat__label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    line-height: 1.2;
}

.hero-stat__value {
    margin-top: 8px;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.1;
    word-break: break-word;
}

.hero-stat__meta {
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 12px;
    line-height: 1.2;
}

.blind-box-panel {
    margin-top: 18px;
    margin-left: 14px;
    margin-right: 14px;
}

.blind-box-panel__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.blind-box-panel__title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.blind-box-panel__title-icon {
    width: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.blind-box-panel__title {
    color: #122418;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
}

.blind-box-panel__actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.today-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    background: linear-gradient(180deg, #d69129 0%, #bd7420 100%);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
}

.reset-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid #bfe0c6;
    background: #f4fbf6;
    color: #249347;
    font-size: 14px;
}

.opened-progress {
    margin-top: 14px;
    min-height: 46px;
    padding: 0 18px;
    border: 1px solid #cbe7d1;
    border-radius: 14px;
    background: #eef8f0;
    color: #63846a;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.blind-box-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
}

.blind-box-tag {
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: #ffffff;
    font-size: 12px;
    line-height: 1;
}

.blind-box-tag--common {
    color: #55a64a;
}

.blind-box-tag--rare {
    color: #4d87ef;
}

.blind-box-tag--epic {
    color: #9249cd;
}

.blind-box-tag--legendary {
    color: #ef9628;
}

.blind-box-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 14px;
}

.blind-box-item {
    position: relative;
    overflow: hidden;
    min-height: 150px;
    padding: 18px 10px 12px;
    border: 1px solid #cbe7d1;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(14px) scale(0.96);
    animation-duration: 560ms;
    animation-timing-function: cubic-bezier(0.2, 0.9, 0.25, 1.15);
    animation-fill-mode: forwards;
    animation-delay: calc(var(--blind-box-index, 0) * 90ms);
    will-change: transform, opacity;
}

.blind-box-item:disabled {
    cursor: default;
}

.blind-box-item--placeholder {
    opacity: 1;
    transform: none;
    animation: none;
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

.blind-box-item:active {
    transform: translateY(0) scale(0.98);
}

.blind-box-item__corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 34px;
    background: #edf6ee;
    border-bottom-left-radius: 24px;
}

.blind-box-item__icon {
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: #eef7ef;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.blind-box-item__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.blind-box-item__text {
    margin-top: 18px;
    color: #7c8d7d;
    font-size: 14px;
    line-height: 1.25;
    text-align: center;
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

@media (prefers-reduced-motion: reduce) {
    .blind-box-item {
        opacity: 1;
        transform: none;
        animation: none;
    }
}

.support-card {
    margin-top: 18px;
    margin-bottom: 10px;
    margin-left: 14px;
    margin-right: 14px;
    padding: 20px 18px;
    border: 1px solid #cbe7d1;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.06);
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.support-card__icon {
    width: 24px;
    padding-top: 2px;
    display: flex;
    justify-content: center;
}

.support-card__title {
    color: #1c2a1f;
    font-size: 13px;
    line-height: 1.55;
}

.support-card__desc {
    color: #1c2a1f;
    font-size: 13px;
    line-height: 1.55;
}

.task-dialog {
    display: flex;
    flex-direction: column;
    background: #f4faf5;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    padding-bottom: 24px;
    box-sizing: border-box;
}

.task-dialog__header {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 76px;
    padding: 18px 18px 14px;
    background: #ffffff;
    border-bottom: 1px solid #dcecdf;
}

.task-dialog__back {
    position: absolute;
    left: 16px;
    top: 50%;
    border: 0;
    background: transparent;
    padding: 8px;
    line-height: 1;
    transform: translateY(-50%);
}

.task-dialog__title {
    color: #1c261d;
    font-size: 18px;
    font-weight: 600;
}

.task-stepper {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
    padding: 22px 16px 20px;
    background: #ffffff;
}

.task-step {
    width: 86px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.task-step__circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #dcebe0;
    color: #7d967f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
}

.task-step__label {
    margin-top: 10px;
    color: #88a089;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
}

.task-step--active .task-step__circle,
.task-step--done .task-step__circle {
    background: #21a149;
    color: #ffffff;
}

.task-step--active .task-step__label,
.task-step--done .task-step__label {
    color: #1f9c47;
}

.task-stepper__line {
    flex: 1;
    min-width: 34px;
    max-width: 78px;
    height: 3px;
    border-radius: 999px;
    background: #dcebe0;
    margin-top: 18px;
}

.task-stepper__line--done {
    background: #9cd3ac;
}

.task-product-card,
.task-panel,
.task-warning-bar,
.task-success {
    margin: 16px 16px 0;
}

.task-product-card {
    display: flex;
    gap: 14px;
    padding: 16px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
}

.task-product-card__thumb {
    width: 92px;
    height: 92px;
    border-radius: 12px;
    background: #f1f4f1;
    overflow: hidden;
    flex-shrink: 0;
}

.task-product-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.task-product-card__content {
    min-width: 0;
    flex: 1;
    padding-top: 4px;
}

.task-product-card__name {
    color: #172217;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.35;
}

.task-product-card__meta {
    margin-top: 10px;
    color: #668368;
    font-size: 15px;
    line-height: 1.2;
}

.task-product-card__meta span {
    color: #2a3c2d;
}

.task-product-card__meta--accent,
.task-product-card__meta--accent span {
    color: #18a647;
}

.task-panel {
    padding: 20px 18px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
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

.task-warning-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border: 1px solid #efb7b3;
    border-radius: 14px;
    background: #fff4f3;
    color: #d23f36;
    font-size: 14px;
    line-height: 1.3;
}

.task-warning-bar__link {
    color: #24a44b;
    font-weight: 600;
    background: transparent;
    border: 0;
    padding: 0;
}

.task-success {
    padding: 24px 16px 10px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.task-success__icon {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.task-success__text {
    margin-top: 14px;
    color: #199f45;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
}

.task-dialog__footer {
    padding: 20px 16px 28px;
}

.task-stepper,
.task-product-card,
.task-panel,
.task-warning-bar,
.task-success,
.task-dialog__footer {
    flex-shrink: 0;
}

.task-stepper {
    overflow: visible;
}

.task-dialog > .task-stepper {
    border-bottom: 1px solid #e6f0e8;
}

.task-dialog > .task-stepper,
.task-dialog > .task-product-card,
.task-dialog > .task-panel,
.task-dialog > .task-warning-bar,
.task-dialog > .task-success,
.task-dialog > .task-dialog__footer {
    position: relative;
}

.task-dialog__header ~ .task-stepper,
.task-dialog__header ~ .task-product-card,
.task-dialog__header ~ .task-panel,
.task-dialog__header ~ .task-warning-bar,
.task-dialog__header ~ .task-success,
.task-dialog__header ~ .task-dialog__footer {
    --task-scroll-offset: 76px;
}

.task-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 62px;
    border: 0;
    border-radius: 16px;
    background: linear-gradient(180deg, #2fc867 0%, #159c42 100%);
    box-shadow: 0 12px 24px rgba(33, 150, 72, 0.18);
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
}

.task-action-btn:disabled {
    opacity: 0.72;
}

.task-action-btn__loading {
    flex-shrink: 0;
}

.task-action-btn--small {
    width: 246px;
    max-width: 100%;
    display: block;
    margin: 0 auto;
}

:deep(.van-dialog__content) {
    height: 100%;
    overflow: hidden;
}

:deep(.van-dialog) {
    left: 50% !important;
    top: 0 !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    max-width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    height: 100vh !important;
    height: 100dvh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    transform: translate3d(-50%, 0, 0) !important;
}

:global(.task-fullscreen-dialog) {
    left: 50% !important;
    top: 0 !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    max-width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    height: 100vh !important;
    height: 100dvh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    transform: translate3d(-50%, 0, 0) !important;
}

:global(.task-fullscreen-dialog .van-dialog__content) {
    height: 100%;
    overflow: hidden;
}

:global(.task-fullscreen-overlay) {
    left: 50% !important;
    right: auto !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    transform: translateX(-50%) !important;
}

@media (max-width: 767px) {
    :deep(.van-dialog),
    :global(.task-fullscreen-dialog) {
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        transform: none !important;
    }

    :global(.task-fullscreen-overlay) {
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        transform: none !important;
    }
}

@media (max-width: 360px) {
    .hero-card__name {
        font-size: 17px;
    }

    .blind-box-grid {
        gap: 10px;
    }

    .blind-box-item {
        min-height: 138px;
        border-radius: 16px;
    }

    .task-step {
        width: 78px;
    }

    .task-product-card__thumb {
        width: 82px;
        height: 82px;
    }
}
</style>
