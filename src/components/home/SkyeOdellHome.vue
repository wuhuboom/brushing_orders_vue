<template>
    <section class="algofy-home">
        <!-- <div class="algofy-top-promo">
            <img
                src="@/static/images/algofy-assets/topflash.svg"
                class="mr-[15px]"
            />
            <span> {{ t("skye.promo") }}</span>
        </div> -->

        <header class="algofy-header">
            <div
                class="algofy-brand-mark"
                :aria-label="t('skye.algofy_logo_alt')"
            >
                <img src="@/static/images/logo.svg" />
            </div>
        </header>

        <section class="algofy-hero">
            <div class="orbit orbit-one"></div>
            <div class="orbit orbit-two"></div>
            <div
                v-for="brand in heroBrands"
                :key="brand.name"
                class="floating-brand"
                :class="brand.className"
            >
                <img :src="brand.image" :alt="brand.name" />
            </div>
            <p class="eyebrow">
                {{ t("skye.hero_eyebrow_line1") }}<br />{{
                    t("skye.hero_eyebrow_line2")
                }}
            </p>
            <h1>
                {{ t("skye.hero_title_prefix") }}
                <span
                    >{{ t("skye.hero_title_span_line1") }}<br />{{
                        t("skye.hero_title_span_line2")
                    }}</span
                >
            </h1>
        </section>

        <section class="algofy-trusted">
            <p>{{ t("skye.trusted") }}</p>
            <div
                class="trusted-carousel"
                :aria-label="t('skye.trusted_carousel_label')"
            >
                <div class="trusted-track">
                    <div
                        v-for="(logo, index) in trustedCarouselLogos"
                        :key="`${logo.name}-${index}`"
                        class="trusted-logo"
                    >
                        <img :src="logo.image" :alt="logo.name" />
                    </div>
                </div>
            </div>
        </section>

        <section class="algofy-function-zone">
            <slot name="reward"></slot>
        </section>

        <section class="success-section">
            <div class="case-card">
                <div class="case-slider-window">
                    <div
                        class="case-slider-track"
                        :class="{ 'no-transition': !caseTransitionEnabled }"
                        :style="{
                            transform: `translateX(-${caseSlidePosition * 100}%)`,
                        }"
                        @transitionend="handleCaseTransitionEnd"
                    >
                        <div
                            v-for="(story, slideIndex) in visibleCaseSlides"
                            :key="`${story.name}-${slideIndex}`"
                            class="case-content"
                        >
                            <div class="case-logo">
                                <img
                                    :src="story.logo"
                                    :alt="`${story.name} logo`"
                                />
                            </div>
                            <div class="case-author">
                                <img
                                    class="case-avatar"
                                    :src="story.avatar"
                                    :alt="story.person"
                                />
                                <p v-html="story.authorHtml"></p>
                            </div>
                            <blockquote v-html="story.quoteHtml"></blockquote>
                            <div class="case-stats">
                                <p
                                    v-for="(stat, index) in story.stats"
                                    :key="stat.label"
                                >
                                    <strong
                                        >+{{
                                            story.name === activeCase.name
                                                ? animatedStats[index]
                                                : stat.value
                                        }}%</strong
                                    >
                                    {{ stat.label }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    class="case-arrow case-arrow--left"
                    type="button"
                    :aria-label="t('skye.previous_story')"
                    @click="prevCase"
                >
                    <img :src="arrowLeft" alt="" />
                </button>
                <button
                    class="case-arrow case-arrow--right"
                    type="button"
                    :aria-label="t('skye.next_story')"
                    @click="nextCase"
                >
                    <img :src="arrowRight" alt="" />
                </button>
            </div>

            <div class="partner-logo-grid">
                <div
                    v-for="partner in partnerBadges"
                    :key="partner.name"
                    class="partner-logo-item"
                >
                    <img :src="partner.image" :alt="partner.name" />
                </div>
            </div>
        </section>

        <section class="clients-section">
            <div class="growth-showcase-card">
                <h2>
                    {{ t("skye.unified_title_line1") }}<br />{{
                        t("skye.unified_title_line2")
                    }}
                </h2>
                <p>{{ t("skye.unified_copy") }}</p>

                <div
                    class="growth-carousel"
                    @touchstart="handleGrowthTouchStart"
                    @touchend="handleGrowthTouchEnd"
                    @mousedown="handleGrowthMouseDown"
                    @mouseup="handleGrowthMouseUp"
                    @mouseleave="cancelGrowthMouse"
                >
                    <div class="growth-image-window">
                        <div
                            class="growth-image-track"
                            :class="{
                                'no-transition': !growthTransitionEnabled,
                            }"
                            :style="{
                                transform: `translateX(-${growthSlidePosition * 100}%)`,
                            }"
                            @transitionend="handleGrowthTransitionEnd"
                        >
                            <div
                                v-for="(
                                    item, slideIndex
                                ) in visibleGrowthSlides"
                                :key="`${item.name}-${slideIndex}`"
                                class="growth-image-slide"
                            >
                                <img
                                    :src="item.image"
                                    :alt="item.name"
                                    draggable="false"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="growth-controls">
                        <button
                            type="button"
                            :aria-label="t('skye.previous_example')"
                            @click="prevGrowth"
                        >
                            <img :src="arrowLeft" alt="" />
                        </button>
                        <div class="growth-dots">
                            <button
                                v-for="(item, index) in growthSlides"
                                :key="item.name"
                                type="button"
                                :class="{ active: index === activeGrowthIndex }"
                                :aria-label="
                                    t('skye.go_to_example', { num: index + 1 })
                                "
                                @click="goGrowth(index)"
                            ></button>
                        </div>
                        <button
                            type="button"
                            :aria-label="t('skye.next_example')"
                            @click="nextGrowth"
                        >
                            <img :src="arrowRight" alt="" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="growth-build-list">
                <div class="growth-list-group">
                    <h3>{{ t("skye.build") }}</h3>
                    <p v-for="item in buildItems" :key="`build-${item}`">
                        <span>✓</span>{{ item }}
                    </p>
                </div>
                <div class="growth-list-divider"></div>
                <div class="growth-list-group">
                    <h3>{{ t("skye.scale") }}</h3>
                    <p v-for="item in scaleItems" :key="`scale-${item}`">
                        <span>✓</span>{{ item }}
                    </p>
                </div>
                <div class="growth-list-divider"></div>
                <div class="growth-list-group">
                    <h3>{{ t("skye.optimize") }}</h3>
                    <p v-for="item in optimizeItems" :key="`optimize-${item}`">
                        <span>✓</span>{{ item }}
                    </p>
                </div>
            </div>
        </section>

        <section class="formula-section">
            <h2>
                {{ t("skye.formula_title_line1") }}<br />{{
                    t("skye.formula_title_line2")
                }}
            </h2>
            <p class="formula-lead">
                <strong>{{ t("skye.formula_lead") }}</strong>
            </p>
            <p class="formula-copy">
                <span v-html="t('skye.formula_copy_html')"></span>
            </p>
            <div
                class="formula-scroll"
                :aria-label="t('skye.formula_cards_label')"
            >
                <article
                    v-for="card in formulaCards"
                    :key="card.title"
                    class="formula-mini-card"
                >
                    <h3 v-html="card.title"></h3>
                    <img :src="card.image" :alt="card.alt" draggable="false" />
                </article>
            </div>
            <div class="formula-proof">
                <img :src="profitIcon" alt="" />
                <p>
                    <span v-html="t('skye.formula_proof_html')"></span>
                </p>
            </div>
        </section>

        <section class="stories-section">
            <div class="stories-intro">
                <h2>
                    {{ t("skye.real_stories_line1") }}<br />{{
                        t("skye.real_stories_line2")
                    }}
                </h2>
                <p>{{ t("skye.real_stories_copy") }}</p>
            </div>

            <div class="stories-carousel-wrap">
                <div
                    ref="storyScrollRef"
                    class="stories-scroll"
                    :style="{
                        transform: `translate3d(-${activeStoryOffset}px, 0, 0)`,
                    }"
                    :aria-label="t('skye.success_story_carousel_label')"
                >
                    <article
                        v-for="(story, index) in storyCards"
                        :key="story.name"
                        :ref="(el) => setStoryCardRef(el, index)"
                        class="story-card"
                    >
                        <div class="story-card-media">
                            <img
                                :src="story.image"
                                :alt="story.name"
                                draggable="false"
                            />
                        </div>
                        <div class="story-card-body">
                            <div v-if="story.logo" class="story-card-logo">
                                <img
                                    :src="story.logo"
                                    :alt="`${story.name} logo`"
                                />
                            </div>
                            <h3 v-else>{{ story.name }}</h3>
                            <p
                                class="story-card-copy"
                                v-html="story.copyHtml"
                            ></p>
                            <a
                                v-if="story.linkText"
                                class="story-card-link"
                                href="javascript:void(0)"
                            >
                                {{ story.linkText }}
                            </a>
                            <div class="story-card-stats">
                                <p
                                    v-for="metric in story.stats"
                                    :key="`${story.name}-${metric.label}`"
                                >
                                    <strong>{{ metric.value }}</strong>
                                    <span>{{ metric.label }}</span>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
                <button
                    class="story-card-next"
                    type="button"
                    :aria-label="t('skye.next_story')"
                    @click.stop="nextStory"
                >
                    <img :src="storyArrowRight" alt="" />
                </button>
            </div>

            <div
                class="story-dots"
                :aria-label="t('skye.story_indicators_label')"
            >
                <button
                    v-for="(story, index) in storyCards"
                    :key="`${story.name}-dot`"
                    type="button"
                    :class="{ active: index === activeStoryIndex }"
                    :aria-label="t('skye.go_to_story', { num: index + 1 })"
                    @click="goStory(index)"
                ></button>
            </div>
        </section>

        <section class="amazon-ai-section">
            <div class="amazon-ai-card">
                <img
                    class="amazon-ai-hero"
                    :src="amazonAiImage"
                    :alt="t('skye.amazon_ai_image_alt')"
                    draggable="false"
                />
                <h2>{{ t("skye.amazon_ai_title") }}</h2>
                <p>{{ t("skye.amazon_ai_copy") }}</p>
                <div class="amazon-ai-points">
                    <p>✓ {{ t("skye.amazon_ai_point_1") }}</p>
                    <p>✓ {{ t("skye.amazon_ai_point_2") }}</p>
                    <p>✓ {{ t("skye.amazon_ai_point_3") }}</p>
                </div>
            </div>
        </section>

        <section class="ecommerce-section">
            <h2>
                {{ t("skye.ecommerce_title_line1") }}<br />{{
                    t("skye.ecommerce_title_line2")
                }}
            </h2>
            <div class="ecommerce-card-list">
                <article
                    v-for="service in ecommerceServices"
                    :key="service.title"
                    class="ecommerce-service-card"
                >
                    <div class="ecommerce-service-top">
                        <h3>{{ service.title }}</h3>
                        <button
                            type="button"
                            :aria-label="t('skye.open_service')"
                        >
                            <img :src="arrowRight" alt="" />
                        </button>
                    </div>
                    <div class="ecommerce-service-bottom">
                        <p>{{ service.copy }}</p>
                        <img
                            :src="service.image"
                            :alt="service.title"
                            draggable="false"
                        />
                    </div>
                </article>
            </div>
        </section>

        <section class="channel-section">
            <h2>
                {{ t("skye.channel_title_line1") }}<br />{{
                    t("skye.channel_title_line2")
                }}
            </h2>
            <div
                class="channel-carousel"
                :aria-label="t('skye.channel_carousel_label')"
            >
                <div class="channel-track">
                    <div
                        v-for="(channel, index) in channelCarouselItems"
                        :key="`${channel.name}-${index}`"
                        class="channel-item"
                    >
                        <span>
                            <img
                                :src="channel.image"
                                :alt="channel.name"
                                draggable="false"
                            />
                        </span>
                        <p>{{ channel.name }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- <section class="pricing-section">
            <div class="pricing-card">
                <h2>
                    {{ t("skye.pricing_title_line1") }}<br />{{
                        t("skye.pricing_title_line2")
                    }}
                </h2>
                <p class="pricing-subtitle">
                    {{ t("skye.pricing_subtitle") }}
                </p>

                <div class="pricing-control">
                    <div class="pricing-control-head">
                        <label for="monthlyAdSpend">{{
                            t("skye.monthly_ad_spend")
                        }}</label>
                        <input
                            id="monthlyAdSpend"
                            v-model.number="monthlyAdSpendModel"
                            type="number"
                            min="0"
                            max="100000"
                            step="500"
                            inputmode="numeric"
                            @blur="monthlyAdSpendModel = monthlyAdSpend"
                        />
                    </div>
                    <input
                        v-model.number="monthlyAdSpendModel"
                        class="pricing-range"
                        :style="monthlyRangeStyle"
                        type="range"
                        min="0"
                        max="100000"
                        step="500"
                    />
                </div>

                <div class="pricing-control">
                    <div class="pricing-control-head">
                        <label for="returnOnAdSpend">{{
                            t("skye.return_on_ad_spend")
                        }}</label>
                        <input
                            id="returnOnAdSpend"
                            v-model.number="returnOnAdSpendModel"
                            type="number"
                            min="0"
                            max="50"
                            step="1"
                            inputmode="decimal"
                            @blur="returnOnAdSpendModel = returnOnAdSpend"
                        />
                    </div>
                    <input
                        v-model.number="returnOnAdSpendModel"
                        class="pricing-range"
                        :style="roasRangeStyle"
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                    />
                </div>

                <div class="pricing-results">
                    <div>
                        <span>{{ t("skye.our_cost") }}</span>
                        <strong>{{ formattedOurCost }}</strong>
                    </div>
                    <div>
                        <span>{{ t("skye.your_revenue") }}</span>
                        <strong>{{ formattedRevenue }}</strong>
                    </div>
                </div>

                <div class="pricing-chart-row">
                    <div class="pricing-donut-wrap">
                        <div
                            ref="pricingChartRef"
                            class="pricing-echart"
                            :aria-label="t('skye.pricing_chart_label')"
                        ></div>
                        <div class="pricing-donut-core">
                            <img
                                :src="pricingLogo"
                                :alt="t('skye.algofy_logo_alt')"
                            />
                        </div>
                    </div>
                    <div class="pricing-legend">
                        <p>
                            <span class="dot dot-blue"></span
                            >{{ t("skye.revenue") }}<br />{{ t("skye.spend") }}
                        </p>
                        <p>
                            <span class="dot dot-red"></span>{{ t("skye.ad")
                            }}<br />{{ t("skye.spend") }}
                        </p>
                        <p>
                            <span class="dot dot-gray"></span
                            >{{ t("skye.our_cost_legend") }}
                        </p>
                    </div>
                </div>
            </div>
        </section> -->

        <section class="stellar-section">
            <div class="stellar-visual">
                <img
                    class="stellar-visual__image"
                    :src="stellarMapImage"
                    :alt="t('skye.stellar_visual_alt')"
                    draggable="false"
                />
            </div>
            <!-- <div class="stellar-copy">
                <h2>
                    {{ t("skye.stellar_title_line1") }}<br />{{
                        t("skye.stellar_title_line2")
                    }}<br /><span>{{ t("skye.stellar_title_stellar") }}</span>
                </h2>
                <p><span v-html="t('skye.stellar_copy_1_html')"></span></p>
                <p>{{ t("skye.stellar_copy_2") }}</p>
                <p>{{ t("skye.stellar_copy_3") }}</p>
                <div class="stellar-means">
                    <strong>{{ t("skye.stellar_means_title") }}</strong>
                    <p>✓ {{ t("skye.stellar_mean_1") }}</p>
                    <p>✓ {{ t("skye.stellar_mean_2") }}</p>
                    <p>✓ {{ t("skye.stellar_mean_3") }}</p>
                    <p>✓ {{ t("skye.stellar_mean_4") }}</p>
                </div>
            </div> -->
        </section>

        <section class="clutch-section">
            <div class="clutch-heading">
                <h2>
                    {{ t("skye.hear_from_brands_line1") }}<br />{{
                        t("skye.hear_from_brands_line2")
                    }}
                </h2>
                <img
                    class="clutch-wordmark-img"
                    :src="clutchWordmarkImage"
                    :alt="t('skye.clutch_logo_alt')"
                    draggable="false"
                />
            </div>
            <div class="clutch-panel">
                <div class="clutch-summary">
                    <h3>{{ t("skye.algofy_reviews") }}</h3>
                    <p>
                        <strong>5.0</strong> <span class="stars">★★★★★</span>
                        <small>{{ t("skye.reviews_count") }}</small>
                    </p>
                    <span class="powered"
                        ><span v-html="t('skye.powered_by_clutch_html')"></span
                    ></span>
                </div>
                <div class="review-carousel">
                    <button
                        class="review-nav review-nav--left"
                        type="button"
                        :aria-label="t('skye.previous_review')"
                        @click="prevReview"
                    >
                        ‹
                    </button>
                    <div class="review-window">
                        <div
                            class="review-track"
                            :style="{
                                transform: `translateX(-${activeReviewIndex * 100}%)`,
                            }"
                        >
                            <article
                                v-for="review in clutchReviews"
                                :key="review.author"
                                class="review-card"
                            >
                                <div class="review-stars">
                                    <strong>5.0</strong><span>★★★★★</span>
                                </div>
                                <p class="review-text">{{ review.text }}</p>
                                <p class="review-author">{{ review.author }}</p>
                                <p class="verified">
                                    ✓ {{ t("skye.verified_review") }}
                                </p>
                            </article>
                        </div>
                    </div>
                    <button
                        class="review-nav review-nav--right"
                        type="button"
                        :aria-label="t('skye.next_review')"
                        @click="nextReview"
                    >
                        ›
                    </button>
                </div>
            </div>
            <div class="black-framework">
                <h2>
                    {{ t("skye.framework_title_line1") }}<br />{{
                        t("skye.framework_title_line2")
                    }}
                </h2>
                <p>
                    {{ t("skye.framework_copy") }}
                </p>
            </div>
        </section>

        <footer class="algofy-footer-dark">
            <h2>{{ t("skye.footer_brand") }}</h2>
            <p>{{ t("skye.footer_copy") }}</p>
            <a class="footer-mail" href="mailto:contact@algofy.com"
                >contact@algofy.com</a
            >
            <a
                class="footer-social"
                href="javascript:void(0)"
                :aria-label="t('skye.linkedin_label')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 50 50"
                    width="50"
                    height="50"
                    aria-hidden="true"
                >
                    <path
                        d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
                    ></path>
                </svg>
            </a>
            <div class="footer-partner-strip">
                <img
                    v-for="badge in footerPartnerBadges"
                    :key="`footer-${badge}`"
                    :src="badge"
                    :alt="t('skye.partner_badge_alt')"
                />
            </div>
        </footer>
    </section>
