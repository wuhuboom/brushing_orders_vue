<template>
    <transition name="app-loading-fade">
        <div
            v-if="visible"
            class="app-loading-screen"
            :class="{ 'app-loading-screen--solid': solid }"
        >
            <div class="app-loading-screen__wave" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    solid: {
        type: Boolean,
        default: true,
    },
});
</script>
