<template>
    <van-dialog
        v-model:show="dialogVisible"
        :title="''"
        :show-confirm-button="false"
        :close-on-click-overlay="false"
        class-name="task-order-dialog-panel"
        overlay-class="task-order-dialog-overlay"
        :style="dialogStyle"
        @closed="emit('closed')"
    >
        <div class="task-order-dialog">
            <div class="task-order-dialog__header">
                <button
                    type="button"
                    class="task-order-dialog__back"
                    @click="emit('back')"
                >
                    <van-icon name="arrow-left" size="18" color="#24a54b" />
                </button>
                <div class="task-order-dialog__title">{{ title }}</div>
            </div>

            <div class="task-order-dialog__stepper">
                <template v-for="stepIndex in 3" :key="stepIndex">
                    <div
                        class="task-order-step"
                        :class="{
                            'task-order-step--active': isActiveStep(stepIndex),
                            'task-order-step--done': isDoneStep(stepIndex),
                        }"
                    >
                        <div class="task-order-step__circle">
                            <img
                                v-if="isDoneStep(stepIndex)"
                                :src="stepCheckIcon"
                                class="task-order-step__check"
                                alt=""
                            />
                            <span v-else>{{ stepIndex }}</span>
                        </div>
                        <div class="task-order-step__label">
                            {{ stepLabels[stepIndex - 1] }}
                        </div>
                    </div>
                    <div
                        v-if="stepIndex < 3"
                        class="task-order-dialog__line"
                        :class="{
                            'task-order-dialog__line--done':
                                currentStep > stepIndex,
                        }"
                    ></div>
                </template>
            </div>

            <div v-if="showProduct" class="task-order-product">
                <div class="task-order-product__thumb">
                    <img
                        v-if="coverUrl"
                        :src="coverUrl"
                        class="task-order-product__image"
                        alt=""
                    />
                </div>
                <div class="task-order-product__content">
                    <div class="task-order-product__name">{{ productName }}</div>
                    <div class="task-order-product__meta">
                        {{ amountLabel }}:<span>{{ amountText }}</span>
                    </div>
                    <div
                        class="task-order-product__meta task-order-product__meta--accent"
                    >
                        {{ commissionLabel }}:<span>{{ commissionText }}</span>
                    </div>
                </div>
            </div>

            <slot
                v-if="currentStep !== 3"
                name="panel"
                :step="currentStep"
            ></slot>

            <div v-else class="task-order-success">
                <div class="task-order-success__icon">
                    <img :src="successIcon" alt="" />
                </div>
                <div class="task-order-success__text">{{ successMessage }}</div>
            </div>

            <div v-if="showWarning" class="task-order-warning">
                <van-icon name="warning-o" size="18" color="#d23f36" />
                <span>{{ warningText }}</span>
                <button
                    v-if="warningActionText"
                    type="button"
                    class="task-order-warning__link"
                    @click="emit('warning-action')"
                >
                    {{ warningActionText }}
                </button>
            </div>

            <div class="task-order-dialog__footer">
                <button
                    type="button"
                    class="task-order-dialog__action"
                    :class="{
                        'task-order-dialog__action--small': currentStep === 3,
                    }"
                    :disabled="actionDisabled"
                    @click="emit('primary')"
                >
                    <span
                        v-if="actionLoading"
                        class="task-order-dialog__spinner"
                    ></span>
                    <span v-else>{{ actionText }}</span>
                </button>
            </div>
        </div>
    </van-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    step: {
        type: Number,
        default: 1,
    },
    stepLabels: {
        type: Array,
        default: () => [],
    },
    productName: {
        type: String,
        default: "",
    },
    coverUrl: {
        type: String,
        default: "",
    },
    amountLabel: {
        type: String,
        default: "",
    },
    amountText: {
        type: String,
        default: "",
    },
    commissionLabel: {
        type: String,
        default: "",
    },
    commissionText: {
        type: String,
        default: "",
    },
    successMessage: {
        type: String,
        default: "",
    },
    showWarning: {
        type: Boolean,
        default: false,
    },
    warningText: {
        type: String,
        default: "",
    },
    warningActionText: {
        type: String,
        default: "",
    },
    actionText: {
        type: String,
        default: "",
    },
    actionLoading: {
        type: Boolean,
        default: false,
    },
    actionDisabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    "update:modelValue",
    "back",
    "primary",
    "closed",
    "warning-action",
]);

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const currentStep = computed(() => Number(props.step || 1));

const dialogStyle = {
    width: "100%",
    maxWidth: "var(--app-pc-max-width, 375px)",
    height: "100vh",
    background: "#fff",
    borderRadius: "0px",
};

const stepCheckIcon = new URL(
    "@/static/images/order-step-check.png",
    import.meta.url,
).href;
const successIcon = new URL(
    "@/static/images/order-success-check.png",
    import.meta.url,
).href;

const showProduct = computed(() => currentStep.value !== 3 && !!props.productName);

const isDoneStep = (stepIndex) => currentStep.value >= stepIndex;

const isActiveStep = (stepIndex) =>
    currentStep.value === stepIndex && currentStep.value !== 3;