</template>

<script setup>
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";

const { t } = useI18n();

const brandAmazon = new URL(
    "@/static/images/algofy-assets/brand-amazon.png",
    import.meta.url,
).href;
const brandAlgofy = new URL(
    "@/static/images/algofy-assets/brand-algofy.png",
    import.meta.url,
).href;
const brandPixis = new URL(
    "@/static/images/algofy-assets/brand-pixis.png",
    import.meta.url,
).href;
const brandCir = new URL(
    "@/static/images/algofy-assets/brand-cir.png",
    import.meta.url,
).href;
const brandCiai = new URL(
    "@/static/images/algofy-assets/brand-ciai.png",
    import.meta.url,
).href;
const brandMotion = new URL(
    "@/static/images/algofy-assets/brand-motion.png",
    import.meta.url,
).href;

const arrowLeft = new URL(
    "@/static/images/algofy-case/arrow-left.svg",
    import.meta.url,
).href;
const arrowRight = new URL(
    "@/static/images/algofy-case/arrow-right.svg",
    import.meta.url,
).href;
const caseLogoPuffin = new URL(
    "@/static/images/algofy-case/logo-puffin.png",
    import.meta.url,
).href;
const caseLogoMoon = new URL(
    "@/static/images/algofy-case/logo-moon.png",
    import.meta.url,
).href;
const caseLogoGiantLoop = new URL(
    "@/static/images/algofy-case/logo-giant-loop.png",
    import.meta.url,
).href;
const avatarRick = new URL(
    "@/static/images/algofy-case/rick-lee.jpg",
    import.meta.url,
).href;
const avatarHenry = new URL(
    "@/static/images/algofy-case/henry-moon.png",
    import.meta.url,
).href;
const avatarHarold = new URL(
    "@/static/images/algofy-case/harold-giant-loop.png",
    import.meta.url,
).href;

