<template>
    <transition name="mission-submission-desktop-slide">
        <div v-if="isPc && visible" class="mission-submission-desktop-layer">
            <div
                ref="popupContentRef"
                class="mission-submission-desktop-panel"
                aria-modal="true"
                role="dialog"
            >
                <div class="mission-submission-popup">
                    <header class="mission-submission-header">
                        <button
                            type="button"
                            class="mission-submission-header__back"
                            @click="emit('back')"
                        >
                            <van-icon
                                name="arrow-left"
                                size="28"
                                color="#ffffff"
                            />
                        </button>
                        <div class="mission-submission-header__title">
                            {{ $t("mission_submission_title") }}
                        </div>
                    </header>

                    <div class="mission-submission-body">
                        <section class="mission-card">
                            <div class="mission-card__image-wrap">
                                <img
                                    v-if="coverUrl"
                                    class="mission-card__image"
                                    :src="coverUrl"
                                    alt=""
                                />
                            </div>

                            <h2 class="mission-card__title">
                                {{ productName }}
                            </h2>

                            <div class="mission-card__price">
                                <span>{{ $t("price") }}:</span>
                                <strong>USD {{ priceText }}</strong>
                            </div>

                            <div class="mission-card__summary-grid">
                                <div class="mission-card__summary-box">
                                    <div class="mission-card__summary-label">
                                        {{ $t("total_amount") }}
                                    </div>
                                    <div
                                        class="mission-card__summary-currency"
                                    >
                                        USD
                                    </div>
                                    <div class="mission-card__summary-value">
                                        {{ totalAmountText }}
                                    </div>
                                </div>

                                <div class="mission-card__summary-box">
                                    <div class="mission-card__summary-label">
                                        {{ $t("commission") }}
                                    </div>
                                    <div
                                        class="mission-card__summary-currency"
                                    >
                                        USD
                                    </div>
                                    <div class="mission-card__summary-value">
                                        {{ commissionText }}
                                    </div>
                                </div>
                            </div>

                            <div class="mission-card__meta-box">
                                <div class="mission-card__meta-row">
                                    <span>{{ $t("creation_time") }}</span>
                                    <strong>{{ createTimeText }}</strong>
                                </div>
                                <div class="mission-card__meta-row">
                                    <span>{{ $t("order_no_label") }}</span>
                                    <strong>{{ orderNoText }}</strong>
                                </div>
                            </div>

                            <button
                                type="button"
                                class="mission-card__submit"
                                :disabled="submitting"
                                @click="emit('submit')"
                            >
                                <span
                                    v-if="submitting"
                                    class="mission-card__submit-spinner"
                                ></span>
                                <span v-else>{{
                                    $t("submit").toUpperCase()
                                }}</span>
                            </button>
                        </section>
                    </div>
                    <footer class="mission-submission-footer">
                        <p>{{ $t("copyright_2025_algofy_company") }}</p>
                        <p>{{ $t("all_rights_reserved") }}</p>
                    </footer>
                </div>
            </div>
        </div>
    </transition>

    <van-popup
        v-if="!isPc"
        v-model:show="visible"
        class="mission-submission-van-popup"
        overlay-class="mission-submission-popup-overlay"
        position="right"
        @opened="handleOpened"
        destroy-on-close
        :close-on-click-overlay="false"
        :style="{ width: '100%', height: '100%', background: '#edeef5' }"
    >
        <div ref="popupContentRef" class="mission-submission-popup">
            <header class="mission-submission-header">
                <button
                    type="button"
                    class="mission-submission-header__back"
                    @click="emit('back')"
                >
                    <van-icon name="arrow-left" size="28" color="#ffffff" />
                </button>
                <div class="mission-submission-header__title">
                    {{ $t("mission_submission_title") }}
                </div>
            </header>

            <div class="mission-submission-body">
                <section class="mission-card">
                    <div class="mission-card__image-wrap">
                        <img
                            v-if="coverUrl"
                            class="mission-card__image"
                            :src="coverUrl"
                            alt=""
                        />
                    </div>

                    <h2 class="mission-card__title">{{ productName }}</h2>

                    <div class="mission-card__price">
                        <span>{{ $t("price") }}:</span>
                        <strong>USD {{ priceText }}</strong>
                    </div>

                    <div class="mission-card__summary-grid">
                        <div class="mission-card__summary-box">
                            <div class="mission-card__summary-label">
                                {{ $t("total_amount") }}
                            </div>
                            <div class="mission-card__summary-currency">
                                USD
                            </div>
                            <div class="mission-card__summary-value">
                                {{ totalAmountText }}
                            </div>
                        </div>

                        <div class="mission-card__summary-box">
                            <div class="mission-card__summary-label">
                                {{ $t("commission") }}
                            </div>
                            <div class="mission-card__summary-currency">
                                USD
                            </div>
                            <div class="mission-card__summary-value">
                                {{ commissionText }}
                            </div>
                        </div>
                    </div>

                    <div class="mission-card__meta-box">
                        <div class="mission-card__meta-row">
                            <span>{{ $t("creation_time") }}</span>
                            <strong>{{ createTimeText }}</strong>
                        </div>
                        <div class="mission-card__meta-row">
                            <span>{{ $t("order_no_label") }}</span>
                            <strong>{{ orderNoText }}</strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="mission-card__submit"
                        :disabled="submitting"
                        @click="emit('submit')"
                    >
                        <span
                            v-if="submitting"
                            class="mission-card__submit-spinner"
                        ></span>
                        <span v-else>{{ $t("submit").toUpperCase() }}</span>
                    </button>
                </section>
            </div>
            <footer class="mission-submission-footer">
                <p>{{ $t("copyright_2025_algofy_company") }}</p>
                <p>{{ $t("all_rights_reserved") }}</p>
            </footer>
        </div>
    </van-popup>
