<template>
    <div class="footer-wrap">
        <div v-if="showSpacer" class="footer-spacer"></div>
        <nav
            class="pc-fixed-footer algofy-footer fixed bottom-0 left-0 right-0"
            :style="footerStyle"
        >
            <svg
                class="algofy-footer__bg"
                viewBox="0 0 375 96"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path class="algofy-footer__bg-fill" :d="footerShapePath" />
                <path class="algofy-footer__top-shadow" :d="footerTopPath" />
                <path class="algofy-footer__top-stroke" :d="footerTopPath" />
            </svg>
            <div
                v-for="menu in menus"
                :key="menu.url"
                class="algofy-footer__item"
                :class="{
                    'algofy-footer__item--center': menu.center,
                    'algofy-footer__item--active': isVisualActive(menu),
                    'algofy-footer__item--pressed': pressedUrl === menu.url,
                }"
                @click="onClickMenu(menu)"
            >
                <img
                    :src="getMenuIcon(menu)"
                    :alt="menu.title"
                    class="algofy-footer__icon"
                />
                <span
                    class="algofy-footer__label"
                    :class="{
                        'algofy-footer__label--active': isVisualActive(menu),
                    }"
                >
                    {{ menu.title }}
                </span>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import footerHome from "@/static/images/footer-design/home.png";
import footerHomeActive from "@/static/images/footer-design/home-active.png";
import footerVip from "@/static/images/footer-design/vip.png";
import footerVipActive from "@/static/images/footer-design/vip-active.png";
import footerStarting from "@/static/images/footer-design/starting-outline.png";
import footerStartingActive from "@/static/images/footer-design/starting-fill.png";
import footerOrders from "@/static/images/footer-design/orders.png";
import footerOrdersActive from "@/static/images/footer-design/orders-active.png";
import footerMe from "@/static/images/footer-design/me.png";
import footerMeActive from "@/static/images/footer-design/me-active.png";

const router = useRouter();
const pressedUrl = ref("");
const visualActiveUrl = ref("");
const FIXED_BUMP_INDEX = 2;
const animatedBumpIndex = ref(FIXED_BUMP_INDEX);
const props = defineProps({
    name: String,
    showSpacer: {
        type: Boolean,
        default: true,
    },
});
const { t } = useI18n();

const menus = computed(() => [
    {
        title: t("home"),
        url: "/",
        icon: footerHome,
        activeIcon: footerHomeActive,
    },
    {
        title: t("vip"),
        url: "/vips",
        icon: footerVip,
        activeIcon: footerVipActive,
    },
    {
        title: t("starting"),
        url: "/starting",
        icon: footerStarting,
        activeIcon: footerStartingActive,
        center: true,
    },
    {
        title: t("records"),
        url: "/records",
        icon: footerOrders,
        activeIcon: footerOrdersActive,
    },
    { title: t("my"), url: "/my", icon: footerMe, activeIcon: footerMeActive },
]);

const activeIndicatorIndex = computed(() =>
    menus.value.findIndex((menu) => props.name === menu.url),
);

const footerStyle = computed(() => ({
    "--footer-bump-center-x": `${(animatedBumpIndex.value + 0.5) * 20}%`,
}));

const footerContour = computed(() => {
    const centerX = (animatedBumpIndex.value + 0.5) * 75;
    const start = centerX - 60;
    const end = centerX + 60;
    const left = Math.min(0, start);
    const right = Math.max(375, end);

    const top = [
        `M${left} 31`,
        start > left ? `H${start}` : "",
        `C${start + 14} 31 ${start + 21} 30 ${start + 28} 27`,
        `C${start + 39} 22 ${start + 44} 13 ${start + 60} 13`,
        `C${start + 76} 13 ${start + 81} 22 ${start + 92} 27`,
        `C${start + 99} 30 ${start + 106} 31 ${end} 31`,
        end < right ? `H${right}` : "",
    ]
        .filter(Boolean)
        .join(" ");

    return { top, left, right };
});

const footerTopPath = computed(() => footerContour.value.top);

