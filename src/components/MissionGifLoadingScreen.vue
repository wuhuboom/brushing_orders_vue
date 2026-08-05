<template>
    <transition name="mission-gif-loading-fade">
        <div
            v-if="visible"
            class="mission-gif-loading-screen"
            @touchmove.prevent
            @wheel.prevent
            @dragstart.prevent
        >
            <img
                class="mission-gif-loading-screen__image"
                src="@/static/images/mission-loading.gif"
                alt=""
                draggable="false"
            />
        </div>
    </transition>
</template>

<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});

let lockedElements = [];

function unlockPageScroll() {
    lockedElements.forEach(({ element, overflow, touchAction }) => {
        element.style.overflow = overflow;
        element.style.touchAction = touchAction;
    });
    lockedElements = [];
}

function lockPageScroll() {
    unlockPageScroll();
    const elements = [
        document.documentElement,
        document.body,
        document.getElementById("router-view"),
    ].filter(Boolean);

    lockedElements = elements.map((element) => ({
        element,
        overflow: element.style.overflow,
        touchAction: element.style.touchAction,
    }));

    elements.forEach((element) => {
        element.style.overflow = "hidden";
        element.style.touchAction = "none";
    });
}

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            lockPageScroll();
        } else {
            unlockPageScroll();
        }
    },
    { immediate: true },
);

onBeforeUnmount(unlockPageScroll);
</script>

<style scoped>
.mission-gif-loading-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.68);
    overscroll-behavior: none;
    touch-action: none;
    user-select: none;
    pointer-events: auto;
}

.mission-gif-loading-screen__image {
    display: block;
    width: min(82vw, 360px);
    height: auto;
    object-fit: contain;
    transform: translateX(18%);
    pointer-events: none;
    user-select: none;
}

.mission-gif-loading-fade-enter-active,
.mission-gif-loading-fade-leave-active {
    transition: opacity 0.18s ease;
}

.mission-gif-loading-fade-enter-from,
.mission-gif-loading-fade-leave-to {
    opacity: 0;
}
</style>
