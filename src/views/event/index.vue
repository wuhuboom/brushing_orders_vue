<template>
    <div class="event-page">
        <PageTopBar :title="$t('event')" show-back @click-left="onClickLeft" />

        <div class="event-body">
            <section class="event-hero">
                <div class="event-hero__eyebrow">
                    🎁 {{ $t("limited_time_offers") }}
                </div>

                <h1 class="event-hero__title">
                    {{ $t("events_promotions") }}
                </h1>

                <p class="event-hero__desc">
                    {{ $t("events_desc") }}
                </p>

                <div class="event-hero__stats">
                    <div class="event-hero__stat">
                        <span class="event-hero__stat-icon">📋</span>
                        <strong>{{ allCount }}</strong>
                        <span>{{ $t("all_events") }}</span>
                    </div>

                    <div class="event-hero__stat">
                        <span class="event-hero__stat-icon">🔥</span>
                        <strong>{{ activeCount }}</strong>
                        <span>{{ $t("active") }}</span>
                    </div>

                    <div class="event-hero__stat">
                        <span class="event-hero__stat-icon">⭐</span>
                        <strong>{{ hotCount }}</strong>
                        <span>{{ $t("hot") }}</span>
                    </div>
                </div>

                <span class="event-hero__orb"></span>
            </section>

            <div class="event-tabs">
                <button
                    type="button"
                    class="event-tab"
                    :class="{ 'event-tab--active': activeTab === 'all' }"
                    @click="activeTab = 'all'"
                >
                    {{ $t("all_events") }}
                </button>

                <button
                    type="button"
                    class="event-tab"
                    :class="{ 'event-tab--active': activeTab === 'active' }"
                    @click="activeTab = 'active'"
                >
                    🔥 {{ $t("active") }}
                </button>

                <button
                    type="button"
                    class="event-tab"
                    :class="{ 'event-tab--active': activeTab === 'hot' }"
                    @click="activeTab = 'hot'"
                >
                    ⭐ {{ $t("hot") }}
                </button>
            </div>

            <Transition name="event-tab-fade" mode="out-in">
                <div
                    v-if="filteredEventSections.length"
                    :key="activeTab"
                    class="event-card-list"
                >
                    <article
                        v-for="(section, index) in filteredEventSections"
                        :key="`${section.tag}-${section.title}-${index}`"
                        class="event-card"
                        :class="eventThemes[index % eventThemes.length]"
                    >
                        <div class="event-card__banner">
                            <div class="event-card__banner-content">
                                <span class="event-card__tag">
                                    {{
                                        section.tag ||
                                        eventTags[index % eventTags.length]
                                    }}
                                </span>

                                <h3 class="event-card__title">
                                    {{
                                        section.title ||
                                        $t("promotion_with_number", {
                                            number: index + 1,
                                        })
                                    }}
                                </h3>

                                <div class="event-card__summary">
                                    {{ section.summary }}
                                </div>
                            </div>

                            <div class="event-card__emoji">
                                {{
                                    section.icon ||
                                    eventEmojis[index % eventEmojis.length]
                                }}
                            </div>
                        </div>

                        <div class="event-card__body">
                            <div
                                v-if="section.progress"
                                class="event-card__progress-wrap"
                            >
                                <div class="event-card__progress-row">
                                    <span>Progress</span>
                                    <strong>{{ section.progress }}</strong>
                                </div>

                                <div class="event-card__progress">
                                    <span
                                        :style="{
                                            width: getProgressWidth(
                                                section.progress,
                                            ),
                                        }"
                                    ></span>
                                </div>
                            </div>

                            <div class="event-card__info-row">
                                <div class="event-card__info-main">
                                    <div class="event-card__reward">
                                        <van-icon name="gift-o" />
                                        <strong>{{ section.reward }}</strong>
                                    </div>

                                    <div class="event-card__meta">
                                        <span v-if="section.time">
                                            <van-icon name="clock-o" />
                                            {{ section.time }}
                                        </span>

                                        <span v-if="section.joined">
                                            <van-icon name="friends-o" />
                                            {{ section.joined }}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    class="event-card__btn"
                                    :class="{ 'is-disabled': section.disabled }"
                                    type="button"
                                >
                                    {{ section.buttonText || "Join Now" }}
                                    <van-icon
                                        v-if="!section.disabled"
                                        name="arrow"
                                    />
                                </button>
                            </div>

                            <div
                                v-if="section.content"
                                class="event-card__content rich-content"
                                v-html="section.content"
                            ></div>
                        </div>
                    </article>
                </div>

                <div
                    v-else
                    :key="`${activeTab}-empty`"
                    class="event-fallback rich-content"
                >
                    {{ $t("latest_event_details") }}
                </div>
            </Transition>

            <div class="event-footer">
                <p>{{ $t("event_footer_line1") }}</p>
                <p>{{ $t("event_footer_line2") }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t, tm } = useI18n();

