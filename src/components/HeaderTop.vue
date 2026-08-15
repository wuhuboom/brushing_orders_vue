<template>
  <header class="das-header">
    <button
      class="das-brand"
      type="button"
      aria-label="DAS home"
      @click="safeReplace(router, '/')"
    >
      <img src="@/static/das/wordmark-cream.png" alt="DAS" />
    </button>
    <div class="das-header__actions">
      <button class="das-contact" type="button" @click="customer">
        {{ $t("das.nav.contact") }}
      </button>
      <button class="das-avatar" type="button" @click="safePush(router, '/my')">
        {{ initials }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { safePush, safeReplace } from "@/utils/navigation";

const router = useRouter();
const userStore = useUserStore();
const initials = computed(() => {
  const name = userStore.userInfo?.username || "DL";
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
const customer = () => safePush(router, "/contact");
</script>

<style scoped>
.das-header {
  width: 100%;
  height: 88px;
  padding: 26px 26px 14px 30px;
  display: flex;
  align-items: center;
  background: #14392c;
  color: #f7f5ec;
  position: relative;
  z-index: 20;
}
.das-brand {
  width: 34px;
  height: 42px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.das-brand img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.das-header__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.das-contact {
  min-width: 112px;
  height: 40px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: #f7f5ec;
  color: #17382d;
  font-size: 13px;
  font-weight: 700;
}
.das-avatar {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(247, 245, 236, 0.65);
  border-radius: 50%;
  background: transparent;
  color: #f7f5ec;
  font-size: 13px;
  font-weight: 700;
}
@media (min-width: 600px) {
  .das-header {
    padding-left: 34px;
    padding-right: 34px;
  }
}
</style>