const footerShapePath = computed(() => {
    const { top, left, right } = footerContour.value;
    return `${top} V96 H${left} Z`;
});

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function setBumpIndex() {
    animatedBumpIndex.value = FIXED_BUMP_INDEX;
}

function syncIndicatorToCurrent() {
    setBumpIndex();
    visualActiveUrl.value = props.name;
}

onMounted(() => {
    syncIndicatorToCurrent();
});

watch(activeIndicatorIndex, () => {
    setBumpIndex();
    visualActiveUrl.value = props.name;
});

function isVisualActive(menu) {
    return visualActiveUrl.value === menu.url;
}

function getMenuIcon(menu) {
    return isVisualActive(menu) ? menu.activeIcon : menu.icon;
}

function waitForPaint() {
    return nextTick().then(
        () =>
            new Promise((resolve) => {
                requestAnimationFrame(() => resolve());
            }),
    );
}

async function onClickMenu(menu) {
    if (pressedUrl.value) return;
    if (props.name === menu.url) return;

    pressedUrl.value = menu.url;
    setBumpIndex();
    visualActiveUrl.value = menu.url;

    await waitForPaint();

    router
        .push({
            path: menu.url,
        })
        .catch(() => {
            syncIndicatorToCurrent();
        })
        .finally(() => {
            pressedUrl.value = "";
        });
}
</script>

<style scoped>
.footer-wrap {
    position: relative;
    z-index: 80;
    width: 100%;
    height: 0;
    background: transparent;
}

.footer-spacer {
    height: 96px;
}

.algofy-footer {
    z-index: 80;
    left: 50%;
    right: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--app-pc-max-width, 375px);
    height: 96px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: start;
    padding: 0;
    box-sizing: border-box;
    overflow: visible;
    background: transparent !important;
    border: 0;
    border-radius: 0;
    box-shadow: none !important;
    transform: translateX(-50%);
}

.algofy-footer__bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 0;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
}

.algofy-footer__bg-fill {
    fill: #ffffff;
    stroke: none;
}

.algofy-footer__top-shadow {
    fill: none;
    stroke: rgba(112, 128, 150, 0.08);
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: blur(0.6px);
}

.algofy-footer__top-stroke {
    fill: none;
    stroke: #edf2f8;
    stroke-width: 0.85;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.algofy-footer::before,
.algofy-footer::after {
    display: none !important;
    content: none !important;
}

.algofy-footer__item {
    position: relative;
    z-index: 2;
    min-width: 0;
    height: 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    color: #8d99a8;
    padding-top: 38px;
    box-sizing: border-box;
    transform: translateZ(0);
}

.algofy-footer__item--center {
    padding-top: 0;
}

.algofy-footer__item--pressed {
    opacity: 0.82;
}

.algofy-footer__icon {
    width: 26px;
    height: 26px;
    display: block;
    object-fit: contain;
    transition:
        width 0.22s ease,
        height 0.22s ease,
        margin-top 0.22s ease;
}

.algofy-footer__item--center .algofy-footer__icon {
    width: 50px;
    height: 50px;
    margin-top: 25px;
}

.algofy-footer__label {
    display: block;
    margin-top: 8px;
    color: #7f8a99;
    font-family: "Montserrat", "Poppins", sans-serif;
    font-size: 12px;
    line-height: 1;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
}

.algofy-footer__item--center .algofy-footer__label {
    display: none;
}

.algofy-footer__label--active {
    color: #2f4ff0;
    font-weight: 500;
}

@media (max-width: 767px) {
    .algofy-footer.fixed {
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        max-width: none !important;
        margin: 0 !important;
        transform: none !important;
    }
}

@media (min-width: 768px) {
    .algofy-footer.fixed {
        left: 50% !important;
        right: auto !important;
        bottom: 0 !important;
        width: var(--app-pc-max-width, 375px) !important;
        max-width: var(--app-pc-max-width, 375px) !important;
        margin: 0 !important;
        transform: translateX(-50%) !important;
    }
}
@media (max-width: 767px) {
    .algofy-footer {
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: none !important;
        transform: none !important;
    }
}

</style>
