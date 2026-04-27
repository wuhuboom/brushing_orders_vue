<template>
    <section class="welcome-summary">
        <div>
            <div class="welcome-summary__eyebrow">
                <slot name="eyebrow">
                    {{ eyebrow }}
                    <span class="ml-1" aria-hidden="true">&#128075;</span>
                </slot>
            </div>
            <div class="welcome-summary__name">
                <slot name="title">{{ title }}</slot>
            </div>
        </div>

        <div class="welcome-summary__actions">
            <slot name="actions">
                <button
                    v-if="showNotice"
                    class="welcome-summary__notice"
                    type="button"
                    @click="$emit('notice')"
                >
                    <img src="@/static/images/home/alert1.png" />
                    <span v-if="noticeCount" class="welcome-summary__badge">{{
                        noticeCount
                    }}</span>
                </button>
            </slot>
        </div>
    </section>
</template>

<script setup>
defineProps({
    eyebrow: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        default: "",
    },
    noticeCount: {
        type: [Number, String],
        default: "",
    },
    showNotice: {
        type: Boolean,
        default: true,
    },
});

defineEmits(["notice"]);
</script>

<style scoped>
.welcome-summary {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 13px 24px 15px;
    background: #ffffff;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.06);
}

@media (min-width: 768px) {
    .welcome-summary {
        left: 50%;
        right: auto;
        width: 100%;
        max-width: var(--app-pc-max-width, 375px);
        transform: translateX(-50%);
    }
}

.welcome-summary__eyebrow {
    color: #128d3d;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.25;
}

.welcome-summary__name {
    margin-top: 4px;
    color: #08130c;
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.01em;
}

.welcome-summary__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.welcome-summary__notice {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(34, 160, 80, 0.2);
    border-radius: 20px;
    background: rgba(34, 160, 80, 0.1);
}

.welcome-summary__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9999px;
    background: #ff5f61;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    line-height: 18px;
    text-align: center;
}
</style>
