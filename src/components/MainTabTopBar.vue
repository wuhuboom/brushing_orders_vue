<template>
    <header class="main-tab-top-bar">
        <div class="main-tab-top-bar__title">
            <slot>{{ title }}</slot>
        </div>
    </header>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: "",
    },
});
</script>

<style scoped>
.main-tab-top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 900;
    width: 100%;
    height: var(--main-tab-top-bar-height, 104px);
    overflow: hidden;
    background-color: #121212;
    background-image: url("@/static/images/auth/algofy-register-hero.png");
    background-position: center top;
    background-size: 100% 74px;
    background-repeat: no-repeat;
    color: #ffffff;
}

.main-tab-top-bar__title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    box-sizing: border-box;
    overflow: hidden;
    color: #ffffff;
    font-size: 18px;
    line-height: 30px;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
    transform: translateY(0);
    z-index: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

@media (min-width: 768px) {
    .main-tab-top-bar {
        left: 50%;
        right: auto;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}
</style>