const activeTab = ref("all");

const eventThemes = [
    "theme-green",
    "theme-blue",
    "theme-orange",
    "theme-purple",
];

const eventTags = computed(() => [
    t("active").toUpperCase(),
    t("hot").toUpperCase(),
    t("active").toUpperCase(),
    t("hot").toUpperCase(),
]);

const eventEmojis = ["⚡", "🎁", "💎", "🏆"];

const eventSections = computed(() => {
    const sections = tm("event_sections");
    return Array.isArray(sections) ? sections : [];
});

const filteredEventSections = computed(() => {
    if (activeTab.value === "all") {
        return eventSections.value;
    }

    return eventSections.value.filter((item) => {
        return String(item.tag || "").toLowerCase() === activeTab.value;
    });
});

const allCount = computed(() => eventSections.value.length);

const activeCount = computed(() => {
    return eventSections.value.filter((item) => {
        return String(item.tag || "").toUpperCase() === "ACTIVE";
    }).length;
});

const hotCount = computed(() => {
    return eventSections.value.filter((item) => {
        return String(item.tag || "").toUpperCase() === "HOT";
    }).length;
});

const getProgressWidth = (progress = "") => {
    if (!progress) return "0%";

    const match = String(progress).match(/([\d,.]+)\s*\/\s*([\d,.]+)/);

    if (!match) return "0%";

    const current = Number(match[1].replace(/,/g, ""));
    const total = Number(match[2].replace(/,/g, ""));

    if (!current || !total) return "0%";

    const percent = Math.min((current / total) * 100, 100);

    return `${percent}%`;
};

const onClickLeft = () => {
    history.back();
};
</script>

<style scoped>
.event-page {
    min-height: 100vh;
    background: #edf4ef;
}

.event-body {
    padding: 78px 16px 24px;
}

.event-hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 18px 18px 20px;
    background: linear-gradient(135deg, #209a4c 0%, #1f8e43 100%);
    color: #fff;
    box-shadow: 0 16px 30px rgba(31, 142, 67, 0.16);
}

.event-hero__eyebrow {
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.06em;
    font-weight: 600;
}

.event-hero__title {
    margin: 10px 0 8px;
    font-size: 20px;
    line-height: 30px;
    font-weight: 700;
}

.event-hero__desc {
    position: relative;
    z-index: 1;
    margin: 0;
    font-size: 14px;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.92);
}

.event-hero__stats {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
}

.event-hero__stat {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.13);
    padding: 12px 8px;
    text-align: center;
}

.event-hero__stat strong {
    display: block;
    margin-top: 8px;
    font-size: 17px;
    line-height: 24px;
}

.event-hero__stat span {
    display: block;
    font-size: 12px;
    line-height: 18px;
}

.event-hero__stat-icon {
    font-size: 18px;
}

.event-hero__orb {
    position: absolute;
    width: 96px;
    height: 96px;
    right: -18px;
    top: -18px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.event-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin: 18px 0;
}

.event-tab {
    height: 42px;
    border-radius: 999px;
    border: 1px solid #d7e7da;
    background: #fff;
    color: #6d856e;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    white-space: nowrap;
    padding: 0 8px;
    transition:
        background-color 0.24s ease,
        border-color 0.24s ease,
        color 0.24s ease,
        box-shadow 0.24s ease,
        transform 0.24s ease;
}

.event-tab:active {
    transform: scale(0.96);
}

.event-tab--active {
    background: #28a34d;
    border-color: #28a34d;
    color: #fff;
    box-shadow: 0 8px 18px rgba(40, 163, 77, 0.2);
    transform: translateY(-1px);
}

.event-tab-fade-enter-active,
.event-tab-fade-leave-active {
    transition:
        opacity 0.24s ease,
        transform 0.24s ease,
        filter 0.24s ease;
}

.event-tab-fade-enter-from {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
    filter: blur(2px);
}

.event-tab-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.985);
    filter: blur(2px);
}

.event-tab-fade-enter-to,
.event-tab-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
}

.event-card-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.event-card {
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid #d7e9da;
    background: #fff;
    box-shadow: 0 10px 24px rgba(27, 78, 43, 0.06);
}

.event-card__banner {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 16px 16px 18px;
    color: #fff;
}

.event-card__banner::after {
    content: "";
    position: absolute;
    width: 98px;
    height: 98px;
    right: -34px;
    bottom: -34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.event-card__banner-content {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
}

.event-card__tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    color: #239647;
    font-size: 11px;
    line-height: 16px;
    font-weight: 700;
}

