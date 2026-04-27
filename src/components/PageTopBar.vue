<template>
    <header class="page-top-bar">
        <div
            class="page-top-bar__side page-top-bar__side--left"
            @click="handleLeftClick"
        >
            <slot name="left">
                <van-icon
                    v-if="showBack"
                    name="arrow-left"
                    size="20"
                    color="#168843"
                />
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
    z-index: 50;
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr) 96px;
    align-items: center;
    width: 100%;
    height: 53px;
    border-bottom: 1px solid #e7f2ea;
    background: #ffffff;
    color: #111111;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
}

@media (min-width: 768px) {
    .page-top-bar {
        left: 50%;
        right: auto;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}

.page-top-bar__title {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    min-width: 0;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 1px;
}

.page-top-bar__side {
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
}

.page-top-bar__side--left {
    justify-content: flex-start;
}

.page-top-bar__side--right {
    justify-content: flex-end;
    padding-left: 8px;
}

.page-top-bar__right-text {
    overflow: hidden;
    color: #111111;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
