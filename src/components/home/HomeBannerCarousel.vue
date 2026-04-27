<template>
    <section
        class="home-carousel"
        @wheel.capture.prevent="handleWheel"
        @pointerdown="handlePointerDown"
        @touchstart.passive="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
    >
        <van-swipe
            ref="swipeRef"
            class="home-carousel__swipe"
            :autoplay="carouselAutoplay"
            :loop="normalizedItems.length > 1"
            :show-indicators="false"
            :touchable="normalizedItems.length > 1"
            :stop-propagation="false"
            @change="handleChange"
        >
            <van-swipe-item
                v-for="item in normalizedItems"
                :key="item.id"
                class="home-carousel__slide"
            >
                <button
                    class="home-carousel__button"
                    type="button"
                    @click="handleSlideClick(item.linkUrl)"
                >
                    <img
                        v-if="item.imageUrl && !failedImages[item.id]"
                        class="home-carousel__image"
                        :src="item.imageUrl"
                        :alt="item.name || fallbackTitle"
                        draggable="false"
                        @error="failedImages[item.id] = true"
                    />
                </button>
            </van-swipe-item>
        </van-swipe>

        <button
            v-if="normalizedItems.length > 1"
            class="home-carousel__arrow home-carousel__arrow--left"
            type="button"
            @click.stop="prevByUser"
        >
            <van-icon name="arrow-left" size="18" color="#ffffff" />
        </button>
        <button
            v-if="normalizedItems.length > 1"
            class="home-carousel__arrow home-carousel__arrow--right"
            type="button"
            @click.stop="nextByUser"
        >
            <van-icon name="arrow" size="18" color="#ffffff" />
        </button>

        <div v-if="normalizedItems.length > 1" class="home-carousel__dots">
            <button
                v-for="(_, index) in normalizedItems"
                :key="index"
                type="button"
                class="home-carousel__dot"
                :class="{ 'home-carousel__dot--active': index === activeIndex }"
                @click.stop="goByUser(index)"
            ></button>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";

import { bannerList } from "@/api/apis";

const props = defineProps({
    fallbackTitle: {
        type: String,
        default: "",
    },
});

const router = useRouter();
const banners = ref([]);
const activeIndex = ref(0);
const failedImages = ref({});
const swipeRef = ref(null);
const autoplayEnabled = ref(true);
let wheelLocked = false;
let suppressClickTimer = null;
let autoplayResumeTimer = null;
const suppressSlideClick = ref(false);

const USER_AUTOPLAY_RESUME_DELAY = 5000;

const dragState = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
};

const imageBaseUrl = window.g?.VITE_API_IMG_URL || "";

const carouselAutoplay = computed(() => {
    return autoplayEnabled.value && normalizedItems.value.length > 1 ? 3500 : 0;
});

const normalizedItems = computed(() => {
    const list = banners.value
        .map((item, index) => ({
            id: item.id || `${item.name || "banner"}-${index}`,
            name: item.name || props.fallbackTitle,
            imageUrl: normalizeImage(item.imageUrl),
            linkUrl: item.linkUrl || "",
            sort: Number(item.sort ?? index),
        }))
        .sort((a, b) => a.sort - b.sort);

    if (list.length) return list;

    return [
        {
            id: "fallback",
            name: props.fallbackTitle,
            imageUrl: "",
            linkUrl: "/starting",
            sort: 0,
        },
    ];
});

function normalizeImage(url) {
    if (!url) return "";
    if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
    return `${imageBaseUrl}${url}`;
}

function handleChange(index) {
    activeIndex.value = index;
}

function clearAutoplayResumeTimer() {
    if (autoplayResumeTimer) {
        window.clearTimeout(autoplayResumeTimer);
        autoplayResumeTimer = null;
    }
}

function resumeAutoplay() {
    clearAutoplayResumeTimer();
    if (normalizedItems.value.length > 1) {
        autoplayEnabled.value = true;
    }
}

function pauseAutoplayTemporarily(delay = USER_AUTOPLAY_RESUME_DELAY) {
    autoplayEnabled.value = false;
    clearAutoplayResumeTimer();

    if (normalizedItems.value.length <= 1) return;

    autoplayResumeTimer = window.setTimeout(() => {
        autoplayResumeTimer = null;
        resumeAutoplay();
    }, delay);
}

function markSlideClickSuppressed() {
    suppressSlideClick.value = true;
    if (suppressClickTimer) {
        window.clearTimeout(suppressClickTimer);
    }
    suppressClickTimer = window.setTimeout(() => {
        suppressSlideClick.value = false;
        suppressClickTimer = null;
    }, 220);
}

