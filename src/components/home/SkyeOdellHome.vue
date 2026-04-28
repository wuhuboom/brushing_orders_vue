<template>
    <section class="skye-home-embed">
        <div class="skye-social-bar" :aria-label="t('sk_social_label')">
            <span v-for="item in socialItems" :key="item.key" class="skye-social-icon">
                <img :src="item.icon" :alt="item.label" />
            </span>
        </div>

        <header class="skye-site-header">
            <img class="skye-logo" :src="logo" :alt="t('sk_logo_alt')" />
            <button class="skye-menu-button" type="button" :aria-label="t('sk_menu')">
                <span></span><span></span><span></span>
            </button>
        </header>

        <div class="skye-contact-panel">
            <button class="skye-contact-button" type="button">{{ t('sk_contact') }}</button>
        </div>

        <section
            class="skye-topic-strip"
            :class="{ 'is-straight': isTopicStraight }"
            :aria-label="t('sk_topics')"
            @click="isTopicStraight = true"
        >
            <div class="skye-topic-strip__shape"></div>
            <div class="skye-topic-marquee">
                <span v-for="i in 3" :key="i">
                    {{ t('sk_topic_content') }}&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;
                    {{ t('sk_topic_marketing') }}&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;
                    {{ t('sk_topic_web') }}&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;
                    {{ t('sk_topic_strategy') }}&nbsp;&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;
                </span>
            </div>
        </section>

        <section class="skye-reward-insert">
            <slot name="reward"></slot>
        </section>

        <section class="skye-intro-section">
            <div class="skye-intro-text-wrap">
                <!-- <h1 class="skye-mobile-title">
                    <span class="skye-mobile-title-main">{{ t('sk_vision') }}</span>
                    <img class="skye-mobile-title-art" src="@/static/images/skye-home/fontimg.png" :alt="t('sk_art_alt')" />
                </h1> -->
                <p class="skye-intro-copy">{{ t('sk_intro') }}</p>
            </div>
            <img class="skye-hero-image" :src="heroImage" :alt="t('sk_hero_alt')" />
        </section>

        <section class="skye-service-buttons">
            <button v-for="item in serviceButtons" :key="item.labelKey" class="skye-service-button" type="button">{{ t(item.labelKey) }}</button>
        </section>

        <section class="skye-expert-section">
            <div class="skye-expert-stage" :style="expertStageStyle">
                <div class="skye-expert-card">
                    <h2 class="skye-expert-title">
                        <span>{{ t('sk_expert_1') }}</span>
                        <span>{{ t('sk_expert_2') }}</span>
                        <span>{{ t('sk_expert_3') }} {{ t('sk_expert_4') }}</span>
                        <span>{{ t('sk_expert_5') }}</span>
                        <span>{{ t('sk_expert_6') }}</span>
                        <span>{{ t('sk_expert_7') }}</span>
                    </h2>
                    <p class="skye-expert-copy">
                        <span>{{ t('sk_expert_p1') }} {{ t('sk_expert_p2') }}</span>
                        <span>{{ t('sk_expert_p3') }}</span>
                        <span>{{ t('sk_expert_p4') }}</span>
                        <span>{{ t('sk_expert_p5') }}</span>
                        <span>{{ t('sk_expert_p6') }}</span>
                    </p>
                    <button type="button">{{ t('sk_start') }}</button>
                </div>
            </div>
        </section>

        <section class="skye-team-section">
            <h2 class="skye-team-title">
                <span class="skye-team-line">
                    <span>{{ t('sk_team_l1_pre') }}</span>
                    <em>{{ t('sk_team_l1_em') }}</em>
                </span>
                <span class="skye-team-line"><em>{{ t('sk_team_l2_em') }}</em></span>
                <span class="skye-team-line">{{ t('sk_team_l3') }}</span>
                <span class="skye-team-line">{{ t('sk_team_l4') }}</span>
                <span class="skye-team-line"><strong>{{ t('sk_team_l5_soft') }}</strong></span>
                <span class="skye-team-line">{{ t('sk_team_l6') }}</span>
            </h2>
            <button type="button">{{ t('sk_team_btn') }}</button>
        </section>

        <section class="skye-split-section skye-how-section">
            <div class="skye-split-content">
                <h2>{{ t('sk_how_title') }}</h2>
                <p><strong>{{ t('sk_brand') }}</strong> {{ t('sk_how_copy') }}</p>
                <button type="button">{{ t('sk_how_btn') }}</button>
            </div>
        </section>

        <section class="skye-clients-hero">
            <div class="skye-clients-hero__inner">
                <h2 class="skye-clients-hero__title">
                    <img src="@/static/images/skye-home/ama.png" >
                    <!-- <span class="skye-clients-hero__title-script">{{ t('sk_amazing') }}</span> -->
                    <span class="skye-clients-hero__title-text">{{ t('sk_clients') }}</span>
                </h2>
                <p class="skye-clients-hero__desc">{{ t('sk_clients_copy') }}</p>
                <button class="skye-clients-hero__button" type="button">{{ t('sk_clients_btn') }}</button>
            </div>
        </section>

        <section class="skye-client-logos">
            <img v-for="client in clientLogos" :key="client.alt" :src="client.src" :alt="client.alt" />
        </section>

        <section class="skye-services-carousel">
            <div class="skye-service-viewport">
                <div
                    class="skye-service-track"
                    :class="{ 'is-no-transition': !serviceTransitionEnabled }"
                    :style="{ transform: `translate3d(-${serviceTrackIndex * 100}%, 0, 0)` }"
                    @transitionend="handleServiceTransitionEnd"
                >
                    <div v-for="(page, pageIndex) in serviceCarouselPages" :key="getServicePageKey(page, pageIndex)" class="skye-service-page">
                        <article v-for="service in page" :key="service.titleKey" class="skye-service-card">
                            <div class="skye-service-card__image-wrap"><img :src="service.icon" alt="" /></div>
                            <h3>{{ t(service.titleKey) }}</h3>
                        </article>
                    </div>
                </div>
                <button type="button" class="skye-service-arrow skye-service-arrow--prev" :aria-label="t('sk_prev_services')" @click="handleServicePrev">‹</button>
                <button type="button" class="skye-service-arrow skye-service-arrow--next" :aria-label="t('sk_next_services')" @click="handleServiceNext">›</button>
            </div>
        </section>

        <section class="skye-reviews-section">
            <div class="skye-review-viewport" @touchstart.passive="handleReviewTouchStart" @touchmove.passive="handleReviewTouchMove" @touchend="handleReviewTouchEnd">
                <div
                    class="skye-review-track"
                    :class="{ 'is-no-transition': !reviewTransitionEnabled }"
                    :style="{ transform: `translate3d(-${reviewTrackIndex * 100}%, 0, 0)` }"
                    @transitionend="handleReviewTransitionEnd"
                >
                    <article v-for="(review, reviewIndex) in reviewCarouselItems" :key="getReviewItemKey(review, reviewIndex)" class="skye-review-slide">
                        <div class="skye-review-card">
                            <div class="skye-review-card__head">
                                <div class="skye-review-avatar" :class="review.avatarClass">
                                    <img v-if="review.avatar" :src="review.avatar" alt="" />
                                    <span v-else>{{ review.initial }}</span>
                                </div>
                                <div class="skye-review-card__meta">
                                    <div class="skye-review-card__name">{{ review.name }}</div>
                                    <div class="skye-review-card__time">{{ t(review.timeKey) }}</div>
                                </div>
                                <div class="skye-review-source" :class="review.sourceClass">
                                    <img v-if="review.sourceIcon" :src="review.sourceIcon" :alt="review.source" />
                                    <span v-else>{{ review.source }}</span>
                                </div>
                            </div>
                            <div class="skye-review-stars"><span>★★★★★</span><span class="skye-review-verified">●</span></div>
                            <p class="skye-review-text">{{ t(review.textKey) }}</p>
                            <button v-if="review.readMore" type="button" class="skye-review-read-more">{{ t('sk_read_more') }}</button>
                        </div>
                    </article>
                </div>
            </div>
            <div class="skye-review-progress">
                <div class="skye-review-progress__bar"><span class="skye-review-progress__thumb" :style="{ left: reviewProgressLeft }"></span></div>
            </div>
            <div class="skye-review-score"><strong>{{ t('sk_trustindex') }}</strong> {{ t('sk_score_text') }} <strong>5.0</strong> {{ t('sk_score_of') }} 5,<br />{{ t('sk_based_on') }} <a href="javascript:void(0)">{{ t('sk_reviews_total') }}</a></div>
            <div class="skye-review-badge">{{ t('sk_verified') }} <span>ⓘ</span></div>
        </section>

        <section class="skye-insights-section">
            <div class="skye-insights-bg"></div>
            <div class="skye-insights-inner">
                <h2 class="skye-insights-title"><span>{{ t('sk_brand') }}</span><span>{{ t('sk_insights') }}</span></h2>
                <div class="skye-insights-list">
                    <article v-for="post in insightPosts" :key="post.titleKey" class="skye-insight-card">
                        <div class="skye-insight-card__image-wrap"><img :src="post.image" :alt="t(post.titleKey)" /></div>
                        <div class="skye-insight-card__body">
                            <h3><a href="javascript:void(0)">{{ t(post.titleKey) }}</a></h3>
                            <div class="skye-insight-card__meta"><span>{{ t('sk_published') }}: {{ t(post.dateKey) }}</span><span>{{ t('sk_views') }}: {{ post.views }}</span></div>
                            <p v-if="post.excerptKey" class="skye-insight-card__excerpt">{{ t(post.excerptKey) }}</p>
                            <button type="button" class="skye-insight-card__button"><span>➜</span> {{ t('sk_continue') }}</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="skye-talk-section">
            <div class="skye-talk-art" :aria-label="t('sk_talk_label')">
                <span class="skye-talk-art__text skye-talk-art__text--lets">{{ t('sk_lets') }}</span>
                <span class="skye-talk-art__text skye-talk-art__text--talk">{{ t('sk_talk') }}</span>
            </div>
            <a class="skye-talk-phone" href="tel:7152550036">{{ t('sk_phone') }}</a>
            <a class="skye-talk-button" href="mailto:">{{ t('sk_email') }}</a>
        </section>

        <footer class="skye-footer">
            <img class="skye-footer__logo" :src="whiteLogo" :alt="t('sk_hero_alt')" />

            <h2 class="skye-footer__title">{{ t('sk_footer_title') }}</h2>

            <p class="skye-footer__desc">{{ t('sk_footer_desc') }}</p>

            <div class="skye-footer__social" :aria-label="t('sk_footer_social')">
                <span v-for="item in socialItems" :key="`footer-${item.key}`" class="skye-footer__social-icon">
                    <img :src="item.icon" :alt="item.label" />
                </span>
            </div>

            <button class="skye-footer__button" type="button">{{ t('sk_footer_btn') }}</button>

            <div class="skye-footer-badge" :aria-label="t('sk_badge_label')">
                <div class="skye-footer-badge__ribbon skye-footer-badge__ribbon--left"></div>
                <div class="skye-footer-badge__ribbon skye-footer-badge__ribbon--right"></div>
                <div class="skye-footer-badge__circle">
                    <div class="skye-footer-badge__stars">★ ★ ★ ★ ★</div>
                    <div class="skye-footer-badge__were">{{ t('sk_were') }}</div>
                    <div class="skye-footer-badge__banner">{{ t('sk_highly') }}<br />{{ t('sk_recommended') }}</div>
                    <div class="skye-footer-badge__local">{{ t('sk_by_locals') }}<br />{{ t('sk_on_alignable') }}</div>
                </div>
            </div>

            <p class="skye-footer__copyright">{{ t('sk_copyright') }}</p>
        </footer>
    </section>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const logo = new URL("@/static/images/skye-home/SO-logo-black.svg", import.meta.url).href;
