<template>
    <van-popup
        v-model:show="dialogVisible"
        class="auth-language-popup"
        transition="auth-language-pop"
        :overlay="true"
        :close-on-click-overlay="true"
        :overlay-style="{ background: 'transparent' }"
        :style="{ background: 'transparent' }"
    >
        <div class="auth-language-menu">
            <button
                v-for="item in LANGS_OBJ"
                :key="item.value"
                type="button"
                class="auth-language-menu__item"
                :class="{
                    'auth-language-menu__item--active': item.value === locale,
                }"
                @click="handleChangeLang(item.value)"
            >
                <img
                    v-if="item.icon"
                    class="auth-language-flag"
                    :src="item.icon"
                    alt=""
                    aria-hidden="true"
                />
                <span
                    v-else
                    class="auth-language-flag auth-language-flag--fallback"
                    :class="`auth-language-flag--${item.value}`"
                    aria-hidden="true"
                ></span>
                <span class="auth-language-menu__name">{{ item.text }}</span>
                <span
                    v-if="item.value === locale"
                    class="auth-language-menu__check"
                    >&#10003;</span
                >
            </button>
        </div>
    </van-popup>
</template>

<script setup>
import { computed, ref } from "vue";
import { LANGS } from "@/config/lang";
import { LANG_ICONS } from "@/config/langIcons";
import { useCommonStore } from "../store/modules/common";
import { useI18n } from "vue-i18n";
import { useLocale } from "../util/useLocale";

const { locale } = useI18n();
const dialogVisible = ref(false);
const commonStore = useCommonStore();
const { setLocale } = useLocale();
const AUTH_VISIBLE_LANG_CODES = ["en", "th", "ko"];

const LANGS_OBJ = computed(() =>
    AUTH_VISIBLE_LANG_CODES.map((code) => LANGS[code])
        .filter(Boolean)
        .map((item) => ({
            text: item.name,
            value: item.code,
            icon: LANG_ICONS[item.code],
        })),
);

const open = () => {
    dialogVisible.value = !dialogVisible.value;
};

const close = () => {
    dialogVisible.value = false;
};

function handleChangeLang(code) {
    if (!code) return;
    commonStore.updateLang(code);
    locale.value = code;
    setLocale(code);
    close();
}

defineExpose({
    open,
    close,
});
</script>

<style scoped>
:global(.auth-language-popup) {
    left: auto !important;
    right: 24px !important;
    top: 68px !important;
    width: min(170px, calc(100vw - 48px)) !important;
    max-height: 64vh;
    overflow: visible;
    border-radius: 22px !important;
    box-shadow: 0 16px 34px rgba(29, 80, 46, 0.14);
    transform: none !important;
}

@media (min-width: 768px) {
    :global(.auth-language-popup) {
        right: calc(
            (100vw - var(--app-pc-max-width, 375px)) / 2 + 24px
        ) !important;
        width: min(
            170px,
            calc(var(--app-pc-max-width, 375px) - 48px)
        ) !important;
    }
}

.auth-language-menu {
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid rgba(37, 152, 76, 0.14);
    background: #ffffff;
}

.auth-language-menu__item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 58px;
    padding: 0 22px;
    border: 0;
    border-bottom: 1px solid #dbeee1;
    background: #ffffff;
    color: #1c2c21;
    text-align: left;
}

.auth-language-menu__item:last-child {
    border-bottom: 0;
}

.auth-language-menu__item--active {
    background: #eef8f1;
    color: #239b4d;
    font-weight: 700;
}

.auth-language-flag {
    width: 22px;
    height: 15px;
    margin-right: 18px;
    border-radius: 2px;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba(20, 80, 36, 0.08);
    flex: 0 0 22px;
}

.auth-language-flag--fallback {
    position: relative;
    overflow: hidden;
    object-fit: initial;
}

.auth-language-flag--en {
    background:
        linear-gradient(90deg, #24478f 0 42%, transparent 42%),
        repeating-linear-gradient(180deg, #c53b4d 0 2px, #ffffff 2px 4px);
}

.auth-language-flag--zh {
    background: linear-gradient(135deg, #d8232a 0%, #b91218 100%);
}

.auth-language-flag--zh::before,
.auth-language-flag--id::before,
.auth-language-flag--th::before,
.auth-language-flag--ko::before {
    content: "";
    position: absolute;
    inset: 0;
}

.auth-language-flag--zh::before {
    width: 4px;
    height: 4px;
    left: 4px;
    top: 3px;
    border-radius: 50%;
    background: #ffd24a;
    box-shadow:
        6px 2px 0 -2px #ffd24a,
        9px 6px 0 -2px #ffd24a;
}

.auth-language-flag--id {
    background: linear-gradient(180deg, #d4212f 0 50%, #ffffff 50% 100%);
}

.auth-language-flag--th {
    background: linear-gradient(
        180deg,
        #d4212f 0 16%,
        #ffffff 16% 30%,
        #273a89 30% 70%,
        #ffffff 70% 84%,
        #d4212f 84% 100%
    );
}

.auth-language-flag--ko {
    background: #ffffff;
}

.auth-language-flag--ko::before {
    width: 8px;
    height: 8px;
    left: 7px;
    top: 4px;
    border-radius: 50%;
    background: linear-gradient(180deg, #d83b3b 0 50%, #2462b8 50% 100%);
}

.auth-language-menu__name {
    flex: 1;
    font-size: 14px;
    line-height: 1;
}

.auth-language-menu__check {
    color: #239b4d;
    font-size: 18px;
}

:global(.auth-language-pop-enter-active),
:global(.auth-language-pop-leave-active) {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease !important;
}

:global(.auth-language-pop-enter-from),
:global(.auth-language-pop-leave-to) {
    opacity: 0;
    transform: translate3d(0, -8px, 0) scale(0.98) !important;
}

:global(.auth-language-pop-enter-to),
:global(.auth-language-pop-leave-from) {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) !important;
}
</style>
