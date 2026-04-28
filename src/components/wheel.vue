<template>
  <div>
    <van-popup
      v-model:show="show"
      :style="{ width: '80%', background: 'transparent' }"
    >
      <img src="@/static/images/lucky.png" class="w-full pb-[13px]" alt="" />

      <!-- 静止转盘 -->
      <div class="wheel">
        <img src="@/static/images/wheel.png" alt="wheel" class="wheel-img" />

        <!-- 动态文字 -->
        <div
          v-for="(item, index) in prizes"
          :key="index"
          class="wheel-text"
          :style="getTextStyle(index)"
        >
          {{ item }}{{ symbol }}
        </div>
      </div>

      <!-- Start按钮 -->
      <div
        ref="startBtn"
        class="w-[63px] h-[63px] pointer-start"
        @click="startDraw"
      >
        {{$t('start')}}
        <!-- 箭头 -->
        <img
          src="@/static/images/pointer.png"
          class="pointer-img"
          :style="pointerStyle"
        />
      </div>

      <div class="text-[#F7F7F7] text-center text-[16px] py-[15px]">
        {{ $t('only_one_draw_per_day') }}
      </div>
      <img
        src="@/static/images/close1.png"
        @click="close1"
        class="w-[26px] h-[26px] mx-auto"
        alt=""
      />
    </van-popup>

    <van-popup
      v-model:show="showLucky"
      round
      :style="{
        width: '80%',
        background: 'linear-gradient(180deg, #FEE1DC 0%, #FFFFFF 100%)',
      }"
    >
      <div
        class="py-[24px] px-[18px] flex flex-col items-center justify-center w-full"
      >
        <div
          class="text-[14px] text-[#000] pb-[20px]"
          style="text-align: center"
        >
          {{ $t("winMessage", { winPrize }) }}
        </div>
        <van-button
          color="var(--theme-primary)"
          round
          class="w-[80%] mx-auto"
          @click="closeLucky"
          >{{ $t("ok") }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { getLotteryConfig, draw } from "../api/apis";
import { errorMessages } from "../api/errorCodeMap";
import { showToast } from "@/util/message";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const show = ref(false);
const showLucky = ref(false);
const winPrize = ref("");

// 转盘文字
const prizes = ref([]);
const symbol = ref("");
const sectorAngle = ref(25);
const radius = ref(80);

// 动画status
const rotateDeg = ref(0);
const isSpinning = ref(false);
const transitionStyle = ref("");

// Start按钮ref
const startBtn = ref(null);

// 奖项列表（角度为箭头指向的角度）
// const prizeList = [
//   { label: 80, angle: 270 },
//   { label: 10, angle: 330 },
//   { label: 20, angle: 30 },
//   { label: 30, angle: 90 },
//   { label: 50, angle: 150 },
//   { label: 0, angle: 210 },
// ];
const prizeList = ref([])

// const prizeList = [
//   { label: 10, angle: 30 },
//   { label: 20, angle: 90 },
//   { label: 30, angle: 150 },
//   { label: 40, angle: 90 },
//   { label: 50, angle: 150 },
//   { label: 0, angle: 210 },
// ];


// 模拟接口
// const fakeApi = () =>
//   new Promise((resolve) =>
//     setTimeout(() => {
//       const prizes = [80, 10, 20, 30, 50, 0];
//       const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
//       resolve({ prize: randomPrize });
//     }, 500)
//   );

// 文字样式
const getTextStyle = (index) => {
  const angle = sectorAngle.value * index + sectorAngle.value / 2;
  return {
    transform: `rotate(${angle}deg) translateY(-${radius.value}px)`,
  };
};

// 箭头围绕Start按钮旋转
const radiusArrow = 50; // 箭头离按钮中心距离
const pointerStyle = computed(() => {
  return {
    position: "absolute",
    left: "27%",
    top: "31%",
    transform: `rotate(${rotateDeg.value}deg) translateY(-${radiusArrow}px)`,
    transition: transitionStyle.value,
  };
});

// 获取转盘配置
const lotteryConfig = async () => {
  try {
    const res = await getLotteryConfig();
    symbol.value = res.symbol || "";
    prizes.value = res.prizes || [];
    // if (prizes.value.length > 0) {
    //   sectorAngle.value = 360 / prizes.value.length;
    // }
    if (prizes.value.length > 0) {
      const sectorAngles = 360 / prizes.value.length;

      // 转换成带角度的 prizeList
      prizeList.value.splice(0, prizeList.length, 
        ...prizes.value.map((label, index) => ({
          label,
          angle: ( 30+ index * sectorAngles) % 360, // 从上方270°starting
        }))
      );
      sectorAngle.value = sectorAngles;
    }
  } catch (err) {
    show.value = false;
    console.log(show.value)
    console.error("获取转盘配置失败:", err);
  }
};

const startDraw = async () => {
  if (isSpinning.value) return; // 防止重复点击
  isSpinning.value = true;

  // 1️⃣ 清除上一次动画status
  transitionStyle.value = "";
  rotateDeg.value = 0;

  // 2️⃣ 等待下一帧（确保 DOM update完再加动画）
  await nextTick();

  // 3️⃣ setting旋转动画样式
  transitionStyle.value = "transform 4s cubic-bezier(0.33,1,0.68,1)";

  try {
    // 4️⃣ 调用接口（模拟请求或真实接口）
    const res = await draw(); // 你这里换成真实接口
    winPrize.value = res.data;

    // 5️⃣ 找出中奖角度
    const target = prizeList.value.find((p) => p.label === winPrize.value);
    console.log(target)
    if (!target) {
      showToast(t("no_matching_award_found"));
      isSpinning.value = false;
      return;
    }

    // 6️⃣ 计算目标角度（比如转 10 圈）
    const rounds = 10;
    const targetDeg = 360 * rounds + target.angle;
    rotateDeg.value = targetDeg;
    console.log(rotateDeg.value)

    // 7️⃣ 动画结束后处理
    setTimeout(() => {
      show.value = false;
      showLucky.value = true;
      isSpinning.value = false;
    }, 4000);
  } catch (err) {
    // 错误处理
    showToast(t(errorMessages[err.code] || "抽奖失败，please_try_again_later"));
    isSpinning.value = false;
  }
};

const closeLucky = () => {
  showLucky.value = false;
};

const close1 = () => {
  show.value = false;
};

// 保留你原来的 defineExpose
defineExpose({
  open: async () => {
    show.value = true;
  },
  close: () => {
    show.value = false;
  },
});

onMounted(() => {
    // lotteryConfig();
});
</script>

<style scoped>
.wheel {
  position: relative;
  width: 100%;
  height: 100%;
}

.wheel-img {
  width: 100%;
  height: 100%;
  display: block;
}

.pointer-start {
  position: absolute;
  top: 47%;
  left: 49.5%;
  border-radius: 47px;
  text-align: center;
  line-height: 63px;
  font-size: 14px;
  font-weight: bold;
  color: #9d6116;
  transform: translate(-50%, -50%);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pointer-img {
  width: 31px;
  height: 31px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center; /* 保持围绕按钮中心旋转 */
}

.wheel-text {
  position: absolute;
  top: 43%;
  left: 46%;
  transform-origin: center bottom;
  font-size: 14px;
  font-weight: bold;
  color: #d17400;
}
</style>
