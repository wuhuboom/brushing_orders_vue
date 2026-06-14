<template>
    <div class="algofy-event-page">
        <PageTopBar
            :title="$t('event_title')"
            show-back
            @click-left="onClickLeft"
        />

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
.event-hero {
    height: 215px;
    background-image: url("@/static/images/event-vip-hero-bg.png");
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% auto;
    position: relative;
    overflow: visible;
}

/* 设计稿 hero 文案已经在背景图里，这里隐藏原来的文字层 */
.hero-overlay {
    display: none;
}

.event-content {
    padding: 0 18px 47px;
    margin-top: 5px;
}

.vip-table-card {
    position: relative;
    z-index: 2;
    margin-top: -27px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.vip-table-head {
    height: 76px;
    display: grid;
    grid-template-columns: 0.95fr 1.1fr 0.9fr 1.35fr;
    align-items: center;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    box-shadow: 0px 4px 6px 1px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.86);
    border-radius: 8px;

    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.vip-table-row {
    min-height: 94px;
    margin: 0 18px;
    display: grid;
    grid-template-columns: 0.95fr 1.1fr 0.9fr 1.35fr;
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
    font-family: Montserrat, Montserrat;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    font-style: normal;
    text-transform: none;
}

.notice-card {
    margin-top: 20px;
    padding: 20px 20px 29px;
    border-radius: 8px;
    background: #ffffff;
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
    width: calc(100% - 10px);
    height: 48px;
    margin: 33px 5px 0;
    border: 0;
    border-radius: 8px;
    background: #3043e3;
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
