<template>
    <div class="relative z-50 w-full">
        <div v-if="showSpacer" class="h-[88px]"></div>
        <div class="pc-fixed-footer footer-bar fixed bottom-0 left-0 right-0">
            <div
                class="footer-active-indicator"
                :class="{ 'footer-active-indicator--visible': showIndicator }"
                :style="{
                    transform: `translateX(${indicatorTranslateIndex * 100}%)`,
                }"
            ></div>
            <div
                v-for="menu in menus"
                :key="menu.url"
                class="footer-item"
                :class="{
                    'footer-item--center': menu.center,
                    'footer-item--active': isVisualActive(menu),
                    'footer-item--pressed': pressedUrl === menu.url,
                }"
                @click="onClickMenu(menu)"
            >
                <div
                    class="footer-icon-shell"
                    :class="{
                        'footer-icon-shell--active':
                            isVisualActive(menu) && !menu.center,
                        'footer-icon-shell--center': menu.center,
                    }"
                >
                    <img
                        :src="getMenuIcon(menu)"
                        :alt="menu.title"
                        class="footer-icon"
                        :class="{ 'footer-icon--center': menu.center }"
                    />
                </div>
                <span
                    class="footer-label"
                    :class="{
                        'footer-label--active': isVisualActive(menu),
                    }"
                >
                    {{ menu.title }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import footerHome from "@/static/images/footer/home.png";
import footerHomeActive from "@/static/images/footer/home-active.png";
import footerVip from "@/static/images/footer/vip.png";
import footerVipActive from "@/static/images/footer/vip-active.png";
import footerStarting from "@/static/images/footer/starting-active.png";
import footerOrders from "@/static/images/footer/orders.png";
import footerOrdersActive from "@/static/images/footer/orders-active.png";
import footerMe from "@/static/images/footer/me.png";
import footerMeActive from "@/static/images/footer/me-active.png";

const router = useRouter();
const pressedUrl = ref("");
const displayedIndicatorIndex = ref(-1);
const lastIndicatorIndex = ref(0);
const visualActiveUrl = ref("");
const pendingVisualActiveUrl = ref("");
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
        activeIcon: footerStarting,
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
    menus.value.findIndex((menu) => !menu.center && props.name === menu.url),
);
const showIndicator = computed(() => displayedIndicatorIndex.value >= 0);
const indicatorTranslateIndex = computed(() =>
    displayedIndicatorIndex.value >= 0
        ? displayedIndicatorIndex.value
        : lastIndicatorIndex.value,
);

function getMenuIndex(menu) {
    if (menu.center) return -1;
    return menus.value.findIndex((item) => item.url === menu.url);
}

function syncIndicatorToCurrent() {
    pendingVisualActiveUrl.value = "";
    const currentIndex = activeIndicatorIndex.value;
    if (currentIndex < 0) {
        displayedIndicatorIndex.value = -1;
        visualActiveUrl.value = props.name;
        return;
    }

    displayedIndicatorIndex.value = currentIndex;
    lastIndicatorIndex.value = currentIndex;
    visualActiveUrl.value = props.name;
}

onMounted(() => {
    syncIndicatorToCurrent();
});

watch(activeIndicatorIndex, (index) => {
    if (index < 0) {
        pendingVisualActiveUrl.value = "";
        displayedIndicatorIndex.value = -1;
        visualActiveUrl.value = props.name;
        return;
    }
    displayedIndicatorIndex.value = index;
    lastIndicatorIndex.value = index;
    pendingVisualActiveUrl.value = "";
    visualActiveUrl.value = props.name;
});

function isVisualActive(menu) {
    return visualActiveUrl.value === menu.url;
}

function getMenuIcon(menu) {
    if (menu.center) return isVisualActive(menu) ? menu.activeIcon : menu.icon;
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
    if (menu.center) {
        displayedIndicatorIndex.value = -1;
        visualActiveUrl.value = menu.url;
    } else {
        const targetIndex = getMenuIndex(menu);
        displayedIndicatorIndex.value = targetIndex;
        lastIndicatorIndex.value = targetIndex;
        pendingVisualActiveUrl.value = "";
        visualActiveUrl.value = menu.url;
    }

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
.footer-bar {
    z-index: 50;
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 61px;
    padding: 10px 14px 12px;
    box-sizing: border-box;
    background: #fff;
    border-top: 1px solid #e5efe7;
    box-shadow: 0 -8px 24px rgba(26, 92, 44, 0.06);
}

.footer-active-indicator {
    position: absolute;
    left: 14px;
    bottom: 24px;
    width: calc((100% - 28px) / 5);
    height: 32px;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
}

.footer-active-indicator--visible {
    opacity: 1;
}

.footer-active-indicator::before {
    content: "";
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 auto;
    border-radius: 10px;
    background: #dff9e8;
}

.footer-item {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    /*gap: 10px;*/
    min-width: 0;
}

.footer-item--center {
    margin-top: -34px;
}

.footer-icon-shell {
    width: 32px;
    height: 32px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.footer-icon-shell--active {
    background: transparent;
}

.footer-icon-shell--center {
    /*width: 42px;
    height: 42px;*/
    width: 64px;
    height: 48px;
    border-radius: 9999px;
    /*background: #fff;
    box-shadow:
        0 0 0 4px #ffffff,
        0 10px 22px rgba(30, 167, 76, 0.26);*/
}

.footer-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.footer-icon--center {
    /*width: 42px;
    height: 42px;*/
    width: 84px;
    height: 84px;
}

.footer-label {
    color: #719474;
    font-size: 11px;
    line-height: 1.1;
    text-align: center;
    transition: color 0.2s ease;
}

.footer-label--active {
    color: #1ea74c;
    font-weight: 600;
}

.footer-item--center .footer-label {
    font-size: 12px;
}
</style>