const partnerClutch = new URL(
    "@/static/images/algofy-partners/clutch.png",
    import.meta.url,
).href;
const clutchWordmarkImage = new URL(
    "@/static/images/algofy-partners/clutch-wordmark.svg",
    import.meta.url,
).href;
const partnerGoogle = new URL(
    "@/static/images/algofy-partners/google-partner.svg",
    import.meta.url,
).href;
const partnerKlaviyo = new URL(
    "@/static/images/algofy-partners/klaviyo-partner.svg",
    import.meta.url,
).href;
const partnerAmazon = new URL(
    "@/static/images/algofy-partners/amazon-advertising.png",
    import.meta.url,
).href;
const partnerFacebook = new URL(
    "@/static/images/algofy-partners/facebook-marketing.png",
    import.meta.url,
).href;
const partnerEcommerce = new URL(
    "@/static/images/algofy-partners/ecommerce-badge.svg",
    import.meta.url,
).href;

const growthVLSSHB = new URL(
    "@/static/images/algofy-growth/VLSSHB.png",
    import.meta.url,
).href;
const growthMonster = new URL(
    "@/static/images/algofy-growth/monster-k9.png",
    import.meta.url,
).href;
const growthGL = new URL(
    "@/static/images/algofy-growth/GL.png",
    import.meta.url,
).href;
const growthUSWESHB = new URL(
    "@/static/images/algofy-growth/USWESHB.png",
    import.meta.url,
).href;
const growthPackfire = new URL(
    "@/static/images/algofy-growth/packfire.png",
    import.meta.url,
).href;
const growthGiantLoop = new URL(
    "@/static/images/algofy-growth/giant-loop.png",
    import.meta.url,
).href;

const growthUswe = new URL(
    "@/static/images/algofy-growth/uswe.png",
    import.meta.url,
).href;
const growthReef = new URL(
    "@/static/images/algofy-growth/reef.png",
    import.meta.url,
).href;
const growthMoonSHB = new URL(
    "@/static/images/algofy-growth/MoonSHB.png",
    import.meta.url,
).href;

const growthMoon = new URL(
    "@/static/images/algofy-growth/moon.png",
    import.meta.url,
).href;
const growthAurora = new URL(
    "@/static/images/algofy-growth/aurora.png",
    import.meta.url,
).href;
const growthAmazon = new URL(
    "@/static/images/algofy-growth/amazon.png",
    import.meta.url,
).href;
const growthAnalytics = new URL(
    "@/static/images/algofy-growth/analytics.png",
    import.meta.url,
).href;

const formulaAiTools = new URL(
    "@/static/images/algofy-formula/advanced-ai-tools.png",
    import.meta.url,
).href;
const formulaConversionMedia = new URL(
    "@/static/images/algofy-formula/conversion-first-media.png",
    import.meta.url,
).href;
const formulaAmazonWalmart = new URL(
    "@/static/images/algofy-formula/amazon-walmart.png",
    import.meta.url,
).href;
const stellarMapImage = new URL(
    "@/static/images/algofy-formula/stellar-map.png",
    import.meta.url,
).href;
const formulaReportingDashboard = new URL(
    "@/static/images/algofy-formula/reporting-dashboard.png",
    import.meta.url,
).href;
const profitIcon = new URL(
    "@/static/images/algofy-formula/profit.svg",
    import.meta.url,
).href;

const storyReefImage = new URL(
    "@/static/images/algofy-stories/reef-story.png",
    import.meta.url,
).href;
const storyArrowRight = new URL(
    "@/static/images/algofy-stories/carousel-right.png",
    import.meta.url,
).href;
const amazonAiImage = new URL(
    "@/static/images/algofy-ai/amazon-ai.png",
    import.meta.url,
).href;

const ecommerceFullAmazon = new URL(
    "@/static/images/algofy-ecommerce/full-service-amazon.png",
    import.meta.url,
).href;
const ecommerceCreative = new URL(
    "@/static/images/algofy-ecommerce/amazon-creative.png",
    import.meta.url,
).href;
const ecommercePaidMedia = new URL(
    "@/static/images/algofy-ecommerce/paid-media.png",
    import.meta.url,
).href;
const ecommerceEmailSms = new URL(
    "@/static/images/algofy-ecommerce/email-sms.png",
    import.meta.url,
).href;

const channelAmazon = new URL(
    "@/static/images/algofy-assets/amazong.png",
    import.meta.url,
).href;
const channelAnalytics = new URL(
    "@/static/images/algofy-assets/ansgo.png",
    import.meta.url,
).href;
const channelShopify = new URL(
    "@/static/images/algofy-assets/googshop.png",
    import.meta.url,
).href;
const channelMeta = new URL(
    "@/static/images/algofy-assets/metatr.png",
    import.meta.url,
).href;
const channelKlaviyo = new URL(
    "@/static/images/algofy-assets/kla.png",
    import.meta.url,
).href;
const channelGoogleAds = new URL(
    "@/static/images/algofy-assets/goads.png",
    import.meta.url,
).href;

const pricingLogo = new URL("@/static/images/logo.svg", import.meta.url).href;
const pricingChartRef = ref(null);
let pricingChart = null;

const heroBrands = [
    { name: "Amazon", image: brandAmazon, className: "brand-amazon" },
    { name: "ALGOFY", image: brandAlgofy, className: "brand-algofy" },
    { name: "PIXIS", image: brandPixis, className: "brand-pixis" },
    { name: "CIR", image: brandCir, className: "brand-cir" },
    { name: "CIAI", image: brandCiai, className: "brand-cia" },
    { name: "Motion", image: brandMotion, className: "brand-motion" },
];