const whiteLogo = new URL("@/static/images/skye-home/SO-logo-outlines-white.svg", import.meta.url).href;
const heroImage = new URL("@/static/images/skye-home/tqaguwpax5k.jpg", import.meta.url).href;
const expertImage = new URL("@/static/images/skye-home/t6fdn60bmwy.jpg", import.meta.url).href;
const insightImageOne = new URL("@/static/images/skye-home/tqaguwpax5k.jpg", import.meta.url).href;
const insightImageTwo = new URL("@/static/images/skye-home/t6fdn60bmwy.jpg", import.meta.url).href;
const insightImageThree = new URL("@/static/images/skye-home/tqaguwpax5k.jpg", import.meta.url).href;
const webDesignIcon = new URL("@/static/images/skye-home/sos-web-design-and-dev-final.svg", import.meta.url).href;
const brandingIcon = new URL("@/static/images/skye-home/sos-branding-and-design-final.svg", import.meta.url).href;
const hostingIcon = new URL("@/static/images/skye-home/sos-web-hosting-final.svg", import.meta.url).href;
const maintenanceIcon = new URL("@/static/images/skye-home/sos-web-maintenance-final.svg", import.meta.url).href;
const seoIcon = new URL("@/static/images/skye-home/sos-seo-final.svg", import.meta.url).href;
const socialIcon = new URL("@/static/images/skye-home/sos-social-media-final.svg", import.meta.url).href;
const lightLogo = new URL("@/static/images/skye-home/logo-lightbackx86.png", import.meta.url).href;
const stvdLogo = new URL("@/static/images/skye-home/STVDlogoblueonwhiteR-2-1.png", import.meta.url).href;
const puppiesLogo = new URL("@/static/images/skye-home/HappyFarmPuppies-NewLogo.png", import.meta.url).href;
const keadyLogo = new URL("@/static/images/skye-home/KeadyLawFirm-Logo-Final.png", import.meta.url).href;
const capitalLogo = new URL("@/static/images/skye-home/horizontal-logo-72h.png", import.meta.url).href;
const parishLogo = new URL("@/static/images/skye-home/logo-512x512-1.png", import.meta.url).href;
const reviewAvatar1 = new URL("@/static/images/skye-home/unnamed.png", import.meta.url).href;
const reviewAvatar2 = new URL("@/static/images/skye-home/unnamed(1).png", import.meta.url).href;
const reviewAvatar3 = new URL("@/static/images/skye-home/unnamed(2).png", import.meta.url).href;
const reviewAvatar4 = new URL("@/static/images/skye-home/unnamed(3).png", import.meta.url).href;
const reviewAvatar5 = new URL("@/static/images/skye-home/unnamed(4).png", import.meta.url).href;
const reviewAvatar6 = new URL("@/static/images/skye-home/unnamed(5).png", import.meta.url).href;
const reviewAvatar7 = new URL("@/static/images/skye-home/unnamed(6).png", import.meta.url).href;
const reviewAvatar8 = new URL("@/static/images/skye-home/unnamed(7).png", import.meta.url).href;
const reviewAvatar9 = new URL("@/static/images/skye-home/unnamed(8).png", import.meta.url).href;
const reviewAvatar10 = new URL("@/static/images/skye-home/noprofile-10.svg", import.meta.url).href;
const reviewGoogleIcon = new URL("@/static/images/skye-home/review-google.svg", import.meta.url).href;
const reviewFacebookIcon = new URL("@/static/images/skye-home/review-facebook.svg", import.meta.url).href;

