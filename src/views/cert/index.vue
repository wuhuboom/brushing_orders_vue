<template>
    <div class="cert-page">
        <PageTopBar
            :title="$t('certificate')"
            show-back
            @click-left="onClickLeft"
        />

        <div class="cert-body">
            <section class="cert-hero">
                <div class="cert-hero__head">
                    <div class="cert-hero__icon">
                        <img src="@/static/images/cert1.png" />
                    </div>

                    <div class="cert-hero__content">
                        <div class="cert-hero__title">
                            {{ $t("our_certifications") }}
                        </div>
                        <div class="cert-hero__desc">
                            {{ $t("certifications_desc") }}
                        </div>
                    </div>
                </div>

                <span class="cert-hero__orb"></span>

                <div class="cert-stats">
                    <div class="cert-stat">
                        <strong> 1+ </strong>
                        <span>{{ $t("licenses") }}</span>
                    </div>
                    <div class="cert-stat">
                        <strong>3+ </strong>
                        <span>{{ $t("years_operating") }}</span>
                    </div>
                    <div class="cert-stat">
                        <strong>40+ </strong>
                        <span>{{ $t("countries") }}</span>
                    </div>
                </div>
            </section>

            <section class="cert-overview">
                <div class="cert-section-title">
                    {{ $t("trust_safety_overview") }}
                </div>

                <div class="cert-overview-grid">
                    <div class="cert-overview-card">
                        <div class="cert-overview-card__icon is-green">
                            <img src="@/static/images/cert2.png" />
                        </div>
                        <div class="cert-overview-card__text">
                            {{ $t("secure_platform") }}
                        </div>
                    </div>

                    <div class="cert-overview-card">
                        <div class="cert-overview-card__icon is-blue">
                            <img src="@/static/images/cert3.png" />
                        </div>
                        <div class="cert-overview-card__text">
                            {{ $t("verified_documents") }}
                        </div>
                    </div>

                    <div class="cert-overview-card">
                        <div class="cert-overview-card__icon is-orange">
                            <img src="@/static/images/cert4.png" />
                        </div>
                        <div class="cert-overview-card__text">
                            {{ $t("compliance_records") }}
                        </div>
                    </div>
                </div>
            </section>

            <section class="cert-content-card">
                <div class="cert-section-title">{{ $t("certificates") }}</div>
                <div class="cert-content rich-content">
                    <img src="@/static/images/certprod2.png" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getConfigByLang } from "../../api/apis";
import { useCommonStore } from "@/store/modules/common";

const certificateEn = ref("");
const commonStore = useCommonStore();

const parLang = computed(() => {
    const mapped = commonStore.getValueByKey(commonStore.lang);
    return mapped ?? commonStore.lang;
});

// const certStats = computed(() => {
//     const html = certificateEn.value || "";
//     const imageCount = (html.match(/<img/gi) || []).length;
//     const sectionCount = (html.match(/<(h1|h2|h3)/gi) || []).length;

//     return {
//         documents: Math.max(sectionCount || imageCount, 1),
//         images: Math.max(imageCount, 1),
//         sections: Math.max(sectionCount, 1),
//     };
// });

// const getGetGlobalConfig = async () => {
//     const res = await getConfigByLang({ lang: "en" });
//     certificateEn.value = res?.data?.certificate ?? "";
// };

// onMounted(() => {
//     getGetGlobalConfig();
// });

const onClickLeft = () => history.back();
</script>

<style scoped>
.cert-page {
    min-height: 100vh;
    background: #edf4ef;
}

.cert-body {
    padding: 78px 16px 28px;
}

.cert-hero {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    background: linear-gradient(135deg, #23984b 0%, #218643 100%);
    color: #fff;
    padding: 18px 16px 20px;
    box-shadow: 0 16px 30px rgba(31, 130, 66, 0.16);
}

.cert-hero__head {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
}

.cert-hero__icon {
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
}

.cert-hero__icon img {
    width: 26px;
    height: 26px;
    display: block;
    object-fit: contain;
}

.cert-hero__content {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    margin-left: 12px;
    margin-top: 0;
}

.cert-hero__title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
}

.cert-hero__desc {
    margin-top: 8px;
    font-size: 12px;
    /*line-height: 26px;*/
    color: rgba(255, 255, 255, 0.92);
}

.cert-hero__orb {
    position: absolute;
    top: -20px;
    right: -18px;
    width: 116px;
    height: 116px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
}

.cert-stats {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
}

.cert-stat {
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.13);
    text-align: center;
    padding: 12px 8px;
}

.cert-stat strong {
    display: block;
    font-size: 16px;
    line-height: 26px;
}

.cert-stat span {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    line-height: 18px;
}

.cert-overview,
.cert-content-card {
    margin-top: 16px;
}

.cert-section-title {
    margin-bottom: 20px;
    color: #1e291f;
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
}

.cert-overview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.cert-overview-card {
    border-radius: 18px;
    border: 1px solid #d7e9da;
    background: #fff;
    padding: 16px 6px 14px;
    text-align: center;
    box-shadow: 0 10px 24px rgba(26, 77, 42, 0.05);
}

.cert-overview-card__icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    font-size: 20px;
}

.cert-overview-card__icon.is-green {
    background: #e9f7ec;
    color: #2ca24d;
}

.cert-overview-card__icon.is-blue {
    background: #ebf1ff;
    color: #3d84f3;
}

.cert-overview-card__icon.is-orange {
    background: #fff1df;
    color: #e4a243;
}

.cert-overview-card__text {
    color: #293328;
    font-size: 11px;
    line-height: 20px;
    white-space: nowrap;
}

.cert-content-card {
    border-radius: 20px;
    /*border: 1px solid #d7e9da;*/
    background: transparent;
}

.cert-content {
    border-radius: 20px;
    background: transparent;
}

.rich-content :deep(*) {
    box-sizing: border-box;
}

.rich-content :deep(p) {
    margin: 0 0 12px;
    color: #607861;
    font-size: 13px;
    line-height: 24px;
}

.rich-content :deep(img) {
    /*display: block;
    width: 100%;
    height: auto;
    border-radius: 0;
    border: 4px solid #b98310;
    background: #fff;
    box-shadow: 0 12px 28px rgba(25, 78, 43, 0.08);*/

    display: block;
    max-width: 100%;
    width: auto;
    height: auto;
    margin: 0 auto;
    border-radius: 0;
    border: 4px solid #b98310;
    background: #fff;
    box-shadow: 0 12px 28px rgba(25, 78, 43, 0.08);
}

.rich-content :deep(figure),
.rich-content :deep(table) {
    margin: 0;
}

.rich-content :deep(table) {
    width: 100%;
}

.rich-content :deep(td),
.rich-content :deep(th) {
    padding: 0;
}

.cert-content-card :deep(.cert-section-title) {
    /*padding: 16px 16px 0;*/
}

.cert-content-card .rich-content {
    padding: 0 16px 16px;
}

:deep(.cert-nav .van-nav-bar) {
    background: #fff;
}

:deep(.cert-nav .van-nav-bar__title) {
    color: #1f2a1f;
    font-size: 18px;
    font-weight: 500;
}

:deep(.cert-nav .van-icon-arrow-left) {
    color: #28a14d;
    font-size: 22px;
}
</style>
