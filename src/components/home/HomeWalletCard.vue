<template>
    <section class="home-wallet-summary">
        <div class="flex items-start justify-between">
            <div>
                <div class="text-[15px] font-bold text-white">{{ title }}</div>
                <div
                    class="mt-5 flex items-center gap-1 text-[14px] text-white/90"
                >
                    <span>{{ balanceLabel }}</span>
                    <van-icon
                        name="eye-o"
                        size="15"
                        color="rgba(255,255,255,0.72)"
                    />
                </div>
            </div>
            <div class="home-vip-chip">
                <img :src="vipCrownIcon" alt="" />
                <span>{{ vipLabel }}</span>
            </div>
        </div>

        <div
            class="mt-3 text-[32px] font-extrabold tracking-[-0.03em] text-white"
        >
            ${{ formatMoney(balance) }}
        </div>

        <div class="home-wallet-summary__metrics">
            <div
                class="home-wallet-summary__metric home-wallet-summary__metric--left"
            >
                <div class="home-wallet-summary__metric-label">
                    {{ todayLabel }}
                </div>
                <div class="home-wallet-summary__metric-value">
                    +${{ formatMoney(todayEarnings) }}
                </div>
            </div>
            <div class="home-wallet-summary__metric">
                <div class="home-wallet-summary__metric-label">
                    {{ totalLabel }}
                </div>
                <div class="home-wallet-summary__metric-value">
                    ${{ formatMoney(totalEarnings) }}
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const vipCrownIcon = new URL(
    "@/static/images/home-vip-crown-small.png",
    import.meta.url,
).href;

defineProps({
    title: {
        type: String,
        default: "",
    },
    balanceLabel: {
        type: String,
        default: "",
    },
    todayLabel: {
        type: String,
        default: "",
    },
    totalLabel: {
        type: String,
        default: "",
    },
    vipLabel: {
        type: String,
        default: "VIP 1",
    },
    balance: {
        type: [Number, String],
        default: 0,
    },
    todayEarnings: {
        type: [Number, String],
        default: 0,
    },
    totalEarnings: {
        type: [Number, String],
        default: 0,
    },
});

function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
</script>

<style scoped>
.home-wallet-summary {
    position: relative;
    overflow: hidden;
    border: 1px solid #d4ecd8;
    border-radius: 22px;
    background: linear-gradient(145deg, #188f40 0%, #23b75b 100%);
    padding: 20px 20px 20px;
    box-shadow: 0 8px 22px rgba(34, 125, 58, 0.06);
}

.home-wallet-summary::before,
.home-wallet-summary::after {
    content: "";
    position: absolute;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
}

.home-wallet-summary::before {
    right: -16px;
    top: 18px;
    width: 86px;
    height: 86px;
}

.home-wallet-summary::after {
    left: -18px;
    bottom: -28px;
    width: 94px;
    height: 94px;
}

.home-vip-chip {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.22);
    padding: 6px 12px;
    color: #fff3c2;
    font-size: 13px;
    font-weight: 800;
}

.home-vip-chip img {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.home-wallet-summary__metrics {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 24px;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
}

.home-wallet-summary__metric {
    min-width: 0;
    padding: 15px 24px 16px;
}

.home-wallet-summary__metric--left {
    border-right: 1px solid rgba(255, 255, 255, 0.26);
}

.home-wallet-summary__metric-label {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.76);
    font-size: 13px;
    line-height: 1.2;
    /*text-overflow: ellipsis;*/
    white-space: nowrap;
}

.home-wallet-summary__metric-value {
    margin-top: 10px;
    min-width: 0;
    overflow: hidden;
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    /*text-overflow: ellipsis;*/
    white-space: nowrap;
}

@media (max-width: 380px) {
    .home-wallet-summary__metric {
        padding-left: 16px;
        padding-right: 16px;
    }

    .home-wallet-summary__metric-value {
        font-size: 16px;
    }
}
</style>
