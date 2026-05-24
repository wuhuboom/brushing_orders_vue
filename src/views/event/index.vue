<template>
    <div class="algofy-event-page">
        <PageTopBar :title="$t('event_title')" show-back @click-left="onClickLeft" />

        <section class="event-hero">
            <div class="hero-overlay">
                <h1>{{ $t("event_hero_title") }}</h1>
                <p>{{ $t("event_hero_subtitle") }}</p>
            </div>
        </section>

        <main class="event-content">
            <section class="vip-table-card">
                <div class="vip-table-head">
                    <div>{{ $t("event_vip_level") }}</div>
                    <div>{{ $t("event_profit_trade") }}</div>
                    <div>{{ $t("event_tasks_count") }}</div>
                    <div>{{ $t("event_unlock_requirement") }}</div>
                </div>
                <div
                    v-for="row in vipRows"
                    :key="row.level"
                    class="vip-table-row"
                >
                    <div>{{ row.level }}</div>
                    <div>{{ row.profit }}</div>
                    <div class="blue-text">{{ row.tasks }}</div>
                    <div class="requirement">
                        <span>{{ $t("event_first_deposit") }}</span>
                        <b>{{ row.deposit }}</b>
                        <span>{{ $t("usd") }}</span>
                    </div>
                </div>
            </section>

            <section class="notice-card">
                <h2>{{ $t("event_user_notice") }}</h2>
                <p>
                    {{ $t("event_notice_copy") }}
                </p>
            </section>

            <button class="event-upgrade" type="button" @click="goVips">
                {{ $t("event_upgrade_now") }}
            </button>
        </main>
    </div>
</template>

<script setup>
import PageTopBar from "@/components/PageTopBar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const vipRows = [
    { level: "VIP 1", profit: "0.5%", tasks: "40", deposit: "100-499" },
    { level: "VIP 2", profit: "1.0%", tasks: "45", deposit: "500-1,599" },
    { level: "VIP 3", profit: "1.5%", tasks: "50", deposit: "1,600-5,499" },
    { level: "VIP 4", profit: "2.0%", tasks: "55", deposit: "5,500-9,999" },
    { level: "VIP 5", profit: "2.5%", tasks: "60", deposit: "10,000" },
];

const goVips = () => {
    router.push({ path: "/vips" });
};

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.algofy-event-page {
    min-height: 100vh;
    background: #f0f2f8;
    color: #111;
    font-family: inherit;
}

.design-topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    height: 52px;
    display: grid;
    grid-template-columns: 56px 1fr 56px;
    align-items: center;
    background: #030303;
    color: #fff;
}

.design-title {
    text-align: center;
    font-size: 18px;
    line-height: 22px;
    font-weight: 800;
    letter-spacing: 0.02em;
}

.design-back {
    width: 52px;
    height: 52px;
    border: 0;
    background: transparent;
    position: relative;
}

.design-back::before {
    content: "";
    position: absolute;
    left: 19px;
    top: 18px;
    width: 13px;
    height: 13px;
    border-left: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(45deg);
    border-radius: 1px;
}

.event-hero {
    height: 210px;
    background: #111 url("@/static/images/event-vip-hero-bg.png") center
        center / cover no-repeat;
    position: relative;
    overflow: visible;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 47px 44px 16px;
    color: #fff;
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.48),
        rgba(0, 0, 0, 0.12)
    );
}

.hero-overlay h1 {
    margin: 0 0 22px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 22px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.hero-overlay p {
    margin: 0;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.event-content {
    padding: 0 16px 34px;
}

.vip-table-card {
    position: relative;
    z-index: 2;
    margin-top: -62px;
    overflow: hidden;
    border-radius: 7px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.09);
}

.vip-table-head {
    height: 65px;
    display: grid;
    grid-template-columns: 0.95fr 1.18fr 0.84fr 1.42fr;
    align-items: center;
    background: linear-gradient(135deg, #263e99 0%, #4290ff 100%);

    border: 1px solid rgba(255, 255, 255, 0.82);
    border-radius: 7px;

    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-table-row {
    min-height: 78px;
    margin: 0 12px;
    display: grid;
    grid-template-columns: 0.95fr 1.18fr 0.84fr 1.42fr;
    align-items: center;

    border-bottom: 1px solid #dedede;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 15px;
    color: #374151;
    line-height: 23px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-table-row:last-child {
    border-bottom: 0;
}

.blue-text,
.requirement b {
    color: #3047f2;
}

.requirement {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
}

.requirement b {
    font-size: 15px;
    line-height: 17px;
    font-weight: 900;
}

.notice-card {
    margin-top: 24px;
    padding: 24px 16px 21px;
    border-radius: 8px;
    background: #e3f2fd;
}

.notice-card h2 {
    margin: 0 0 23px;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.notice-card p {
    margin: 0;
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.event-upgrade {
    width: 100%;
    height: 48px;
    margin-top: 34px;
    border: 0;
    border-radius: 6px;
    background: #3445f3;
    font-family: Montserrat, Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #fafafa;
    line-height: 24px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}
</style>
