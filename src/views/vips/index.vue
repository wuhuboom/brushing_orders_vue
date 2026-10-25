<template>
  <DmkPcLayout>
    <div class="dmk-site-scope">
      <div class="w-full mx-auto pt-5 pb-10 px-4 dmk-vip-scope">
        <div class="w-full text-white">
          <div
            class="hidden bg-white py-10 text-black mt-8 lg:block"
          >
            <div
              class="text-4xl w-full max-w-[1200px] flex justify-between items-start pb-10 mx-auto"
            >
              <span class="uppercase">{{ $t("das.dmk.vipLevels") }}</span>
              <img
                src="/dmk/assets/vipimage42.png"
                alt=""
              />
            </div>
            <div
              class="vip-pc-grid w-full max-w-[1200px] mx-auto"
            >
              <div
                v-for="(item, index) in displayLevels"
                :key="item.id || item.level || index"
                class="vip-pc-card text-black border-t-[2px] border-[var(--main-color)] p-4"
                :class="{
                  'vip-pc-card--current': isCurrent(item),
                  'vip-pc-card--inactive': hasCurrentLevel && !isCurrent(item),
                }"
              >
                <div
                  class="w-full py-4 flex justify-between items-center"
                >
                  <span class="text-xl">{{
                    item.name || `VIP${item.level || index + 1}`
                  }}</span>
                  <img
                    :src="levelIcon(item, index)"
                    class="w-12"
                    alt=""
                  />
                </div>
                <div class="text-base">
                  <p
                    v-for="(line, lineIndex) in item.descriptionLines"
                    :key="`${item.id || index}-pc-description-${lineIndex}`"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DmkPcLayout>

  <DmkH5Layout class="dmk-mobile-current">
    <div class="w-full mx-auto pt-5 pb-10 px-4 dmk-vip-scope">
      <div class="w-full text-white">
        <div
          class="uppercase text-3xl w-full max-w-[1200px] mx-auto"
        >
          {{ $t("das.dmk.vipLevels") }}
        </div>
        <div class="mt-4">
          <img
            src="/dmk/assets/vipimage42.png"
            class="mx-auto"
            alt=""
          />
          <div
            v-for="(item, index) in displayLevels"
            :key="item.id || item.level || index"
            class="w-full flex flex-col justify-end"
          >
            <div
              class="w-full mt-5 min-h-[280px] border-t-[2px] border-[var(--main-color)] p-4 text-white"
            >
              <div
                class="w-full py-4 flex justify-start items-center"
              >
                <img
                  :src="levelIcon(item, index)"
                  class="w-12 object-contain"
                  alt=""
                />
                <span class="text-xl ml-4">{{
                  item.name || `VIP${item.level || index + 1}`
                }}</span>
              </div>
              <div class="text-base">
                <p
                  v-for="(line, lineIndex) in item.descriptionLines"
                  :key="`${item.id || index}-h5-description-${lineIndex}`"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DmkH5Layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getLevel, userGetInfo } from "@/api/apis";
import DmkPcLayout from "@/components/dmkPc/DmkPcLayout.vue";
import DmkH5Layout from "@/components/dmkH5/DmkH5Layout.vue";
import {
  getMemberLevelDescriptionLines,
  getMemberLevelMetrics,
} from "@/utils/memberLevel";

const levels = ref([]);
const user = ref({});
const base = window.g?.VITE_API_IMG_URL || "";
const displayLevels = computed(() =>
  [...levels.value]
    .sort(
      (left, right) =>
        Number(left.level ?? left.id) - Number(right.level ?? right.id),
    )
    .map((level) => ({
      ...level,
      metrics: getMemberLevelMetrics(level),
      descriptionLines: getMemberLevelDescriptionLines(level.description),
    })),
);
const levelColors = ["#e9792b", "#65a6d3", "#e4b500", "#e72d60", "#7032cf"];

const currentLevelKey = computed(() => {
  const value =
    user.value.levelId ??
    user.value.vipId ??
    user.value.userLevel?.id ??
    user.value.userLevel?.level ??
    user.value.memberLevel?.id ??
    user.value.memberLevel?.level;

  return value === undefined || value === null || value === ""
    ? ""
    : String(value);
});

const hasCurrentLevel = computed(() => currentLevelKey.value !== "");

const isCurrent = (item) =>
  currentLevelKey.value !== "" &&
  currentLevelKey.value ===
    String(item.id ?? item.levelId ?? item.level ?? "");
const image = (value) => {
  const path = String(value || "").trim();
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  return `${String(base).replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
const medal = (color) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 78"><path fill="${color}" d="M16 45 12 76l20-11 20 11-4-31z"/><circle cx="32" cy="31" r="25" fill="${color}"/><circle cx="32" cy="31" r="19" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/><path fill="#fff" d="m32 18 4 8 9 1-6 7 2 9-9-5-9 5 2-9-6-7 9-1z"/></svg>`)}`;
const levelIcon = (item, index) => {
  const icon = item.icon || item.iconUrl || item.image || item.imageUrl;
  return icon ? image(icon) : medal(levelColors[index % levelColors.length]);
};
onMounted(async () => {
  try {
    levels.value = (await getLevel()).data || [];
  } catch (_) {}
  try {
    user.value = (await userGetInfo()).data || {};
  } catch (_) {}
});
</script>

<style scoped>
.vip-pc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 96px;
  row-gap: 52px;
  align-items: start;
}
.vip-pc-card {
  width: 100%;
  min-width: 0;
  transition: margin-top 0.25s ease;
}
.vip-pc-card--current {
  position: relative;
  z-index: 1;
}
.vip-pc-card--inactive {
  margin-top: 56px;
}
.vip-pc-card > div:first-child img {
  width: 48px;
  height: 34px;
  object-fit: contain;
}
.vip-page {
  min-height: 100%;
  background: #f7f5ec;
  color: #17382d;
}
.vip-list {
  max-width: 800px;
  margin: auto;
  padding: 22px 24px 4px;
  display: grid;
  gap: 14px;
}
.vip-card {
  min-height: 204px;
  padding: 28px 24px;
  position: relative;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 20px;
  border-radius: 22px;
  background: #fff;
}
.vip-card > img {
  width: 54px;
  height: 66px;
  object-fit: contain;
}
.vip-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
}
.vip-card strong {
  font-size: 16px;
}
.vip-description {
  margin: 16px 0 0;
  color: #87908a;
  font-size: 14px;
  line-height: 1.7;
}
.vip-description p {
  margin: 0;
}
.current-badge {
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 18px;
  border-radius: 0 21px 0 18px;
  background: #14392c;
  color: #f7f5ec;
  font-size: 11px;
}
.das-page-copyright {
  margin-top: 12px;
}
@media (min-width: 760px) {
  .vip-list {
    grid-template-columns: 1fr 1fr;
  }
  .vip-card {
    min-height: 235px;
  }
  .vip-card:last-child:nth-child(odd) {
    grid-column: 1/-1;
  }
}
</style>