</template>

<script setup>
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    productName: {
        type: String,
        default: "NIKE Dunk Low Retro Men's Shoe",
    },
    coverUrl: {
        type: String,
        default: "",
    },
    scoreText: {
        type: [String, Number],
        default: "4.9",
    },
    reviewText: {
        type: String,
        default: "",
    },
    priceText: {
        type: String,
        default: "289.99",
    },
    totalAmountText: {
        type: String,
        default: "456.78",
    },
    commissionText: {
        type: String,
        default: "46.78",
    },
    createTimeText: {
        type: String,
        default: "2025-06-15 19:38:44",
    },
    orderNoText: {
        type: String,
        default: "202506157896541230123",
    },
    submitting: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "back", "submit"]);
const popupContentRef = ref(null);
const isPc = ref(false);
let mediaQueryList = null;

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

function updateDeviceMode() {
    isPc.value = window.matchMedia("(min-width: 768px)").matches;
}

function resetPopupScroll() {
    const popupContent = popupContentRef.value;

    if (popupContent) {
        popupContent.scrollTop = 0;
    }
}

function handleOpened() {
    nextTick(() => {
        resetPopupScroll();
    });
}

watch(visible, (isOpen) => {
    if (!isOpen) return;

    nextTick(() => {
        resetPopupScroll();
        requestAnimationFrame(resetPopupScroll);
    });
});

onMounted(() => {
    mediaQueryList = window.matchMedia("(min-width: 768px)");
    updateDeviceMode();

    if (typeof mediaQueryList.addEventListener === "function") {
        mediaQueryList.addEventListener("change", updateDeviceMode);
    } else {
        mediaQueryList.addListener(updateDeviceMode);
    }
});

onUnmounted(() => {
    if (!mediaQueryList) return;

    if (typeof mediaQueryList.removeEventListener === "function") {
        mediaQueryList.removeEventListener("change", updateDeviceMode);
    } else {
        mediaQueryList.removeListener(updateDeviceMode);
    }
});
</script>

<style scoped>
.mission-submission-popup {
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-y: auto;
    background: #e9ebf2;
    color: #ffffff;
    font-family: "Montserrat", "Poppins", sans-serif;
    -webkit-overflow-scrolling: touch;
}