const socialFacebookIcon = new URL("@/static/images/skye-home/social-facebook.svg", import.meta.url).href;
const socialXIcon = new URL("@/static/images/skye-home/social-x.svg", import.meta.url).href;
const socialInstagramIcon = new URL("@/static/images/skye-home/social-instagram.svg", import.meta.url).href;
const socialPinterestIcon = new URL("@/static/images/skye-home/social-pinterest.svg", import.meta.url).href;
const socialTiktokIcon = new URL("@/static/images/skye-home/social-tiktok.svg", import.meta.url).href;
const socialYoutubeIcon = new URL("@/static/images/skye-home/social-youtube.svg", import.meta.url).href;
const socialLinkedinIcon = new URL("@/static/images/skye-home/social-linkedin.svg", import.meta.url).href;
const socialDiscordIcon = new URL("@/static/images/skye-home/social-discord.svg", import.meta.url).href;
const socialPhoneIcon = new URL("@/static/images/skye-home/social-phone.svg", import.meta.url).href;

const socialItems = [
    { key: "facebook", label: "Facebook", icon: socialFacebookIcon },
    { key: "x", label: "X", icon: socialXIcon },
    { key: "instagram", label: "Instagram", icon: socialInstagramIcon },
    { key: "pinterest", label: "Pinterest", icon: socialPinterestIcon },
    { key: "tiktok", label: "TikTok", icon: socialTiktokIcon },
    { key: "youtube", label: "YouTube", icon: socialYoutubeIcon },
    { key: "linkedin", label: "LinkedIn", icon: socialLinkedinIcon },
    { key: "discord", label: "Discord", icon: socialDiscordIcon },
    { key: "phone", label: "Phone", icon: socialPhoneIcon },
];
const serviceButtons = [
    { labelKey: "sk_web_dev" },
    { labelKey: "sk_brand_marketing" },
    { labelKey: "sk_site_manage" },
];
const services = [
    { titleKey: "sk_web_dev", icon: webDesignIcon },
    { titleKey: "sk_hosting", icon: hostingIcon },
    { titleKey: "sk_maintenance", icon: maintenanceIcon },
    { titleKey: "sk_social_marketing", icon: socialIcon },
    { titleKey: "sk_brand_design", icon: brandingIcon },
    { titleKey: "sk_seo", icon: seoIcon },
];
const clientLogos = [
    { src: puppiesLogo, alt: "Happy Farm Puppies" },
    { src: capitalLogo, alt: "Capital Arborists" },
    { src: parishLogo, alt: "Four Parishes One Faith" },
    { src: lightLogo, alt: "Cookin Up A Storm" },
    { src: keadyLogo, alt: "Keady Law Firm" },
    { src: stvdLogo, alt: "STVD" },
];
const reviews = [
    { name: "Jerry Van Dyke", timeKey: "sk_time_9m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar1, textKey: "sk_review_1" },
    { name: "CARLOS vegerano", timeKey: "sk_time_9m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar2, textKey: "sk_review_2" },
    { name: "Sarah Scott", timeKey: "sk_time_8m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar3, textKey: "sk_review_3" },
    { name: "Brian Stagg", timeKey: "sk_time_9m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar4, textKey: "sk_review_4" },
    { name: "Rev. Adam Laski", timeKey: "sk_time_8m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar5, textKey: "sk_review_5" },
    { name: "Adair Taulbee", timeKey: "sk_time_7m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar6, textKey: "sk_review_6", readMore: true },
    { name: "Cale Loken", timeKey: "sk_time_9m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar7, textKey: "sk_review_7", readMore: true },
    { name: "Matthew", timeKey: "sk_time_9m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar8, textKey: "sk_review_8" },
    { name: "Mary Phelps", timeKey: "sk_time_6y", source: "Facebook", sourceClass: "is-facebook", sourceIcon: reviewFacebookIcon, avatar: reviewAvatar9, textKey: "sk_review_9" },
    { name: "Dom Wharram", timeKey: "sk_time_7m", source: "Google", sourceClass: "is-google", sourceIcon: reviewGoogleIcon, avatar: reviewAvatar10, textKey: "sk_review_10" },
];
const insightPosts = [
    { titleKey: "sk_post1_title", dateKey: "sk_post1_date", views: 5, image: insightImageOne },
    { titleKey: "sk_post2_title", dateKey: "sk_post2_date", views: 50, image: insightImageTwo, excerptKey: "sk_post2_excerpt" },
    { titleKey: "sk_post3_title", dateKey: "sk_post3_date", views: 172, image: insightImageThree, excerptKey: "sk_post3_excerpt" },
];
const isTopicStraight = ref(false);

const expertStageStyle = computed(() => ({
    backgroundImage: `url(${expertImage})`,
}));

const servicePageSize = 2;
const serviceTransitionEnabled = ref(true);
const serviceTrackIndex = ref(1);
const isServiceSliding = ref(false);

const servicePages = computed(() => {
    const pages = [];
    for (let i = 0; i < services.length; i += servicePageSize) {
        const page = services.slice(i, i + servicePageSize);
        if (page.length < servicePageSize && services.length) page.push(...services.slice(0, servicePageSize - page.length));
        pages.push(page);
    }
    return pages;
});
const serviceCarouselPages = computed(() => {
    const pages = servicePages.value;
    return pages.length ? [pages[pages.length - 1], ...pages, pages[0]] : [];
});
const getServicePageKey = (page, pageIndex) => `${pageIndex}-${page.map((item) => item.titleKey).join("-")}`;
const setServiceTrackIndexWithoutAnimation = async (index) => {
    serviceTransitionEnabled.value = false;
    serviceTrackIndex.value = index;
    await nextTick();
    requestAnimationFrame(() => requestAnimationFrame(() => {
        serviceTransitionEnabled.value = true;
        isServiceSliding.value = false;
    }));
};
const handleServicePrev = () => {
    if (isServiceSliding.value || servicePages.value.length <= 1) return;
    isServiceSliding.value = true;
    serviceTransitionEnabled.value = true;
    serviceTrackIndex.value -= 1;
};
const handleServiceNext = () => {
    if (isServiceSliding.value || servicePages.value.length <= 1) return;
    isServiceSliding.value = true;
    serviceTransitionEnabled.value = true;
    serviceTrackIndex.value += 1;
};
const handleServiceTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    const realPageCount = servicePages.value.length;
    if (serviceTrackIndex.value === 0) return setServiceTrackIndexWithoutAnimation(realPageCount);
    if (serviceTrackIndex.value === realPageCount + 1) return setServiceTrackIndexWithoutAnimation(1);
    isServiceSliding.value = false;
};

const activeReviewIndex = ref(0);
const reviewTrackIndex = ref(1);
const reviewTransitionEnabled = ref(true);
const isReviewSliding = ref(false);
const reviewTouchStartX = ref(0);
const reviewTouchCurrentX = ref(0);
const reviewCarouselItems = computed(() => reviews.length ? [reviews[reviews.length - 1], ...reviews, reviews[0]] : []);
const getReviewItemKey = (review, reviewIndex) => `${reviewIndex}-${review.name}-${review.timeKey}`;
const reviewProgressLeft = computed(() => reviews.length <= 1 ? "0%" : `${(activeReviewIndex.value / (reviews.length - 1)) * 88}%`);
const setReviewTrackIndexWithoutAnimation = async (index) => {
    reviewTransitionEnabled.value = false;
    reviewTrackIndex.value = index;
    await nextTick();
    requestAnimationFrame(() => requestAnimationFrame(() => {
        reviewTransitionEnabled.value = true;
        isReviewSliding.value = false;
    }));
};
const handleReviewPrev = () => {
    if (isReviewSliding.value || reviews.length <= 1) return;
    isReviewSliding.value = true;
    reviewTransitionEnabled.value = true;
    activeReviewIndex.value = (activeReviewIndex.value - 1 + reviews.length) % reviews.length;
    reviewTrackIndex.value -= 1;
};
const handleReviewNext = () => {
    if (isReviewSliding.value || reviews.length <= 1) return;
    isReviewSliding.value = true;
    reviewTransitionEnabled.value = true;
    activeReviewIndex.value = (activeReviewIndex.value + 1) % reviews.length;
    reviewTrackIndex.value += 1;
};
const handleReviewTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (reviewTrackIndex.value === 0) return setReviewTrackIndexWithoutAnimation(reviews.length);
    if (reviewTrackIndex.value === reviews.length + 1) return setReviewTrackIndexWithoutAnimation(1);
    isReviewSliding.value = false;
};
const handleReviewTouchStart = (event) => {
    if (isReviewSliding.value) return;
    reviewTouchStartX.value = event.touches?.[0]?.clientX || 0;
    reviewTouchCurrentX.value = reviewTouchStartX.value;
};
const handleReviewTouchMove = (event) => {
    if (isReviewSliding.value) return;
    reviewTouchCurrentX.value = event.touches?.[0]?.clientX || reviewTouchCurrentX.value;
};
const handleReviewTouchEnd = () => {
    if (isReviewSliding.value) return;
    const diffX = reviewTouchCurrentX.value - reviewTouchStartX.value;
    if (Math.abs(diffX) < 40) return;
    diffX > 0 ? handleReviewPrev() : handleReviewNext();
};
</script>

<style scoped>
.skye-home-embed {
    --skye-green:#697a70;
    --skye-pale:#c4d2d2;
    --skye-orange:#d87c00;
    --skye-topic-bg:var(--theme-home-topic-bg, #c9d2d2);
    --skye-clients-bg:#3f4c45;
    position:relative;
    overflow:hidden;
    background:#fff;
    color:#000;
    font-family:Arial, Helvetica, sans-serif
}
.skye-social-bar {
    display:flex;
    align-items:center;
    justify-content:center;
    gap:18px;
    height:50px;
    background:var(--skye-green);
    color:#fff;
    font-size:18px;
    font-weight:800
}
.skye-social-icon {
    display:inline-flex;
    width:18px;
    height:18px;
    align-items:center;
    justify-content:center
}
.skye-social-icon img {
    display:block;
    width:18px;
    height:18px;
    object-fit:contain
}
.skye-site-header {
    display:flex;
    min-height:168px;
    align-items:center;
    justify-content:space-between;
    background:#fff;
    padding:32px 43px 20px 30px
}
.skye-logo {
    display:block;
    width:176px;
    height:auto
}
.skye-menu-button {
    display:inline-flex;
    flex-direction:column;
    justify-content:center;
    gap:6px;
    width:34px;
    height:34px;
    border:0;
    background:transparent;
    padding:0
}
.skye-menu-button span {
    display:block;
    width:25px;
    height:3px;
    border-radius:999px;
    background:#045c26
}
.skye-contact-panel {
    background:#fff;
    padding:0 29px
}
.skye-contact-button {
    width:100%;
    min-height:57px;
    border:0;
    border-radius:11px;
    background:var(--skye-orange);
    color:#fff;
    font-size:15px;
    font-weight:800
}
.skye-topic-strip {
    position:relative;
    overflow:hidden;
    height:86px;
    margin-top:4px;
    background:transparent;
    cursor:pointer
}
.skye-topic-strip__shape {
    position:absolute;
    inset:8px -22px 6px -18px;
    background:var(--skye-topic-bg);
    box-shadow:0 3px 10px rgba(89, 105, 102, .08);
    transform:rotate(2deg);
    transform-origin:center;
    transition:inset .24s ease, transform .24s ease, border-radius .24s ease
}
.skye-topic-strip.is-straight .skye-topic-strip__shape {
    inset:0;
    transform:rotate(0deg)
}
.skye-topic-marquee {
    position:relative;
    z-index:1;
    display:flex;
    width:max-content;
    height:100%;
    align-items:center;
    white-space:nowrap;
    color:#fff;
    font-family:Georgia, "Times New Roman", serif;
    font-size:19px;
    font-weight:800;
    animation:skye-marquee 22s linear infinite
}
.skye-topic-marquee span {
    display:inline-flex;
    align-items:center;
    padding-right:40px
}
@keyframes skye-marquee {
    from {
        transform:translateX(0)
    }
    to {
        transform:translateX(-33.333%)
    }
}
.skye-reward-insert {
    position:relative;
    z-index:2;
    background:#F5FAF6;
    padding:18px 15px
}
.skye-intro-text-wrap {
    padding:20px 24px
}
.skye-mobile-title {
    margin:0 0 42px;
    text-align:center
}
.skye-mobile-title-main {
    display:block;
    font-size:50px;
    font-weight:400;
    line-height:1.08
}
.skye-mobile-title-art {
    display:block;
    width:227px;
    height:221px;
    margin:8px auto 0
}
.skye-intro-copy {
    margin:0;
    font-size:18px;
    line-height:1.62
}
.skye-hero-image {
    display:block;
    width:100%;
    min-height:270px;
    object-fit:cover
}
.skye-service-buttons {
    display:flex;
    flex-direction:column;
    gap:15px;
    background:var(--skye-pale);
    padding:26px 30px 21px
}
.skye-service-button {
    min-height:61px;
    border:0;
    border-radius:11px;
    background:#000;
    color:#fff;
    font-size:18px
}
.skye-expert-section {
    background:var(--skye-pale);
    padding:26px 12px 74px
}
.skye-expert-stage {
    position:relative;
    width:398px;
    max-width:100%;
    min-height:452px;
    margin:0 auto;
    overflow:visible;
    background-position:center;
    background-size:cover;
    background-repeat:no-repeat;
    box-shadow:0 14px 22px rgba(0, 0, 0, .10)
}
.skye-expert-stage:after {
    content:"";
    position:absolute;
    inset:0;
    background:linear-gradient(180deg, rgba(255,255,255,.14) 0%, rgba(0,0,0,.02) 42%, rgba(0,0,0,.22) 100%);
    pointer-events:none
}
.skye-expert-card {
    position:absolute;
    left:30px;
    right:30px;
    top:36px;
    bottom:-34px;
    z-index:1;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    border-radius:0 0 14px 14px;
    background:linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(0,0,0,.18) 24%, rgba(0,0,0,.84) 70%, rgba(0,0,0,.96) 100%);
    padding:28px 30px 30px;
    color:#fff;
    box-shadow:0 16px 28px rgba(0, 0, 0, .28)
}
.skye-expert-card:before {
    content:"";
    position:absolute;
    inset:18px;
    border:1px solid rgba(255,255,255,.08);
    pointer-events:none
}
.skye-expert-title {
    margin:0;
    color:#f5f3ee;
    font-family:Georgia, "Times New Roman", serif;
    font-size:34px;
    font-weight:800;
    line-height:.94
}
.skye-expert-title span,
.skye-expert-copy span,
.skye-team-line {
    display:block
}
.skye-expert-copy {
    margin:26px 0 0;
    font-size:17px;
    line-height:1.55
}
.skye-expert-copy span + span {
    margin-top:4px
}
.skye-expert-card button,
.skye-split-content button {
    min-height:45px;
    border:0;
    border-radius:999px;
    background:var(--skye-orange);
    padding:0 24px;
    color:#fff;
    font-size:14px;
    font-weight:800
}
.skye-expert-card button {
    width:100%;
    min-height:52px;
    margin-top:auto;
    border-radius:14px;
    font-size:15px
}
.skye-team-section {
    background:#fff;
    padding:60px 18px 44px;
    text-align:center
}
.skye-team-title {
    max-width:520px;
    margin:0 auto 56px;
    color:#111;
    font-family:Georgia, "Times New Roman", serif;
    font-size:31px;
    font-weight:800;
    line-height:1.03
}
.skye-team-line {
    display:block
}
.skye-team-line + .skye-team-line {
    margin-top:2px
}
.skye-team-line em {
    color:var(--skye-orange);
    font-style:normal
}
.skye-team-line strong {
    color:#8eb89c;
    font-weight:inherit
}
.skye-team-section button {
    display:flex;
    width:370px;
    max-width:100%;
    min-height:126px;
    align-items:center;
    justify-content:center;
    margin:34px auto 0;
    border-style:solid;
    border-color:#c2cecd;
    border-width:1px 5px;
    border-radius:18px;
    background:#fff;
    padding:0 28px;
    color:#000;
    font-size:30px;
    font-weight:500;
    line-height:1.08;
    text-align:center
}
.skye-split-section.skye-how-section {
    position:relative;
    overflow:hidden;
    margin-top:-2px;
    background:var(--skye-pale);
    padding:90px 24px 120px
}
.skye-split-section.skye-how-section:before {
    content:"";
    position:absolute;
    top:-2px;
    left:0;
    right:0;
    height:104px;
    background:#fff;
    clip-path:polygon(0 0, 100% 0, 100% 100%)
}
.skye-split-section.skye-how-section:after {
    content:"";
    position:absolute;
    bottom:-2px;
    left:0;
    right:0;
    height:132px;
    background:var(--skye-clients-bg);
    clip-path:polygon(0 100%, 100% 100%, 100% 0, 0 85%)
}
.skye-split-content {
    position:relative;
    z-index:2;
    max-width:500px;
    margin:0 auto;
    text-align:center
}
.skye-split-content h2 {
    margin:0 0 24px;
    font-family:Georgia, "Times New Roman", serif;
    font-size:34px
}
.skye-split-content p {
    margin:0 0 32px;
    font-size:18px;
    line-height:1.65
}
.skye-split-content button {
    border-radius:10px;
    background:#000;
    font-size:16px
}
.skye-clients-hero {
    position:relative;
    z-index:2;
    margin:-2px 0 0;
    background:var(--skye-clients-bg);
    padding:66px 32px 54px;
    box-shadow:0 -2px 0 var(--skye-clients-bg)
}
.skye-clients-hero__inner {
    max-width:301px;
    margin:0 auto;
    text-align:center
}
.skye-clients-hero__title {
    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;
    margin:0 0 70px;
    white-space:nowrap
}
.skye-clients-hero__title-script {
    font-family:"Brush Script MT", "Segoe Script", cursive;
    font-size:67px;
    line-height:.82
}
.skye-clients-hero__title-text {
    font-size:30px;
    line-height:1;
    margin-bottom:7px
}
.skye-clients-hero__desc {
    margin:0 auto;
    color:#fff;
    font-size:18px;
    line-height:1.7
}
.skye-clients-hero__button {
    display:flex;
    width:282px;
    max-width:100%;
    min-height:60px;
    align-items:center;
    justify-content:center;
    margin:48px auto 0;
    border:0;
    border-radius:14px;
    background:#fff;
    color:var(--skye-orange);
    font-size:18px
}
.skye-client-logos {
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    column-gap:42px;
    row-gap:58px;
    align-items:center;
    background:#fff;
    border-top:7px solid var(--skye-orange);
    border-bottom:7px solid var(--skye-orange);
    padding:42px 32px 46px
}
.skye-client-logos img {
    display:block;
    width:100%;
    height:96px;
    object-fit:contain
}
.skye-services-carousel {
    position:relative;
    overflow:hidden;
    background:#fff;
    padding:66px 22px 76px
}
.skye-service-viewport {
    position:relative;
    width:100%;
    overflow:hidden
}
.skye-service-track {
    display:flex;
    width:100%;
    transition:transform .42s ease;
    will-change:transform
}
.skye-service-track.is-no-transition {
    transition:none
}
.skye-service-page {
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:16px;
    min-width:100%;
    flex:0 0 100%
}
.skye-service-card {
    display:flex;
    min-height:328px;
    flex-direction:column;
    overflow:hidden;
    border:1px solid #65766b;
    border-radius:8px;
    background:#fff;
    text-align:center
}
.skye-service-card__image-wrap {
    display:flex;
    height:172px;
    align-items:center;
    justify-content:center;
    padding:20px 12px 0
}
.skye-service-card img {
    display:block;
    width:100%;
    max-width:140px;
    height:140px;
    object-fit:contain
}
.skye-service-card h3 {
    display:flex;
    flex:1;
    align-items:center;
    justify-content:center;
    margin:0;
    padding:14px 14px 26px;
    color:#06451f;
    font-size:19px;
    font-weight:500;
    line-height:1.45;
    text-align:center
}
.skye-service-arrow {
    position:absolute;
    top:128px;
    z-index:5;
    display:flex;
    width:22px;
    height:32px;
    align-items:center;
    justify-content:center;
    border:0;
    border-radius:2px;
    background:#2e2e2e;
    color:#fff;
    font-size:20px;
    font-weight:600;
    transform:translateY(-50%)
}
.skye-service-arrow--prev {
    left:0
}
.skye-service-arrow--next {
    right:0
}
.skye-reviews-section {
    background:#fff;
    padding:0 28px 58px
}
.skye-review-viewport {
    width:100%;
    overflow:hidden;
    touch-action:pan-y
}
.skye-review-track {
    display:flex;
    transition:transform .35s ease;
    will-change:transform
}
.skye-review-track.is-no-transition {
    transition:none
}
.skye-review-slide {
    min-width:100%;
    flex:0 0 100%;
    padding:0 2px
}
.skye-review-card {
    min-height:321px;
    border-radius:8px;
    background:#dfe6e6;
    padding:20px
}
.skye-review-card__head {
    display:flex;
    align-items:center;
    gap:14px
}
.skye-review-avatar {
    display:flex;
    width:40px;
    height:40px;
    flex:0 0 40px;
    align-items:center;
    justify-content:center;
    overflow:hidden;
    border-radius:50%;
    color:#fff;
    font-size:22px;
    font-weight:600
}
.skye-review-avatar img {
    width:100%;
    height:100%;
    object-fit:cover
}
.skye-review-avatar.is-purple {
    background:#7d58d9
}
.skye-review-avatar.is-brown {
    background:#6d493e
}
.skye-review-avatar.is-green {
    background:#90c164
}
.skye-review-avatar.is-gold {
    background:#cfa162
}
.skye-review-avatar.is-gray {
    background:#606060
}
.skye-review-avatar.is-dark {
    background:#2f2f2f
}
.skye-review-avatar.is-photo-green {
    background:linear-gradient(135deg, #3c8f5b, #bdd68a)
}
.skye-review-avatar.is-photo-blue {
    background:linear-gradient(135deg, #5d7fb5, #ead4bd)
}
.skye-review-avatar.is-photo-orange {
    background:linear-gradient(135deg, #b7653e, #f2d2b8)
}
.skye-review-avatar.is-photo-brown {
    background:linear-gradient(135deg, #784b3d, #d6b08b)
}
.skye-review-card__meta {
    flex:1
}
.skye-review-card__name {
    font-size:16px;
    font-weight:700
}
.skye-review-card__time {
    margin-top:3px;
    color:#767676;
    font-size:14px
}
.skye-review-source {
    display:flex;
    width:24px;
    height:24px;
    flex:0 0 24px;
    align-items:center;
    justify-content:center
}
.skye-review-source img {
    display:block;
    width:24px;
    height:24px;
    object-fit:contain
}
.skye-review-source.is-google {
    color:#4285f4
}
.skye-review-source.is-facebook {
    color:#1877f2
}
.skye-review-stars {
    display:flex;
    align-items:center;
    gap:7px;
    margin-top:18px;
    color:#ffb500;
    font-size:20px;
    letter-spacing:-1px
}
.skye-review-verified {
    display:inline-flex;
    width:14px;
    height:14px;
    align-items:center;
    justify-content:center;
    border-radius:50%;
    background:#147d62;
    color:#147d62;
    font-size:0
}
.skye-review-verified:after {
    content:"✓";
    color:#fff;
    font-size:10px;
    font-weight:800
}
.skye-review-text {
    margin:10px 0 0;
    font-size:16px;
    line-height:1.35
}
.skye-review-read-more {
    margin-top:12px;
    border:0;
    background:transparent;
    padding:0;
    color:#777;
    font-size:14px
}
.skye-review-progress {
    display:flex;
    justify-content:center;
    margin-top:22px
}
.skye-review-progress__bar {
    position:relative;
    width:96px;
    height:3px;
    background:#c8c8c8
}
.skye-review-progress__thumb {
    position:absolute;
    top:0;
    width:12%;
    height:3px;
    background:#555;
    transition:left .35s ease
}
.skye-review-score {
    margin-top:19px;
    font-size:16px;
    line-height:1.35;
    text-align:center
}
.skye-review-score a {
    color:#000;
    font-weight:700;
    text-decoration:underline
}
.skye-review-badge {
    display:flex;
    width:177px;
    height:27px;
    align-items:center;
    justify-content:center;
    gap:4px;
    margin:14px auto 0;
    border-radius:3px;
    background:#d5f4e4;
    font-size:12px;
    font-weight:700
}
.skye-insights-section {
    position:relative;
    overflow:hidden;
    background:#dce8e6;
    padding:36px 31px 28px
}
.skye-insights-bg {
    position:absolute;
    inset:0;
    opacity:.18;
    background-image:radial-gradient(circle at 18px 18px, transparent 0 15px, rgba(96, 119, 105, .35) 16px, transparent 17px), radial-gradient(circle at 78px 72px, transparent 0 21px, rgba(96, 119, 105, .28) 22px, transparent 23px);
    background-size:118px 118px
}
.skye-insights-inner {
    position:relative;
    z-index:1
}
.skye-insights-title {
    margin:0 0 20px;
    font-family:Georgia, "Times New Roman", serif;
    font-size:40px;
    font-weight:800;
    line-height:.95
}
.skye-insights-title span {
    display:block
}
.skye-insights-list {
    display:flex;
    flex-direction:column;
    gap:24px
}
.skye-insight-card {
    overflow:hidden;
    border-radius:6px;
    background:#748678;
    box-shadow:0 3px 8px rgba(0, 0, 0, .08)
}
.skye-insight-card__image-wrap {
    padding:14px 14px 0
}
.skye-insight-card__image-wrap img {
    display:block;
    width:100%;
    height:190px;
    object-fit:cover;
    background:#d8ded7
}
.skye-insight-card__body {
    padding:46px 15px 34px
}
.skye-insight-card__body h3 {
    margin:0
}
.skye-insight-card__body h3 a {
    color:#fff;
    font-size:23px;
    font-weight:400;
    line-height:1.43;
    text-decoration:underline;
    text-decoration-style:dotted;
    text-underline-offset:3px
}
.skye-insight-card__meta {
    display:flex;
    flex-wrap:wrap;
    gap:11px;
    margin-top:13px;
    border-top:1px solid rgba(255, 255, 255, .6);
    border-bottom:1px solid rgba(255, 255, 255, .6);
    padding:11px 0;
    color:#fff;
    font-size:13px
}
.skye-insight-card__excerpt {
    margin:14px 0 0;
    color:#fff;
    font-size:16px;
    line-height:1.7
}
.skye-insight-card__button {
    display:inline-flex;
    min-width:178px;
    min-height:61px;
    align-items:center;
    justify-content:center;
    gap:10px;
    margin-top:18px;
    border:1px solid #fff;
    background:transparent;
    color:#fff;
    font-size:16px;
    font-weight:700;
    margin-left:-18px
}
.skye-talk-section {
    position:relative;
    overflow:hidden;
    background:#fff;
    padding:48px 22px 69px;
    text-align:center
}
.skye-talk-art {
    position:relative;
    width:332px;
    max-width:100%;
    height:258px;
    margin:0 auto 5px;
    color:var(--skye-orange);
    font-family:"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive;
    font-style:italic;
    font-weight:400;
    line-height:.8;
    text-align:left
}
.skye-talk-art:before {
    content:"";
    position:absolute;
    left:77px;
    top:4px;
    width:2px;
    height:254px;
    background:var(--skye-orange);
    opacity:.9;
    transform:rotate(18deg);
    transform-origin:top center
}
.skye-talk-art:after {
    content:"";
    position:absolute;
    left:37px;
    top:154px;
    width:190px;
    height:4px;
    border-radius:999px;
    background:var(--skye-orange);
    transform:rotate(-5deg)
}
.skye-talk-art__text {
    position:absolute;
    z-index:1;
    display:block;
    color:var(--skye-orange);
    text-shadow:
        1px 0 0 var(--skye-orange),
        -1px 0 0 var(--skye-orange)
}
.skye-talk-art__text--lets {
    left:4px;
    top:28px;
    font-size:118px;
    letter-spacing:-8px;
    transform:rotate(-3deg)
}
.skye-talk-art__text--talk {
    left:24px;
    top:132px;
    font-size:121px;
    letter-spacing:-7px;
    transform:rotate(-4deg)
}
.skye-talk-phone {
    display:inline-flex;
    margin-top:-4px;
    color:#000;
    font-size:21px;
    font-weight:700;
    line-height:1.2;
    text-decoration:none
}
.skye-talk-button {
    display:flex;
    width:119px;
    height:57px;
    align-items:center;
    justify-content:center;
    margin:20px auto 0;
    border-radius:11px;
    background:#000;
    color:#fff;
    font-size:13px;
    font-weight:800;
    text-decoration:none
}
.skye-footer {
    background:#627469;
    padding:100px 18px ;
    text-align:center;
    color:#fff
}
.skye-footer__logo {
    display:block;
    width:332px;
    max-width:94%;
    height:auto;
    margin:0 auto 52px
}
.skye-footer__title {
    margin:0;
    color:#fff;
    font-family:Georgia, "Times New Roman", serif;
    font-size:24px;
    font-weight:800;
    line-height:1.2
}
.skye-footer__desc {
    max-width:345px;
    margin:27px auto 0;
    color:#fff;
    font-size:20px;
    font-weight:700;
    line-height:1.55
}
.skye-footer__social {
    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;
    margin-top:18px;
    color:#fff;
    font-size:19px;
    font-weight:800
}
.skye-footer__social-icon {
    display:inline-flex;
    width:18px;
    height:18px;
    align-items:center;
    justify-content:center;
    line-height:1
}
.skye-footer__social-icon img {
    display:block;
    width:18px;
    height:18px;
    object-fit:contain
}
.skye-footer__button {
    display:flex;
    width:218px;
    height:57px;
    align-items:center;
    justify-content:center;
    margin:41px auto 0;
    border:0;
    border-radius:11px;
    background:#000;
    color:#fff;
    font-size:14px;
    font-weight:800
}
.skye-footer-badge {
    position:relative;
    width:258px;
    height:184px;
    margin:29px auto 0;
    color:#24135f
}
.skye-footer-badge__circle {
    position:absolute;
    left:50%;
    top:0;
    z-index:2;
    width:176px;
    height:176px;
    border:7px solid #45249a;
    border-radius:50%;
    background:#fff;
    box-shadow:0 2px 0 rgba(0, 0, 0, .28);
    transform:translateX(-50%)
}
.skye-footer-badge__circle:before {
    content:"";
    position:absolute;
    inset:7px;
    border:2px solid #321478;
    border-radius:50%
}
.skye-footer-badge__ribbon {
    position:absolute;
    z-index:1;
    top:67px;
    width:88px;
    height:60px;
    background:#44258f
}
.skye-footer-badge__ribbon--left {
    left:0;
    clip-path:polygon(0 0, 100% 0, 78% 50%, 100% 100%, 0 100%, 18% 50%)
}
.skye-footer-badge__ribbon--right {
    right:0;
    clip-path:polygon(0 0, 100% 0, 82% 50%, 100% 100%, 0 100%, 22% 50%)
}
.skye-footer-badge__stars {
    position:absolute;
    top:14px;
    left:0;
    right:0;
    color:#5940b4;
    font-size:17px;
    font-weight:800;
    letter-spacing:5px;
    white-space:nowrap
}
.skye-footer-badge__were {
    position:absolute;
    top:38px;
    left:0;
    right:0;
    color:#1f1f1f;
    font-family:Georgia, "Times New Roman", serif;
    font-size:23px;
    font-style:italic;
    font-weight:800
}
.skye-footer-badge__banner {
    position:absolute;
    left:50%;
    top:67px;
    z-index:3;
    display:flex;
    width:206px;
    height:68px;
    align-items:center;
    justify-content:center;
    background:#6b4bc0;
    color:#fff;
    font-size:23px;
    font-weight:900;
    line-height:.92;
    text-align:center;
    box-shadow:0 3px 0 rgba(0, 0, 0, .12);
    transform:translateX(-50%) skewX(-3deg)
}
.skye-footer-badge__local {
    position:absolute;
    left:0;
    right:0;
    bottom:21px;
    color:#1f1f1f;
    font-family:Georgia, "Times New Roman", serif;
    font-size:15px;
    font-style:italic;
    font-weight:800;
    line-height:1.18
}
.skye-footer__copyright {
    max-width:335px;
    margin:75px auto 0;
    color:#fff;
    font-size:15px;
    font-weight:700;
    line-height:1.62
}
@media(max-width:360px) {
    .skye-site-header {
        min-height:145px;
        padding-right:35px;
        padding-left:24px
    }
    .skye-logo {
        width:158px
    }
    .skye-mobile-title-main {
        font-size:45px
    }
    .skye-mobile-title-art {
        width:210px;
        height:auto
    }
    .skye-intro-copy {
        font-size:18px
    }
    .skye-service-buttons {
        padding-right:24px;
        padding-left:24px
    }
    .skye-expert-section {
        padding:24px 12px 70px
    }
    .skye-expert-stage {
        width:100%;
        min-height:430px
    }
    .skye-expert-card {
        left:22px;
        right:22px;
        top:28px;
        bottom:-30px;
        padding:24px 22px 24px
    }
    .skye-expert-title {
        font-size:27px
    }
    .skye-expert-copy {
        font-size:14px
    }
    .skye-team-section {
        padding-right:16px;
        padding-left:16px
    }
    .skye-team-title {
        font-size:26px
    }
    .skye-team-section button {
        width:100%;
        min-height:112px;
        font-size:25px
    }
    .skye-clients-hero {
        padding:58px 28px 48px
    }
    .skye-clients-hero__title-script {
        font-size:62px
    }
    .skye-clients-hero__title-text {
        font-size:28px
    }
    .skye-clients-hero__desc {
        font-size:17px
    }
    .skye-client-logos {
        column-gap:32px;
        row-gap:48px;
        padding:34px 30px 40px
    }
    .skye-client-logos img {
        height:84px
    }
    .skye-services-carousel {
        padding:58px 18px 72px
    }
    .skye-service-page {
        gap:14px
    }
    .skye-service-card {
        min-height:308px
    }
    .skye-service-card__image-wrap {
        height:162px;
        padding-top:18px
    }
    .skye-service-card img {
        max-width:128px;
        height:128px
    }
    .skye-service-card h3 {
        font-size:18px
    }
    .skye-service-arrow {
        top:118px;
        width:20px;
        height:30px;
        font-size:18px
    }
    .skye-reviews-section {
        padding-right:25px;
        padding-left:25px
    }
    .skye-review-card {
        min-height:321px;
        padding:19px
    }
    .skye-review-text {
        font-size:15px
    }
    .skye-insights-section {
        padding:35px 31px 27px
    }
    .skye-insights-title {
        font-size:38px
    }
    .skye-insight-card__image-wrap img {
        height:188px
    }
    .skye-insight-card__body {
        padding-top:43px
    }
    .skye-insight-card__body h3 a {
        font-size:22px
    }
    .skye-insight-card__excerpt {
        font-size:15px
    }
    .skye-talk-section {
        padding:44px 18px 64px
    }
    .skye-talk-art {
        width:306px;
        height:238px
    }
    .skye-talk-art:before {
        left:70px;
        height:235px
    }
    .skye-talk-art:after {
        left:34px;
        top:143px;
        width:176px
    }
    .skye-talk-art__text--lets {
        left:2px;
        top:26px;
        font-size:108px;
        letter-spacing:-7px
    }
    .skye-talk-art__text--talk {
        left:22px;
        top:122px;
        font-size:111px;
        letter-spacing:-6px
    }
    .skye-talk-phone {
        font-size:20px
    }
    .skye-footer {
        padding:25px 16px 88px
    }
    .skye-footer__logo {
        width:310px;
        margin-bottom:46px
    }
    .skye-footer__title {
        font-size:22px
    }
    .skye-footer__desc {
        max-width:318px;
        margin-top:25px;
        font-size:19px;
        line-height:1.55
    }
    .skye-footer__social {
        gap:17px;
        margin-top:18px;
        font-size:18px
    }
    .skye-footer__button {
        width:218px;
        height:57px;
        margin-top:39px
    }
    .skye-footer-badge {
        width:246px;
        height:176px;
        margin-top:28px;
        transform:scale(.96);
        transform-origin:top center
    }
    .skye-footer__copyright {
        max-width:318px;
        margin-top:62px;
        font-size:14px;
        line-height:1.65
    }
}
</style>
