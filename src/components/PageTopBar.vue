<template>
    <header class="page-top-bar" :class="`page-top-bar--${variant}`">
        <div class="page-top-bar__content">
            <div
                class="page-top-bar__side page-top-bar__side--left"
                @click="handleLeftClick"
            >
                <slot name="left">
                    <button
                        v-if="showBack"
                        class="page-top-bar__back"
                        type="button"
                        :aria-label="backAriaLabel"
                    >
                        <span></span>
                    </button>
                </slot>
            </div>
            <div class="page-top-bar__title">
                <slot>{{ title }}</slot>
            </div>
            <div
                class="page-top-bar__side page-top-bar__side--right"
                @click="handleRightClick"
            >
                <slot name="right">
                    <span v-if="rightText" class="page-top-bar__right-text">
                        {{ rightText }}
                    </span>
                </slot>
            </div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    showBack: {
        type: Boolean,
        default: false,
    },
    rightText: {
        type: String,
        default: "",
    },
    variant: {
        type: String,
        default: "profile",
    },
    backAriaLabel: {
        type: String,
        default: "Back",
    },
});

const emit = defineEmits(["click-left", "click-right"]);

const handleLeftClick = () => {
    if (!props.showBack) return;
    emit("click-left");
};

const handleRightClick = () => {
    if (!props.rightText) return;
    emit("click-right");
};
</script>

<style scoped>
.page-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    width: 100%;
    height: 52px;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
}

.page-top-bar__content {
    height: 100%;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 64px;
    align-items: center;
}

.page-top-bar__side {
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
}

.page-top-bar__side--left {
    justify-content: center;
}

.page-top-bar__side--right {
    justify-content: flex-end;
    padding-right: 16px;
}

.page-top-bar__title {
    min-width: 0;
    overflow: hidden;
    color: #ffffff;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 52px;
    font-weight: 800;
    letter-spacing: 0.03em;
}

.page-top-bar__back {
    width: 32px;
    height: 32px;
    border: none;
    outline: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.page-top-bar__back span {
    width: 16px;
    height: 16px;
    border-left: 4px solid #ffffff;
    border-bottom: 4px solid #ffffff;
    transform: rotate(45deg);
    border-radius: 2px;
    margin-left: 8px;
}

.page-top-bar__right-text {
    overflow: hidden;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-top-bar--legacy {
    position: fixed;
    left: 0;
    right: 0;
    height: 100px;
    background: #121212;
}

.page-top-bar--legacy::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #121212 url("@/static/images/auth/algofy-register-hero.png")
        center top / cover no-repeat;
    pointer-events: none;
}

.page-top-bar--legacy .page-top-bar__content {
    position: relative;
    z-index: 1;
    grid-template-columns: 72px minmax(0, 1fr) 72px;
    height: 56px;
    padding: 0 10px;
}

.page-top-bar--legacy .page-top-bar__title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.page-top-bar--legacy .page-top-bar__side--left {
    justify-content: flex-start;
    padding-left: 4px;
}

.page-top-bar--legacy .page-top-bar__side--right {
    padding-right: 4px;
}

@media (min-width: 768px) {
    .page-top-bar:not(.page-top-bar--legacy),
    .page-top-bar--legacy {
        left: 50%;
        right: auto;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}
</style>