</script>

<style scoped>
.task-order-dialog {
    display: flex;
    min-height: 100vh;
    max-height: 100vh;
    flex-direction: column;
    overflow-y: auto;
    background: #f4faf5;
    padding-bottom: 24px;
    box-sizing: border-box;
}

.task-order-dialog__header {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    min-height: 76px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dcecdf;
    background: #fff;
    padding: 18px 18px 14px;
}

.task-order-dialog__back {
    position: absolute;
    left: 16px;
    top: 50%;
    border: 0;
    background: transparent;
    padding: 8px;
    line-height: 1;
    transform: translateY(-50%);
}

.task-order-dialog__title {
    color: #1c261d;
    font-size: 18px;
    font-weight: 600;
}

.task-order-dialog__stepper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #fff;
    padding: 22px 16px 20px;
    border-bottom: 1px solid #e6f0e8;
}

.task-order-step {
    display: flex;
    width: 86px;
    flex-direction: column;
    align-items: center;
}

.task-order-step__circle {
    display: flex;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #dcebe0;
    color: #8caa94;
    font-size: 13px;
    font-weight: 600;
}

.task-order-step__check {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.task-order-step__label {
    margin-top: 10px;
    color: #88a089;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
}

.task-order-step--active .task-order-step__circle,
.task-order-step--done .task-order-step__circle {
    background: #21a149;
    color: #fff;
}

.task-order-step--active .task-order-step__label,
.task-order-step--done .task-order-step__label {
    color: #1f9c47;
}

.task-order-dialog__line {
    flex: 1;
    min-width: 34px;
    max-width: 78px;
    height: 3px;
    margin-top: 18px;
    border-radius: 999px;
    background: #dcebe0;
}

.task-order-dialog__line--done {
    background: #9cd3ac;
}

.task-order-product,
.task-order-success,
.task-order-warning,
.task-order-dialog__footer {
    margin: 16px 16px 0;
}

.task-order-product {
    display: flex;
    gap: 14px;
    border-radius: 18px;
    background: #fff;
    padding: 16px;
    box-shadow: 0 8px 20px rgba(38, 126, 61, 0.08);
}

.task-order-product__thumb {
    width: 92px;
    height: 92px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 12px;
    background: #f1f4f1;
}

.task-order-product__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.task-order-product__content {
    min-width: 0;
    flex: 1;
    padding-top: 4px;
}

.task-order-product__name {
    color: #172217;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.35;
}

.task-order-product__meta {
    margin-top: 10px;
    color: #668368;
    font-size: 15px;
    line-height: 1.2;
}

.task-order-product__meta span {
    color: #2a3c2d;
}

.task-order-product__meta--accent,
.task-order-product__meta--accent span {
    color: #18a647;
}

.task-order-success {
    display: flex;
    min-height: 280px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 10px;
}

.task-order-success__icon {
    display: flex;
    width: 104px;
    height: 104px;
    align-items: center;
    justify-content: center;
}

.task-order-success__icon img {
    width: 76px;
    height: 76px;
    object-fit: contain;
}

.task-order-success__text {
    margin-top: 14px;
    color: #199f45;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
}

.task-order-warning {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #efb7b3;
    border-radius: 14px;
    background: #fff4f3;
    padding: 14px 16px;
    color: #d23f36;
    font-size: 14px;
    line-height: 1.3;
}

.task-order-warning__link {
    border: 0;
    background: transparent;
    padding: 0;
    color: #24a44b;
    font-weight: 600;
}

.task-order-dialog__footer {
    padding: 20px 16px 28px;
}

.task-order-dialog__action {
    display: flex;
    width: 100%;
    height: 62px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 0;
    border-radius: 16px;
    background: linear-gradient(180deg, #2fc867 0%, #159c42 100%);
    box-shadow: 0 12px 24px rgba(33, 150, 72, 0.18);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
}

.task-order-dialog__action:disabled {
    opacity: 0.72;
}

.task-order-dialog__action--small {
    display: block;
    width: 246px;
    max-width: 100%;
    margin: 0 auto;
}

.task-order-dialog__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: taskOrderDialogSpin 0.75s linear infinite;
}

@keyframes taskOrderDialogSpin {
    to {
        transform: rotate(360deg);
    }
}

:deep(.van-dialog__content) {
    height: 100%;
    overflow: hidden;
}

:global(.task-order-dialog-panel) {
    left: 50% !important;
    top: 0 !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    max-width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    height: 100vh !important;
    height: 100dvh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    transform: translate3d(-50%, 0, 0) !important;
}

:global(.task-order-dialog-panel .van-dialog__content) {
    height: 100%;
    overflow: hidden;
}

:global(.task-order-dialog-overlay) {
    left: 50% !important;
    right: auto !important;
    width: min(100vw, var(--app-pc-max-width, 375px)) !important;
    transform: translateX(-50%) !important;
}

@media (max-width: 767px) {
    :global(.task-order-dialog-panel) {
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        transform: none !important;
    }

    :global(.task-order-dialog-overlay) {
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        transform: none !important;
    }
}
</style>