const trustedLogoSet = [
    {
        name: "Addax",
        image: new URL(
            "@/static/images/algofy-carousel/addax.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Farm Hub",
        image: new URL(
            "@/static/images/algofy-carousel/farm-hub.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Nectar",
        image: new URL(
            "@/static/images/algofy-carousel/nectar.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Bon Bon",
        image: new URL(
            "@/static/images/algofy-carousel/bon-bon.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Mosi",
        image: new URL(
            "@/static/images/algofy-carousel/mosi.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Cambridge",
        image: new URL(
            "@/static/images/algofy-carousel/cambridge.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "The Nail Hub",
        image: new URL(
            "@/static/images/algofy-carousel/nail-hub.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Curateur",
        image: new URL(
            "@/static/images/algofy-carousel/curateur.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Lash Apothecary",
        image: new URL(
            "@/static/images/algofy-carousel/lash-apothecary.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Bella Skin Beauty",
        image: new URL(
            "@/static/images/algofy-carousel/bella-skin.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Rain",
        image: new URL(
            "@/static/images/algofy-carousel/rain.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "VLS Aurora",
        image: new URL(
            "@/static/images/algofy-carousel/vls-aurora.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "1Up Nutrition",
        image: new URL(
            "@/static/images/algofy-carousel/one-up.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Vitality Brands",
        image: new URL(
            "@/static/images/algofy-carousel/vitality-brands.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Sijo",
        image: new URL(
            "@/static/images/algofy-carousel/sijo.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Reef",
        image: new URL(
            "@/static/images/algofy-carousel/reef.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Sonos",
        image: new URL(
            "@/static/images/algofy-carousel/sonos.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Breitling",
        image: new URL(
            "@/static/images/algofy-carousel/breitling.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "American Apparel",
        image: new URL(
            "@/static/images/algofy-carousel/american-apparel.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Sears",
        image: new URL(
            "@/static/images/algofy-carousel/sears.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Windows USA",
        image: new URL(
            "@/static/images/algofy-carousel/windows-usa.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Molyneaux",
        image: new URL(
            "@/static/images/algofy-carousel/molyneaux.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "CRI",
        image: new URL(
            "@/static/images/algofy-carousel/cri.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Mazda",
        image: new URL(
            "@/static/images/algofy-carousel/mazda.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Eye of Horus",
        image: new URL(
            "@/static/images/algofy-carousel/eye-of-horus.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "Void Cycling",
        image: new URL(
            "@/static/images/algofy-carousel/void.svg",
            import.meta.url,
        ).href,
    },
    {
        name: "GLD",
        image: new URL(
            "@/static/images/algofy-carousel/gld.svg",
            import.meta.url,
        ).href,
    },
];

const logoReef = new URL(
    "@/static/images/algofy-carousel/reef.svg",
    import.meta.url,
).href;
const logoVoid = new URL(
    "@/static/images/algofy-carousel/void.svg",
    import.meta.url,
).href;

const trustedCarouselLogos = [...trustedLogoSet, ...trustedLogoSet];

const partnerBadges = [
    { name: "Clutch", image: partnerClutch },
    { name: "Google Partner", image: partnerGoogle },
    { name: "Klaviyo Partner", image: partnerKlaviyo },
    { name: "Amazon Advertising Partner", image: partnerAmazon },
    { name: "Facebook Marketing Partner", image: partnerFacebook },
    { name: "Ecommerce Partner", image: partnerEcommerce },
];

const footerPartnerBadges = [
    partnerGoogle,
    partnerAmazon,
    partnerFacebook,
    partnerKlaviyo,
    partnerClutch,
];

const growthSlides = [
    { name: "Monster K9", image: growthVLSSHB },
    { name: "Packfire", image: growthMonster },
    { name: "Giant Loop", image: growthGL },
    // growthGiantLoop
    { name: "USWE", image: growthUSWESHB },
    { name: "Reef", image: growthPackfire },
    { name: "Moon", image: growthMoonSHB },
    { name: "Aurora", image: growthReef },
    { name: "Analytics", image: growthAmazon },
    // growthAnalytics
];

const buildItems = computed(() => [
    t("skye.build_item_1"),
    t("skye.build_item_2"),
    t("skye.build_item_3"),
    t("skye.build_item_4"),
]);

const scaleItems = computed(() => [
    t("skye.scale_item_1"),
    t("skye.scale_item_2"),
    t("skye.scale_item_3"),
    t("skye.build_item_4"),
]);

const optimizeItems = computed(() => [
    t("skye.optimize_item_1"),
    t("skye.optimize_item_2"),
    t("skye.optimize_item_3"),
    t("skye.optimize_item_4"),
]);

const formulaCards = computed(() => [
    {
        title: t("skye.formula_card_1_title_html"),
        image: formulaAiTools,
        alt: t("skye.formula_card_1_alt"),
    },
    {
        title: t("skye.formula_card_2_title_html"),
        image: formulaConversionMedia,
        alt: t("skye.formula_card_2_alt"),
    },
    {
        title: t("skye.formula_card_3_title_html"),
        image: formulaAmazonWalmart,
        alt: t("skye.formula_card_3_alt"),
    },
    {
        title: t("skye.formula_card_4_title_html"),
        image: formulaReportingDashboard,
        alt: t("skye.formula_card_4_alt"),
    },
]);

const ecommerceServices = computed(() => [
    {
        title: t("skye.ecommerce_service_1_title"),
        copy: t("skye.ecommerce_service_1_copy"),
        image: ecommerceFullAmazon,
    },
    {
        title: t("skye.ecommerce_service_2_title"),
        copy: t("skye.ecommerce_service_2_copy"),
        image: ecommerceCreative,
    },
    // {
    //     title: t("skye.ecommerce_service_3_title"),
    //     copy: t("skye.ecommerce_service_3_copy"),
    //     image: ecommercePaidMedia,
    // },
    // {
    //     title: t("skye.ecommerce_service_4_title"),
    //     copy: t("skye.ecommerce_service_4_copy"),
    //     image: ecommerceEmailSms,
    // },
]);

const channelItems = computed(() => [
    { name: t("skye.channel_amazon"), image: channelAmazon },
    { name: t("skye.channel_analytics"), image: channelAnalytics },
    { name: t("skye.channel_shopify"), image: channelShopify },
    { name: t("skye.channel_meta"), image: channelMeta },
    { name: t("skye.channel_klaviyo"), image: channelKlaviyo },
    { name: t("skye.channel_google_ads"), image: channelGoogleAds },
]);

const channelCarouselItems = computed(() => [
    ...channelItems.value,
    ...channelItems.value,
]);

const clampNumber = (value, min, max) => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return min;
    return Math.min(Math.max(numberValue, min), max);
};

const monthlyAdSpend = ref(32500);
const returnOnAdSpend = ref(13);

const monthlyAdSpendModel = computed({
    get: () => monthlyAdSpend.value,
    set: (value) => {
        monthlyAdSpend.value =
            Math.round(clampNumber(value, 0, 100000) / 500) * 500;
    },
});

const returnOnAdSpendModel = computed({
    get: () => returnOnAdSpend.value,
    set: (value) => {
        returnOnAdSpend.value = Math.round(clampNumber(value, 0, 50));
    },
});

const normalizedAdSpend = computed(() =>
    clampNumber(monthlyAdSpend.value, 0, 100000),
);
const normalizedRoas = computed(() =>
    clampNumber(returnOnAdSpend.value, 0, 50),
);
const projectedRevenue = computed(
    () => normalizedAdSpend.value * normalizedRoas.value,
);
const projectedOurCost = computed(() =>
    Math.max(500, projectedRevenue.value * 0.025),
);

const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const formattedRevenue = computed(() =>
    moneyFormatter.format(projectedRevenue.value),
);
const formattedOurCost = computed(() =>
    moneyFormatter.format(projectedOurCost.value),
);

const monthlyRangeStyle = computed(() => {
    const percent = (normalizedAdSpend.value / 100000) * 100;
    return { "--range-fill": `${percent}%` };
});

const roasRangeStyle = computed(() => {
    const percent = (normalizedRoas.value / 50) * 100;
    return { "--range-fill": `${percent}%` };
});

function updatePricingChart() {
    if (!pricingChart) return;

    const redValue =
        normalizedAdSpend.value > 0
            ? Math.round((normalizedAdSpend.value / 100000) * 100)
            : 0;
    const blueValue =
        normalizedAdSpend.value > 0 && normalizedRoas.value > 0
            ? Math.round((normalizedRoas.value / 50) * 100)
            : 0;
    const grayValue =
        redValue > 0 || blueValue > 0
            ? Math.max(0, 100 - redValue - blueValue)
            : 100;

    const data =
        redValue > 0 || blueValue > 0
            ? [
                  { value: redValue, itemStyle: { color: "#ef2554" } },
                  { value: blueValue, itemStyle: { color: "#2450f4" } },
                  { value: grayValue, itemStyle: { color: "#d9d9de" } },
              ].filter((item) => item.value > 0)
            : [{ value: 100, itemStyle: { color: "#d9d9de" } }];

    pricingChart.setOption(
        {
            animation: true,
            animationDurationUpdate: 260,
            series: [
                {
                    type: "pie",
                    radius: ["58%", "82%"],
                    center: ["50%", "50%"],
                    startAngle: 90,
                    clockwise: true,
                    silent: true,
                    label: { show: false },
                    labelLine: { show: false },
                    emphasis: { scale: false },
                    data,
                },
            ],
        },
        true,
    );
}

function initPricingChart() {
    if (!pricingChartRef.value) return;
    pricingChart = echarts.init(pricingChartRef.value, null, {
        renderer: "svg",
    });
    updatePricingChart();
}

const visibleGrowthSlides = computed(() => [
    growthSlides[growthSlides.length - 1],
    ...growthSlides,
    growthSlides[0],
]);

const storyCards = computed(() => [
    {
        name: "Reef",
        image: storyReefImage,
        logo: logoReef,
        copyHtml: t("skye.story_reef_copy"),
        stats: [
            { value: "+58%", label: t("skye.metric_roas") },
            { value: "-39%", label: t("skye.metric_cpc") },
            { value: "+131%", label: t("skye.metric_amazon_ad_sales") },
        ],
    },
    {
        name: "VOID Cycling",
        image: growthUswe,
        logo: logoVoid,
        copyHtml: t("skye.story_void_copy"),
        linkText: t("skye.learn_more"),
        stats: [
            { value: "+505%", label: t("skye.metric_roas") },
            { value: "+344%", label: t("skye.metric_transactions") },
            { value: "+465%", label: t("skye.metric_conversion_rate") },
        ],
    },
    {
        name: "Moon",
        image: growthMoon,
        logo: caseLogoMoon,
        copyHtml: t("skye.story_moon_copy"),
        stats: [
            { value: "+45%", label: t("skye.metric_traffic") },
            { value: "+41%", label: t("skye.metric_revenue") },
            { value: "+50%", label: t("skye.metric_transactions") },
        ],
    },
    {
        name: "Giant Loop",
        image: growthAurora,
        logo: caseLogoGiantLoop,
        copyHtml: t("skye.story_giant_loop_copy"),
        stats: [
            { value: "+347%", label: t("skye.metric_traffic") },
            { value: "+321%", label: t("skye.metric_revenue") },
            { value: "+235%", label: t("skye.metric_transactions") },
        ],
    },
]);

const clutchReviews = computed(() => [
    {
        text: t("skye.review_1"),
        author: t("skye.review_author_1"),
    },
    {
        text: t("skye.review_2"),
        author: t("skye.review_author_2"),
    },
    {
        text: t("skye.review_3"),
        author: t("skye.review_author_3"),
    },
    {
        text: t("skye.review_4"),
        author: t("skye.review_author_4"),
    },
    {
        text: t("skye.review_5"),
        author: t("skye.review_author_5"),
    },
    {
        text: t("skye.review_6"),
        author: t("skye.review_author_6"),
    },
    {
        text: t("skye.review_7"),
        author: t("skye.review_author_7"),
    },
    {
        text: t("skye.review_8"),
        author: t("skye.review_author_8"),
    },
    {
        text: t("skye.review_9"),
        author: t("skye.review_author_9"),
    },
    {
        text: t("skye.review_10"),
        author: t("skye.review_author_10"),
    },
    {
        text: t("skye.review_11"),
        author: t("skye.review_author_11"),
    },
    {
        text: t("skye.review_12"),
        author: t("skye.review_author_12"),
    },
]);

const activeReviewIndex = ref(0);

function prevReview() {
    activeReviewIndex.value =
        (activeReviewIndex.value - 1 + clutchReviews.value.length) %
        clutchReviews.value.length;
}

function nextReview() {
    activeReviewIndex.value =
        (activeReviewIndex.value + 1) % clutchReviews.value.length;
}

const caseStories = computed(() => [
    {
        name: "Puffin Drinkwear",
        logo: caseLogoPuffin,
        avatar: avatarRick,
        person: "Rick Lee",
        authorHtml: t("skye.case_puffin_author_html"),
        quoteHtml: t("skye.case_puffin_quote_html"),
        stats: [
            { value: 441, label: t("skye.metric_traffic") },
            { value: 382, label: t("skye.metric_revenue") },
            { value: 378, label: t("skye.metric_transactions") },
        ],
    },
    {
        name: "Moon",
        logo: caseLogoMoon,
        avatar: avatarHenry,
        person: "Henry",
        authorHtml: t("skye.case_moon_author_html"),
        quoteHtml: t("skye.case_moon_quote_html"),
        stats: [
            { value: 45, label: t("skye.metric_traffic") },
            { value: 41, label: t("skye.metric_revenue") },
            { value: 50, label: t("skye.metric_transactions") },
        ],
    },
    {
        name: "Giant Loop",
        logo: caseLogoGiantLoop,
        avatar: avatarHarold,
        person: "Harold",
        authorHtml: t("skye.case_giant_author_html"),
        quoteHtml: t("skye.case_giant_quote_html"),
        stats: [
            { value: 347, label: t("skye.metric_traffic") },
            { value: 321, label: t("skye.metric_revenue") },
            { value: 235, label: t("skye.metric_transactions") },
        ],
    },
]);

const visibleCaseSlides = computed(() => [
    caseStories.value[caseStories.value.length - 1],
    ...caseStories.value,
    caseStories.value[0],
]);

const activeCaseIndex = ref(0);
const caseSlidePosition = ref(1);
const caseTransitionEnabled = ref(true);
const isCaseSliding = ref(false);
const animatedStats = ref([0, 0, 0]);
const activeCase = computed(() => caseStories.value[activeCaseIndex.value]);
let statTimer = 0;

function animateStats() {
    if (statTimer) {
        window.clearInterval(statTimer);
    }
    const targets = activeCase.value.stats.map((item) => item.value);
    animatedStats.value = targets.map(() => 0);
    const duration = 900;
    const steps = 30;
    let currentStep = 0;
    statTimer = window.setInterval(() => {
        currentStep += 1;
        const progress = Math.min(currentStep / steps, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        animatedStats.value = targets.map((target) =>
            Math.round(target * eased),
        );
        if (currentStep >= steps) {
            animatedStats.value = targets;
            window.clearInterval(statTimer);
            statTimer = 0;
        }
    }, duration / steps);
}

function prevCase() {
    if (isCaseSliding.value) return;
    isCaseSliding.value = true;
    caseTransitionEnabled.value = true;
    activeCaseIndex.value =
        (activeCaseIndex.value - 1 + caseStories.value.length) %
        caseStories.value.length;
    caseSlidePosition.value -= 1;
}

function nextCase() {
    if (isCaseSliding.value) return;
    isCaseSliding.value = true;
    caseTransitionEnabled.value = true;
    activeCaseIndex.value =
        (activeCaseIndex.value + 1) % caseStories.value.length;
    caseSlidePosition.value += 1;
}

function handleCaseTransitionEnd(event) {
    if (event.propertyName !== "transform") return;
    if (caseSlidePosition.value === 0) {
        caseTransitionEnabled.value = false;
        caseSlidePosition.value = caseStories.value.length;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                caseTransitionEnabled.value = true;
                isCaseSliding.value = false;
            });
        });
        return;
    }
    if (caseSlidePosition.value === caseStories.value.length + 1) {
        caseTransitionEnabled.value = false;
        caseSlidePosition.value = 1;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                caseTransitionEnabled.value = true;
                isCaseSliding.value = false;
            });
        });
        return;
    }
    isCaseSliding.value = false;
}

const activeGrowthIndex = ref(0);
const growthSlidePosition = ref(1);
const growthTransitionEnabled = ref(true);
const isGrowthSliding = ref(false);
const growthStartX = ref(0);
const growthMouseDown = ref(false);

function finishGrowthSlide() {
    isGrowthSliding.value = false;
}

function prevGrowth() {
    if (isGrowthSliding.value) return;
    isGrowthSliding.value = true;
    growthTransitionEnabled.value = true;
    activeGrowthIndex.value =
        (activeGrowthIndex.value - 1 + growthSlides.length) %
        growthSlides.length;
    growthSlidePosition.value -= 1;
}

function nextGrowth() {
    if (isGrowthSliding.value) return;
    isGrowthSliding.value = true;
    growthTransitionEnabled.value = true;
    activeGrowthIndex.value =
        (activeGrowthIndex.value + 1) % growthSlides.length;
    growthSlidePosition.value += 1;
}

function goGrowth(index) {
    if (index === activeGrowthIndex.value || isGrowthSliding.value) return;
    isGrowthSliding.value = true;
    growthTransitionEnabled.value = true;
    activeGrowthIndex.value = index;
    growthSlidePosition.value = index + 1;
}

function handleGrowthTransitionEnd(event) {
    if (event.propertyName !== "transform") return;
    if (growthSlidePosition.value === 0) {
        growthTransitionEnabled.value = false;
        growthSlidePosition.value = growthSlides.length;
        nextTick(() => {
            growthTransitionEnabled.value = true;
        });
    }
    if (growthSlidePosition.value === growthSlides.length + 1) {
        growthTransitionEnabled.value = false;
        growthSlidePosition.value = 1;
        nextTick(() => {
            growthTransitionEnabled.value = true;
        });
    }
    finishGrowthSlide();
}

function handleGrowthTouchStart(event) {
    growthStartX.value = event.changedTouches[0]?.clientX || 0;
}

function handleGrowthTouchEnd(event) {
    const endX = event.changedTouches[0]?.clientX || 0;
    const delta = endX - growthStartX.value;
    if (Math.abs(delta) < 34) return;
    delta > 0 ? prevGrowth() : nextGrowth();
}

function handleGrowthMouseDown(event) {
    growthMouseDown.value = true;
    growthStartX.value = event.clientX;
}

function handleGrowthMouseUp(event) {
    if (!growthMouseDown.value) return;
    const delta = event.clientX - growthStartX.value;
    growthMouseDown.value = false;
    if (Math.abs(delta) < 34) return;
    delta > 0 ? prevGrowth() : nextGrowth();
}

function cancelGrowthMouse() {
    growthMouseDown.value = false;
}

const storyScrollRef = ref(null);
const storyCardRefs = ref([]);
const activeStoryIndex = ref(0);
const activeStoryOffset = ref(0);

function setStoryCardRef(el, index) {
    if (el) {
        storyCardRefs.value[index] = el;
    }
}

function updateStoryOffset() {
    const activeCard = storyCardRefs.value[activeStoryIndex.value];
    if (!activeCard) {
        activeStoryOffset.value = 0;
        return;
    }

    activeStoryOffset.value = Math.max(activeCard.offsetLeft, 0);
}

function goStory(index) {
    if (!storyCards.value.length) return;
    activeStoryIndex.value =
        (index + storyCards.value.length) % storyCards.value.length;
    nextTick(updateStoryOffset);
}

function nextStory() {
    goStory(activeStoryIndex.value + 1);
}

function handleStoryResize() {
    updateStoryOffset();
}

onMounted(() => {
    initPricingChart();
    animateStats();
    nextTick(updateStoryOffset);
    window.addEventListener("resize", handleStoryResize, { passive: true });
});

watch(activeCaseIndex, () => {
    animateStats();
});

watch([normalizedAdSpend, normalizedRoas], () => {
    updatePricingChart();
});

onBeforeUnmount(() => {
    if (pricingChart) {
        pricingChart.dispose();
        pricingChart = null;
    }
    if (statTimer) {
        window.clearInterval(statTimer);
    }
    window.removeEventListener("resize", handleStoryResize);
});
</script>

<style scoped>
.algofy-home {
    --algofy-blue: #2450f4;
    --algofy-ink: #11182c;
    --algofy-soft: #eef2ff;
    min-height: 100vh;
    overflow: hidden;
    background: #f4f7ff;
    color: var(--algofy-ink);
    font-family: Inter, Arial, Helvetica, sans-serif;
}

.algofy-top-promo {
    height: 32px;
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--algofy-blue);
    color: #fff;
    font-size: 12.8px;
    letter-spacing: -0.01em;
}

.algofy-header {
    position: sticky;
    top: 0;
    z-index: 20;
    height: 58px;
    display: grid;
    grid-template-columns: 52px 1fr 52px;
    align-items: center;
    padding: 16px;
    background: #b9c6ff;
    backdrop-filter: blur(14px);
}

.algofy-brand-mark {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 19px;
    line-height: 1;
}

.algofy-brand-mark img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.algofy-hero {
    position: relative;
    min-height: 440px;
    padding: 134px 22px 70px;
    text-align: center;
    overflow: hidden;
    background-image:
        linear-gradient(#b9c6ff, rgba(255, 255, 255, 0) 18%),
        url("@/static/images/head.png"), url("@/static/images/head.png");
    background-position:
        0 0,
        50% 50%,
        50% 50%;
    background-repeat: repeat, no-repeat, no-repeat;
    background-size: auto, cover, cover;
    box-sizing: border-box;
}

.algofy-hero::before,
.algofy-hero::after {
    display: none;
}

.orbit {
    position: absolute;
    pointer-events: none;
}

.orbit-one {
    left: -145px;
    top: 96px;
    width: 440px;
    height: 440px;
    border: 4px solid rgba(255, 255, 255, 0.34);
    border-radius: 50%;
}

.orbit-two {
    right: -190px;
    top: 44px;
    width: 520px;
    height: 520px;
    border: 2px solid rgba(255, 255, 255, 0.28);
    border-radius: 50%;
}

.eyebrow {
    position: relative;
    z-index: 2;
    margin: 0 0 13px;
    color: #17213b;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: -0.025em;
}

.algofy-hero h1 {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    max-width: 348px;
    color: #111827;
    font-size: 28px;
    font-weight: 950;
    line-height: 1.28;
    letter-spacing: -0.055em;
}

.algofy-hero h1 span {
    color: var(--algofy-blue);
}

.floating-brand {
    position: absolute;
    z-index: 3;
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
}

.floating-brand img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.brand-amazon {
    top: 86px;
    left: 43px;
}

.brand-algofy {
    top: 37px;
    left: 50%;
    width: 76px;
    height: 76px;
    transform: translateX(-50%);
}

.brand-pixis {
    top: 86px;
    right: 38px;
}

.brand-cir {
    bottom: 84px;
    left: 32px;
}

.brand-cia {
    bottom: 84px;
    right: 32px;
}

.brand-motion {
    bottom: 44px;
    left: 50%;
    width: 64px;
    height: 64px;
    transform: translateX(-50%);
}

.algofy-trusted {
    position: relative;
    background: #f0f2f8;
    padding: 18px 0 18px;
    text-align: center;
    overflow: hidden;
}

.algofy-trusted p {
    position: relative;
    z-index: 2;
    margin: 0 0 19px;
    color: #101827;
    font-size: 10px;
    font-weight: 900;
}

.trusted-carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.trusted-carousel::before,
.trusted-carousel::after {
    content: "";
    position: absolute;
    top: 0;
    z-index: 2;
    width: 34px;
    height: 100%;
    pointer-events: none;
}

.trusted-carousel::before {
    left: 0;
    background: linear-gradient(90deg, #f0f2f8 0%, rgba(240, 242, 248, 0) 100%);
}

.trusted-carousel::after {
    right: 0;
    background: linear-gradient(
        270deg,
        #f0f2f8 0%,
        rgba(240, 242, 248, 0) 100%
    );
}

.trusted-track {
    display: flex;
    align-items: center;
    gap: 18px;
    width: max-content;
    padding: 0 12px;
    animation: trustedLogoMarquee 36s linear infinite;
    will-change: transform;
}

.trusted-logo {
    flex: 0 0 74px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    filter: none;
}

.trusted-logo img {
    display: block;
    max-width: 82px;
    max-height: 34px;
    width: auto;
    height: auto;
    object-fit: contain;
}

@keyframes trustedLogoMarquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(calc(-50% - 9px));
    }
}

.algofy-function-zone {
    background: #fff;
    padding: 22px 14px 26px;
}

.success-section {
    position: relative;
    background: #f0f2f8;
    padding: 26px 35px 28px;
    text-align: center;
}

.case-card {
    position: relative;
    min-height: 468px;
    border: 1px solid #d5dae7;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.96);
    padding: 42px 18px 28px;
    text-align: left;
    box-shadow: 0 8px 28px rgba(22, 35, 75, 0.08);
}

.case-slider-window {
    overflow: hidden;
}

.case-slider-track {
    display: flex;
    width: 100%;
    transition: transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
}

.case-slider-track.no-transition,
.growth-image-track.no-transition {
    transition: none !important;
}

.case-content {
    min-width: 100%;
    flex: 0 0 100%;
    min-height: 398px;
}

.case-logo {
    height: 54px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.case-logo img {
    display: block;
    max-width: 146px;
    max-height: 54px;
    object-fit: contain;
    filter: grayscale(1);
    opacity: 0.42;
}

.case-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.case-avatar {
    width: 54px;
    height: 54px;
    flex: 0 0 54px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
}

.case-author p {
    margin: 0;
    font-size: 16px;
    line-height: 1.35;
}

.case-card blockquote {
    margin: 0;
    color: #252b3a;
    font-size: 19px;
    line-height: 1.35;
    letter-spacing: -0.02em;
}

.case-stats {
    margin-top: 24px;
}

.case-stats p {
    margin: 0 0 16px;
    color: #727884;
    font-size: 16px;
    font-weight: 800;
}

.case-stats strong {
    color: var(--algofy-blue);
    font-size: 32px;
    font-weight: 950;
    letter-spacing: -0.05em;
}

.case-arrow {
    position: absolute;
    top: 50%;
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #1c2337;
    padding: 0;
    transform: translateY(-50%);
    z-index: 5;
}

.case-arrow img {
    display: block;
    width: 100%;
    height: 100%;
}

.case-arrow--left {
    left: -19px;
}

.case-arrow--right {
    right: -19px;
}

.partner-logo-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px 14px;
    margin: 18px auto 0;
    padding: 20px 0 22px;
    justify-items: center;
    align-items: center;
    width: min(100%, 330px);
    box-sizing: border-box;
}

.partner-logo-item {
    width: 86px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.partner-logo-item img {
    display: block;
    max-width: 88px;
    max-height: 46px;
    object-fit: contain;
}

.clients-section,
.formula-section,
.specialists-section,
.performance-section {
    background: #fff;
    padding: 40px 18px;
    text-align: center;
}

.clients-section {
    padding: 24px 18px 42px;
    background: #eef3fb;
}

.growth-showcase-card {
    padding: 46px 18px 22px;
    border-radius: 28px;
    background: #fff;
    box-shadow: 0 14px 30px rgba(17, 31, 73, 0.08);
}

.clients-section h2,
.formula-section h2,
.specialists-section h2,
.performance-section h2 {
    margin: 0 0 14px;
    color: #17213b;
    font-size: 28px;
    font-weight: 950;
    line-height: 1.08;
    letter-spacing: -0.05em;
}

.growth-showcase-card h2 {
    font-size: 26px;
    line-height: 1.08;
}

.growth-showcase-card > p,
.formula-section > p,
.performance-section > p {
    margin: 0 0 26px;
    color: #111827;
    font-size: 16px;
    line-height: 1.7;
}

.growth-carousel {
    user-select: none;
}

.growth-image-window {
    overflow: hidden;
    width: 100%;
}

.growth-image-track {
    display: flex;
    transition: transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
}

.growth-image-slide {
    min-width: 100%;
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.growth-image-slide img {
    display: block;
    width: 100%;
    max-width: 360px;
    height: auto;
    object-fit: contain;
    pointer-events: none;
}

.growth-controls {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
}

.growth-controls button {
    border: 0;
    background: transparent;
    padding: 0;
}

.growth-controls > button {
    width: 42px;
    height: 42px;
    margin: 0 auto;
}

.growth-controls > button img {
    display: block;
    width: 100%;
    height: 100%;
}

.growth-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
}

.growth-dots button {
    width: 10px;
    height: 10px;
    border: 1px solid #111827;
    border-radius: 50%;
    background: #fff;
}

.growth-dots button.active {
    background: #111827;
}

.growth-build-list {
    margin: 34px -18px 0;
    padding: 34px 30px 28px;
    text-align: left;
    background: #f0f2f8;
}

.growth-list-group h3,
.growth-build-list h3 {
    margin: 0 0 22px;
    color: #18233b;
    font-size: 20px;
    font-weight: 950;
    line-height: 1.15;
}

.growth-list-group p,
.growth-build-list p {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 10px;
    margin: 0 0 14px;
    color: #17213b;
    font-size: 15.5px;
    line-height: 1.55;
    letter-spacing: -0.01em;
}

.growth-list-group p span {
    color: #7b828d;
    font-weight: 900;
}

.growth-list-divider {
    height: 1px;
    margin: 18px 0 20px;
    background: rgba(120, 128, 146, 0.34);
}

.formula-section {
    padding: 44px 14px 46px;
    background: #f0f2f8;
    text-align: center;
}

.formula-section h2 {
    margin: 0 auto 24px;
    color: #242936;
    font-size: 26px;
    font-weight: 900;
    line-height: 1.18;
    letter-spacing: -0.035em;
}

.formula-lead {
    margin: 0 0 44px;
    color: #000;
    font-size: 15.5px;
    font-weight: 900;
    line-height: 1.55;
}

.formula-copy {
    margin: 0 0 36px;
    color: #050b17;
    font-size: 16px;
    line-height: 1.55;
    letter-spacing: -0.015em;
}

.formula-copy strong {
    font-weight: 950;
}

.formula-scroll {
    display: flex;
    gap: 16px;
    margin: 0;
    padding: 0 10px 8px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 24px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.formula-scroll::-webkit-scrollbar {
    display: none;
}

.formula-mini-card {
    flex: 0 0 calc(50% - 10px);
    min-width: 220px;
    max-width: 220px;
    padding: 22px 14px 16px;
    border-radius: 14px;
    background: #fff;
    scroll-snap-align: start;
    text-align: center;
    overflow: hidden;
}

.formula-mini-card h3 {
    min-height: 46px;
    margin: 0 0 14px;
    color: #3a3a3f;
    font-size: 16px;
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.02em;
}

.formula-mini-card img {
    display: block;
    width: 100%;
    max-height: 142px;
    object-fit: contain;
    user-select: none;
}

.formula-proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 28px 2px 0;
    padding: 16px 14px;
    border: 2px solid #b8ee99;
    border-radius: 5px;
    background: #e4ffd8;
    text-align: left;
}

.formula-proof img {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    object-fit: contain;
}

.formula-proof p {
    margin: 0;
    color: #050b17;
    font-size: 15px;
    line-height: 1.32;
}

.formula-proof strong {
    font-weight: 950;
}

.stories-section {
    --story-edge-gap: clamp(14px, 4vw, 20px);
    --story-right-peek: clamp(20px, 6vw, 28px);
    --story-gap: clamp(12px, 3.4vw, 16px);
    --story-card-width: calc(100% - var(--story-right-peek));
    position: relative;
    background: #f0f2f8;
    padding: 18px 0 28px;
}

.stories-intro {
    padding: 0 22px 22px;
    text-align: center;
}

.stories-intro h2 {
    margin: 0 0 16px;
    color: #202632;
    font-size: 26px;
    font-weight: 900;
    line-height: 1.18;
    letter-spacing: -0.03em;
}

.stories-intro p {
    margin: 0 auto;
    max-width: 290px;
    color: #202632;
    font-size: 14px;
    line-height: 1.5;
}

.stories-carousel-wrap {
    position: relative;
    overflow: hidden;
    padding-left: var(--story-edge-gap);
}

.stories-scroll {
    display: flex;
    gap: var(--story-gap);
    width: calc(100% - var(--story-edge-gap));
    padding: 0 0 8px 0;
    overflow: visible;
    transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
}

.story-card {
    position: relative;
    flex: 0 0 var(--story-card-width);
    border: 1px solid #d8deeb;
    border-radius: 34px;
    background: #fff;
    padding: 10px 10px 20px;
    box-shadow: 0 6px 18px rgba(18, 31, 60, 0.05);
}

.story-card-media {
    border-radius: 28px;
    overflow: hidden;
}

.story-card-media img {
    display: block;
    width: 100%;
    height: 280px;
    object-fit: cover;
}

.story-card-body {
    position: relative;
    padding: 16px 10px 4px;
    text-align: left;
}

.story-card-logo {
    height: 56px;
    display: flex;
    align-items: center;
}

.story-card-logo img {
    display: block;
    max-width: 118px;
    max-height: 46px;
    width: auto;
    height: auto;
    object-fit: contain;
}

.story-card h3 {
    margin: 0 0 14px;
    color: #101827;
    font-size: 26px;
    font-weight: 900;
    line-height: 1.05;
}

.story-card-copy {
    margin: 8px 0 0;
    color: #303645;
    font-size: 14px;
    line-height: 1.6;
    letter-spacing: -0.01em;
}

.story-card-link {
    display: inline-block;
    margin-top: 10px;
    color: #2450f4;
    font-size: 14px;
    font-weight: 800;
    text-decoration: underline;
}

.story-card-stats {
    margin-top: 18px;
}

.story-card-stats p {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 0 0 10px;
}

.story-card-stats strong {
    color: #2450f4;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.04em;
}

.story-card-stats span {
    color: #686d79;
    font-size: 11px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: 0.01em;
}

.story-card-next {
    position: absolute;
    top: 50%;
    right: calc(var(--story-right-peek) - 22px);
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    transform: translateY(-50%);
    z-index: 6;
}

.story-card-next img {
    display: block;
    width: 100%;
    height: 100%;
}

.story-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: calc(100% - var(--story-edge-gap) - var(--story-right-peek));
    margin: 14px 0 0 var(--story-edge-gap);
}

.story-dots button {
    width: 12px;
    height: 12px;
    padding: 0;
    border: 1.5px solid #111827;
    border-radius: 50%;
    background: #fff;
}

.story-dots button.active {
    background: #111827;
}

.amazon-ai-section {
    background: #fff;
    padding: 8px 20px 52px;
}

.amazon-ai-card {
    padding: 18px 0 28px;
    background: #fff;
}

.amazon-ai-hero {
    display: block;
    width: 100%;
    margin: 0 auto 24px;
    border-radius: 12px;
}

.amazon-ai-card h2 {
    margin: 0 0 16px;
    color: #202632;
    font-size: 26px;
    font-weight: 900;
    line-height: 1.28;
    letter-spacing: -0.03em;
}

.amazon-ai-card > p {
    margin: 0 0 26px;
    color: #303645;
    font-size: 14px;
    line-height: 1.65;
}

.amazon-ai-points {
    text-align: left;
}

.amazon-ai-points p {
    margin: 0 0 14px;
    color: #202632;
    font-size: 14px;
    line-height: 1.45;
}

.ecommerce-section {
    background: #fff;
    padding: 38px 20px 22px;
    text-align: center;
}

.ecommerce-section h2 {
    margin: 0 auto 22px;
    color: #303238;
    font-size: 27px;
    font-weight: 950;
    line-height: 1.25;
    letter-spacing: -0.045em;
}

.ecommerce-card-list {
    display: grid;
    gap: 20px;
}

.ecommerce-service-card {
    position: relative;
    min-height: 214px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 22px 18px 20px;
    border-radius: 17px;
    background: #eef3fb;
    overflow: hidden;
    text-align: left;
}

.ecommerce-service-top,
.ecommerce-service-bottom {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
}

.ecommerce-service-top h3 {
    flex: 1 1 auto;
}

.ecommerce-service-bottom p {
    flex: 1 1 auto;
}

.ecommerce-service-card h3 {
    margin: 0;
    color: #252934;
    font-size: 23px;
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.04em;
}

.ecommerce-service-card p {
    margin: 0;
    color: #3d4351;
    font-size: 13.5px;
    line-height: 1.7;
    letter-spacing: -0.01em;
}

.ecommerce-service-bottom > img {
    width: min(35vw, 148px);
    max-width: 148px;
    min-width: 112px;
    max-height: 152px;
    object-fit: contain;
    flex: 0 0 auto;
    align-self: center;
    user-select: none;
}

.ecommerce-service-card button {
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    border: 0;
    background: transparent;
    padding: 0;
}

.ecommerce-service-card button img {
    display: block;
    width: 100%;
    height: 100%;
}

.channel-section {
    background: #eef3fb;
    padding: 44px 0 50px;
    text-align: center;
    overflow: hidden;
}

.channel-section h2 {
    margin: 0 0 34px;
    color: #3a3c42;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.22;
    letter-spacing: -0.04em;
}

.channel-carousel {
    position: relative;
    overflow: hidden;
    width: 100%;
}

.channel-carousel::before,
.channel-carousel::after {
    content: "";
    position: absolute;
    top: 0;
    width: 44px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

.channel-carousel::before {
    left: 0;
    background: linear-gradient(90deg, #eef3fb 0%, rgba(238, 243, 251, 0) 100%);
}

.channel-carousel::after {
    right: 0;
    background: linear-gradient(
        270deg,
        #eef3fb 0%,
        rgba(238, 243, 251, 0) 100%
    );
}

.channel-track {
    display: flex;
    align-items: flex-start;
    gap: 34px;
    width: max-content;
    padding: 0 28px;
    animation: channelLogoMarquee 18s linear infinite;
    will-change: transform;
}

.channel-item {
    flex: 0 0 78px;
    text-align: center;
}

.channel-item span {
    width: 69px;
    height: 69px;
    margin: 0 auto 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}

.channel-item img {
    display: block;
    max-width: 69px;
    max-height: 69px;
    object-fit: contain;
}

.channel-item p {
    margin: 0;
    color: #3b3e46;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
}

@keyframes channelLogoMarquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(calc(-50% - 17px));
    }
}

.pricing-section {
    background: #eef3fb;
    /*padding: 38px 20px 76px;*/
    padding: 38px 20px 1px;
    text-align: center;
}

.pricing-card {
    max-width: 390px;
    margin: 0 auto;
}

.pricing-card h2 {
    margin: 0 0 16px;
    color: #252934;
    font-size: 27px;
    font-weight: 850;
    line-height: 1.2;
    letter-spacing: -0.035em;
}

.pricing-subtitle {
    max-width: 330px;
    margin: 0 auto 34px;
    color: #202632;
    font-size: 15px;
    line-height: 1.35;
    letter-spacing: -0.01em;
}

.pricing-control {
    margin: 0 auto 28px;
    text-align: left;
}

.pricing-control-head {
    display: grid;
    grid-template-columns: 1fr 126px;
    gap: 12px;
    align-items: center;
    margin-bottom: 22px;
}

.pricing-control label {
    color: #252934;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: -0.025em;
}

.pricing-control input[type="number"] {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 1px solid #ccd2df;
    border-radius: 13px;
    background: #f6f7fb;
    color: #111827;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
    outline: none;
}

.pricing-range {
    display: block;
    width: 100%;
    height: 6px;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    border-radius: 99px;
    background: linear-gradient(
        90deg,
        #2450f4 0%,
        #2450f4 var(--range-fill, 0%),
        #e7ebf3 var(--range-fill, 0%),
        #e7ebf3 100%
    );
    outline: none;
    cursor: pointer;
    touch-action: pan-y;
}

.pricing-range::-webkit-slider-thumb {
    width: 21px;
    height: 21px;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    border-radius: 50%;
    background: #2450f4;
    box-shadow: 0 2px 7px rgba(36, 80, 244, 0.28);
    cursor: pointer;
}

.pricing-range::-moz-range-thumb {
    width: 21px;
    height: 21px;
    border: 0;
    border-radius: 50%;
    background: #2450f4;
    box-shadow: 0 2px 7px rgba(36, 80, 244, 0.28);
    cursor: pointer;
}

.pricing-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: 34px 0 82px;
    text-align: left;
}

.pricing-results span {
    display: block;
    margin-bottom: 6px;
    color: #202632;
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.03em;
}

.pricing-results strong {
    display: block;
    color: #202632;
    font-size: 27px;
    font-weight: 950;
    line-height: 1;
    letter-spacing: -0.04em;
}

.pricing-chart-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    align-items: center;
    gap: 22px;
    margin-bottom: 24px;
}

.pricing-donut-wrap {
    position: relative;
    width: 184px;
    height: 184px;
    margin: 0 auto;
}

.pricing-echart {
    width: 184px;
    height: 184px;
}

.pricing-donut-core {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 78px;
    height: 78px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #eef3fb;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.pricing-donut-core img {
    width: 48px;
    height: 48px;
    display: block;
    padding: 10px;
    border-radius: 50%;
    background: #fff;
    object-fit: contain;
}

.pricing-legend {
    text-align: left;
}

.pricing-legend p {
    position: relative;
    margin: 0 0 18px;
    padding-left: 25px;
    color: #202632;
    font-size: 19px;
    font-weight: 750;
    line-height: 1.28;
}

.pricing-legend .dot {
    position: absolute;
    left: 0;
    top: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.dot-blue {
    background: #2450f4;
}

.dot-red {
    background: #ef2554;
}

.dot-gray {
    background: #d9d9de;
}

.stellar-section {
    background: #eef3fb;
    /*padding: 38px 32px 44px;*/
    padding: 8px 32px 44px;
    color: #333741;
}

.stellar-visual {
    position: relative;
    min-height: 260px;
    margin: 0 auto 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stellar-visual__image {
    display: block;
    width: min(100%, 360px);
    height: auto;
    object-fit: contain;
}

.stellar-copy h2 {
    margin: 0 0 20px;
    color: #333741;
    font-size: 26px;
    line-height: 1.18;
    font-weight: 950;
    font-style: italic;
    letter-spacing: -0.035em;
}

.stellar-copy h2 span {
    color: #86eccf;
    font-style: normal;
}

.stellar-copy p,
.stellar-means p {
    margin: 0 0 20px;
    color: #3d414c;
    font-size: 16px;
    line-height: 1.72;
}

.stellar-copy strong {
    color: #1d2431;
    font-weight: 900;
}

.stellar-means {
    margin-top: 30px;
}

.stellar-means > strong {
    display: block;
    margin-bottom: 8px;
}

.stellar-means p {
    margin-bottom: 8px;
}

.clutch-section {
    background: #fff;
    padding: 48px 20px 0;
}

.clutch-heading {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 16px;
    margin-bottom: 32px;
}

.clutch-heading h2 {
    margin: 0;
    color: #0f172a;
    font-size: 20px;
    line-height: 1.18;
    font-weight: 850;
}

.clutch-wordmark-img {
    display: block;
    width: 130px;
    max-width: 38vw;
    height: auto;
    object-fit: contain;
}

.clutch-panel {
    padding: 28px 24px 20px;
    border-radius: 9px;
    background: #fafafa;
    box-shadow: 0 4px 24px rgba(10, 21, 46, 0.1);
}

.clutch-summary h3 {
    margin: 0 0 4px;
    color: #0f2a3d;
    font-size: 24px;
    font-weight: 500;
}

.clutch-summary p {
    margin: 0;
    color: #0f2a3d;
    font-size: 16px;
}

.clutch-summary p strong {
    font-size: 20px;
    font-weight: 500;
}

.stars,
.review-stars span {
    color: #e92817;
    letter-spacing: 1px;
}

.clutch-summary small {
    color: #1d76a8;
    font-size: 10px;
}

.powered {
    display: block;
    margin-top: 4px;
    color: #132a38;
    font-size: 8px;
}

.review-carousel {
    position: relative;
    margin-top: 20px;
}

.review-window {
    overflow: hidden;
    margin: 0 30px;
}

.review-track {
    display: flex;
    transition: transform 0.36s ease;
}

.review-card {
    flex: 0 0 100%;
    min-width: 100%;
    padding: 24px 20px 18px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 hsla(0, 0%, 9%, 0.102);
}

.review-stars {
    display: flex;
    gap: 12px;
    align-items: center;
    color: #153245;
    font-size: 19px;
}

.review-text {
    min-height: 64px;
    margin: 22px 0 18px;
    color: #173245;
    font-size: 14px;
    line-height: 1.45;
}

.review-author {
    margin: 0 0 34px;
    color: #59636b;
    font-size: 11px;
}

.verified {
    margin: 0;
    color: #5d6a70;
    font-size: 12px;
}

.review-nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 28px;
    height: 54px;
    border: 0;
    background: transparent;
    color: #153245;
    font-size: 54px;
    font-weight: 200;
    line-height: 1;
    transform: translateY(-50%);
}

.review-nav--left {
    left: -4px;
}

.review-nav--right {
    right: -4px;
}

.black-framework {
    margin: 0 -20px;
    padding: 96px 22px 88px;
    background: #1c1c1b;
    color: #fff;
    text-align: center;
}

.black-framework h2 {
    margin: 0 auto 18px;
    font-size: 21px;
    font-weight: 950;
    line-height: 1.35;
}

.black-framework p {
    max-width: 320px;
    margin: 0 auto 58px;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.35;
}

.algofy-footer-dark {
    padding: 48px 22px 68px;
    background: #1b1b1b;
    color: #fff;
    text-align: left;
}

.algofy-footer-dark h2 {
    margin: 0 0 28px;
    color: #fff;
    font-size: 52px;
    line-height: 0.9;
    font-weight: 900;
    letter-spacing: 0.02em;
}

.algofy-footer-dark p {
    max-width: 280px;
    margin: 0 0 30px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 19px;
    line-height: 1.35;
}

.footer-mail {
    display: inline-block;
    margin-bottom: 26px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 16px;
    text-decoration: none;
}

.footer-social {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-bottom: 34px;
}

.footer-social svg {
    width: 42px;
    height: 42px;
    display: block;
}

.footer-partner-strip {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    min-height: 80px;
    padding: 14px 16px;
    border-radius: 18px;
    background: #cbd5df;
    align-items: center;
}

.footer-partner-strip img {
    display: block;
    width: 100%;
    max-height: 34px;
    object-fit: contain;
}

@media (max-width: 360px) {
    .algofy-hero h1 {
        font-size: 29px;
    }

    .eyebrow {
        font-size: 13px;
    }

    .floating-brand {
        transform: scale(0.9);
    }

    .brand-algofy,
    .brand-motion {
        transform: translateX(-50%) scale(0.9);
    }
}
</style>