.event-card__title {
    margin: 14px 0 8px;
    font-size: 18px;
    line-height: 28px;
    font-weight: 700;
}

.event-card__summary {
    font-size: 14px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.92);
}

.event-card__emoji {
    position: relative;
    z-index: 1;
    font-size: 24px;
    line-height: 1;
}

.event-card__body,
.event-fallback {
    background: #fff;
    padding: 14px 16px 16px;
}

.event-card__progress-wrap {
    margin-bottom: 12px;
}

.event-card__progress-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
    color: #5d775f;
    font-size: 12px;
    line-height: 18px;
}

.event-card__progress-row strong {
    color: #22994c;
    font-weight: 700;
}

.event-card__progress {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: #d9f0df;
    overflow: hidden;
}

.event-card__progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #21a651;
}

.event-card__info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.event-card__info-main {
    flex: 1;
    min-width: 0;
}

.event-card__reward {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #22a050;
    font-size: 14px;
    line-height: 22px;
}

.event-card__reward strong {
    font-weight: 700;
}

.event-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
    color: #6e8670;
    font-size: 11px;
    line-height: 18px;
}

.event-card__meta span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
}

.event-card__btn {
    flex-shrink: 0;
    min-width: 104px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: #24a956;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.event-card__btn.is-disabled {
    background: #d8eadf;
    color: #6f9278;
}

.event-card__content {
    margin-top: 14px;
    border-top: 1px solid #edf5ef;
    padding-top: 14px;
}

.theme-green .event-card__banner {
    background: linear-gradient(135deg, #209a4c 0%, #1d8f43 100%);
}

.theme-blue .event-card__banner {
    background: linear-gradient(135deg, #2964cf 0%, #1f53b5 100%);
}

.theme-orange .event-card__banner {
    background: linear-gradient(135deg, #de5f1b 0%, #c54f18 100%);
}

.theme-purple .event-card__banner {
    background: linear-gradient(135deg, #8438d1 0%, #6f2fbe 100%);
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p),
.rich-content :deep(li) {
    margin: 0 0 10px;
    color: #5d775f;
    font-size: 13px;
    line-height: 24px;
}

.rich-content :deep(p:last-child),
.rich-content :deep(li:last-child) {
    margin-bottom: 0;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
    margin: 0 0 10px;
    padding-left: 18px;
}

.rich-content :deep(table) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
}

.rich-content :deep(td),
.rich-content :deep(th) {
    padding: 11px 12px;
    background: #eef6ef;
    color: #314531;
    font-size: 13px;
    line-height: 20px;
}

.rich-content :deep(td:first-child),
.rich-content :deep(th:first-child) {
    border-radius: 10px 0 0 10px;
}

.rich-content :deep(td:last-child),
.rich-content :deep(th:last-child) {
    border-radius: 0 10px 10px 0;
}

.rich-content :deep(.event-section-block h4) {
    margin: 0 0 12px;
    color: #1f2b1f;
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
}

.rich-content :deep(.event-reward-grid),
.rich-content :deep(.event-bonus-grid) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.rich-content :deep(.event-reward-grid div),
.rich-content :deep(.event-bonus-grid div) {
    border-radius: 12px;
    background: #f2f8f4;
    padding: 12px 10px;
    text-align: center;
}

.rich-content :deep(.event-reward-grid strong),
.rich-content :deep(.event-bonus-grid strong) {
    display: block;
    color: #1f4fa3;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
}

.rich-content :deep(.event-reward-grid span),
.rich-content :deep(.event-bonus-grid span) {
    display: block;
    margin-top: 6px;
    color: #244f9e;
    font-size: 12px;
    line-height: 18px;
}

.rich-content :deep(.event-reward-grid b),
.rich-content :deep(.event-bonus-grid b) {
    display: block;
    margin-top: 6px;
    color: #ff633a;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
}

.event-fallback {
    border-radius: 18px;
    border: 1px solid #d7e9da;
    box-shadow: 0 10px 24px rgba(27, 78, 43, 0.06);
}

.event-footer {
    margin-top: 18px;
    padding: 20px 16px 28px;
    text-align: center;
    color: #6d7d70;
    font-size: 13px;
    line-height: 22px;
}

.event-footer p {
    margin: 0;
}

.event-footer p + p {
    margin-top: 6px;
}

:deep(.event-nav .van-nav-bar) {
    background: #fff;
}

:deep(.event-nav .van-nav-bar__title) {
    color: #1e291e;
    font-size: 18px;
    font-weight: 600;
}

:deep(.event-nav .van-icon-arrow-left) {
    color: #28a14d;
    font-size: 22px;
}
</style>