.mission-submission-header {
    position: sticky;
    top: 0;
    z-index: 30;
    height: 64px;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
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
    max-width: calc(100% - 96px);
    overflow: hidden;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.mission-submission-body {
    padding: 11px 16px 28px;
}

.mission-card {
    border-radius: 12px;
    background: #28459b;
    padding: 22px 20px 24px;
    box-shadow: 0 8px 18px rgba(30, 51, 114, 0.08);
}

.mission-card__image-wrap {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
}

.mission-card__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mission-card__title {
    margin: 20px auto 0;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    word-break: break-word;
}

.mission-card__rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 16px;
    color: #ffffff;
    font-size: 16px;
    line-height: 1;
}

.mission-card__rating strong {
    font-size: 19px;
    font-weight: 600;
}

.mission-card__star {
    color: #ffcc21;
    font-size: 26px;
    line-height: 1;
}

.mission-card__price {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 16px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.mission-card__summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.mission-card__summary-box,
.mission-card__meta-box {
    border-radius: 14px;
    background: #08153c;
    color: #ffffff;
}

.mission-card__summary-box {
    min-height: 116px;
    padding: 16px 18px 14px;
}

.mission-card__summary-label {
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #facc32;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.mission-card__summary-currency {
    margin-top: 13px;
    font-family: Geist-Bold, Geist-Bold;
    font-weight: normal;
    font-size: 24px;
    color: #ffffff;
    line-height: 32px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.mission-card__summary-value {
    font-family: Geist-Bold, Geist-Bold;
    font-weight: normal;
    font-size: 24px;
    color: #ffffff;
    line-height: 32px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.mission-card__meta-box {
    margin-top: 18px;
    padding: 16px 18px;
}

.mission-card__meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.mission-card__meta-row + .mission-card__meta-row {
    margin-top: 14px;
}

.mission-card__submit {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 56px;
    margin-top: 30px;
    border: 0;
    border-radius: 14px;
    background: #3b48e8;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
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
    padding: 14px 0 18px;
    color: #6c7892;
    font-size: 17px;
    line-height: 1.45;
    text-align: center;
    background: #fff;

    p {
        font-family: Geist-Regular, Geist-Regular;
        font-weight: normal;
        font-size: 12px;
        color: #64748b;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }
}
</style>

<style>
.mission-submission-van-popup {
    background: #edeef5;
}

.mission-submission-popup-overlay {
    background: rgba(0, 0, 0, 0.45);
}

.mission-submission-desktop-layer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 50%;
    z-index: 3200;
    width: min(100vw, var(--app-pc-max-width, 375px));
    transform: translateX(-50%);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.45);
    will-change: opacity;
}

.mission-submission-desktop-panel {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    background: #edeef5;
    will-change: transform;
    backface-visibility: hidden;
}

.mission-submission-desktop-slide-enter-active,
.mission-submission-desktop-slide-leave-active {
    transition: opacity 0.3s ease;
}

.mission-submission-desktop-slide-enter-active
    .mission-submission-desktop-panel,
.mission-submission-desktop-slide-leave-active
    .mission-submission-desktop-panel {
    transition: transform 0.32s cubic-bezier(0.3, 0.85, 0.4, 1);
}

.mission-submission-desktop-slide-enter-from,
.mission-submission-desktop-slide-leave-to {
    opacity: 0;
}

.mission-submission-desktop-slide-enter-to,
.mission-submission-desktop-slide-leave-from {
    opacity: 1;
}

.mission-submission-desktop-slide-enter-from
    .mission-submission-desktop-panel,
.mission-submission-desktop-slide-leave-to
    .mission-submission-desktop-panel {
    transform: translate3d(84%, 0, 0);
}

.mission-submission-desktop-slide-enter-to
    .mission-submission-desktop-panel,
.mission-submission-desktop-slide-leave-from
    .mission-submission-desktop-panel {
    transform: translate3d(0, 0, 0);
}
</style>
