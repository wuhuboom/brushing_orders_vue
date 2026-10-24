<template>
  <main class="das-page language-page">
    <DasPageHeader title-key="das.page.language" />
    <section class="language-body">
      <button
        v-for="item in visibleLanguages"
        :key="item.code"
        :class="{ active: selected === item.code }"
        @click="selected = item.code"
      >
        <span class="language-option">
          <img
            :src="
              item.code === 'it'
                ? '/worldofgood/flag-it.svg'
                : `/psybir/flag-${item.code}.png`
            "
            alt=""
          />
          <span>{{ item.name }}</span>
        </span>
        <img
          v-if="selected === item.code"
          class="language-option__check"
          src="/psybir/language-checked.png"
          alt=""
        />
        <span
          v-else
          class="language-option__unchecked"
          aria-hidden="true"
        ></span></button
      ><button class="confirm" @click="confirm">
        {{ $t("das.common.confirm") }}
      </button>
    </section>
    <p class="das-page-copyright">{{ $t("das.common.copyright") }}</p>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { LANGS } from "@/config/lang";
import { useCommonStore } from "@/store/modules/common";
import { useLocale } from "@/util/useLocale";
import DasPageHeader from "@/components/DasPageHeader.vue";
import { safeBack } from "@/utils/navigation";
const commonStore = useCommonStore(),
  router = useRouter(),
  { locale } = useI18n(),
  { setLocale } = useLocale(),
  selected = ref(commonStore.clientLang || "en"),
  visibleLanguages = LANGS,
  confirm = () => {
    commonStore.updateLang(selected.value);
    locale.value = selected.value;
    setLocale(selected.value);
    safeBack(router, "/my");
  };
</script>