function prev() {
    if (normalizedItems.value.length <= 1) return;
    swipeRef.value?.prev();
}

function next() {
    if (normalizedItems.value.length <= 1) return;
    swipeRef.value?.next();
}

function go(index) {
    if (!normalizedItems.value.length) return;
    swipeRef.value?.swipeTo(index);
    activeIndex.value = index;
}

function prevByUser() {
    pauseAutoplayTemporarily();
    prev();
}

function nextByUser() {
    pauseAutoplayTemporarily();
    next();
}

function goByUser(index) {
    pauseAutoplayTemporarily();
    go(index);
}

function handleTouchStart() {
    if (normalizedItems.value.length > 1) {
        pauseAutoplayTemporarily(7000);
    }
}

function handleTouchEnd() {
    if (normalizedItems.value.length > 1) {
        pauseAutoplayTemporarily();
    }
}

function handleWheel(event) {
    if (normalizedItems.value.length <= 1 || wheelLocked) return;
    pauseAutoplayTemporarily();
    const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
    if (Math.abs(delta) < 8) return;

    wheelLocked = true;
    markSlideClickSuppressed();
    delta > 0 ? next() : prev();
    window.setTimeout(() => {
        wheelLocked = false;
    }, 420);
}

function handlePointerDown(event) {
    if (normalizedItems.value.length <= 1) return;
    pauseAutoplayTemporarily(7000);

    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragState.active = true;
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.moved = false;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
}

function handlePointerMove(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;

    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;

    const deltaX = dragState.lastX - dragState.startX;
    const deltaY = dragState.lastY - dragState.startY;
    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        dragState.moved = true;
    }
}

function handlePointerEnd(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) return;

    const deltaX = dragState.lastX - dragState.startX;
    const deltaY = dragState.lastY - dragState.startY;
    const isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);

    if (dragState.moved) {
        markSlideClickSuppressed();
    }

    if (isHorizontalDrag && Math.abs(deltaX) >= 36) {
        pauseAutoplayTemporarily();
        deltaX < 0 ? next() : prev();
    } else {
        pauseAutoplayTemporarily();
    }

    resetPointerDrag();
}

function resetPointerDrag() {
    dragState.active = false;
    dragState.pointerId = null;
    dragState.startX = 0;
    dragState.startY = 0;
    dragState.lastX = 0;
    dragState.lastY = 0;
    dragState.moved = false;

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerEnd);
    window.removeEventListener("pointercancel", handlePointerEnd);
}

function handleSlideClick(linkUrl) {
    if (suppressSlideClick.value) return;
    openLink(linkUrl);
}

function openLink(linkUrl) {
    if (!linkUrl) return;
    if (/^https?:\/\//.test(linkUrl)) {
        window.location.href = linkUrl;
        return;
    }
    router.push(linkUrl.startsWith("/") ? linkUrl : `/${linkUrl}`);
}

async function loadBanners() {
    try {
        const res = await bannerList();
        banners.value = Array.isArray(res?.data) ? res.data : [];
        activeIndex.value = 0;
        await nextTick();
        swipeRef.value?.swipeTo(0, { immediate: true });
    } catch (error) {
        banners.value = [];
        activeIndex.value = 0;
    }
}

loadBanners();

onBeforeUnmount(() => {
    resetPointerDrag();
    if (suppressClickTimer) {
        window.clearTimeout(suppressClickTimer);
        suppressClickTimer = null;
    }
    clearAutoplayResumeTimer();
});
</script>

<style scoped>
.home-carousel {
    position: relative;
    overflow: hidden;
    border: 1px solid #d4ecd8;
    border-radius: 22px;
    background: #148b3a;
    box-shadow: 0 8px 22px rgba(34, 125, 58, 0.06);
    user-select: none;
    touch-action: pan-y;
}

.home-carousel__swipe,
.home-carousel__slide {
    height: 148px;
}

.home-carousel__button {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
}

.home-carousel__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    -webkit-user-drag: none;
}

.home-carousel__arrow {
    position: absolute;
    top: 50%;
    z-index: 5;
    display: flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.22);
    transform: translateY(-50%);
}

.home-carousel__arrow--left {
    left: 14px;
}

.home-carousel__arrow--right {
    right: 14px;
}

.home-carousel__dots {
    position: absolute;
    right: 22px;
    bottom: 22px;
    z-index: 5;
    display: flex;
    gap: 8px;
}

.home-carousel__dot {
    width: 7px;
    height: 7px;
    border: 0;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.42);
    transition: width 180ms ease, background-color 180ms ease;
}

.home-carousel__dot--active {
    width: 28px;
    background: rgba(255, 255, 255, 0.96);
}
</style>
