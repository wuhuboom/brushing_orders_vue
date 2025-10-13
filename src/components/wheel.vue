<template>
  <div>
    <van-popup
      v-model:show="show"
      :style="{ width: '80%', background: 'transparent' }"
    >
      <img src="@/static/images/lucky.png" class="w-full" alt="" />

      <!-- 静止转盘 -->
      <div class="wheel">
        <img src="@/static/images/wheel.png" class="wheel-img" />
      </div>

      <!-- 旋转箭头 -->
      <div class="pointer" @click="startDraw">
        <img
          src="@/static/images/pointer.png"
          class="pointer-img"
          :style="{
            transform: `rotate(${rotateDeg}deg)`,
            transition: transitionStyle,
          }"
        />
      </div>
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
          color="#6F1708"
          round
          class="w-[80%] mx-auto"
          @click="closeLucky"
          >{{ $t("确定") }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { getLotteryConfig, draw } from "../api/apis";
import { errorMessages } from "../api/errorCodeMap";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();
const show = ref(false);
const showLucky = ref(false);
const winPrize = ref("");
// 更符合Vue3习惯的暴露方式
const open = async () => {
  show.value = true;
};

const close = () => (show.value = false);

const rotateDeg = ref(0);
const isSpinning = ref(false);
const transitionStyle = ref(""); // 动态控制过渡样式

// 奖项配置（顺时针方向）
const prizeList = [
  { label: 80, angle: 270 },
  { label: 10, angle: 330 },
  { label: 20, angle: 30 },
  { label: 30, angle: 90 },
  { label: 50, angle: 150 },
  { label: 0, angle: 210 },
];

// 模拟接口返回
// const fakeApi = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const prizes = ["80", "10", "20$", "30$", "50$", "0"];
//       const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
//       resolve({ prize: randomPrize });
//     }, 500);
//   });
// };

const startDraw = async () => {
  if (isSpinning.value) return;
  isSpinning.value = true;

  // 1️⃣ 先重置角度和动画（清除上一次状态）
  transitionStyle.value = "";
  rotateDeg.value = 0;

  // 2️⃣ 等待 DOM 更新（下一帧再转动）
  await nextTick();

  // 模拟请求后端中奖结果

  try {
    const res = await draw();
    winPrize.value = res.data;
    const target = prizeList.find((p) => p.label === winPrize.value);

    if (!target) {
       showToast(t("未匹配到奖项"));
      isSpinning.value = false;
      return;
    }

    // 算出目标角度（箭头需要旋转的角度）
    const rounds = 10; // 转6圈
    const targetDeg = 360 * rounds + target.angle;
    rotateDeg.value = targetDeg;

    // 等动画结束后提示
    setTimeout(() => {
      show.value = false;
      showLucky.value = true;
      // alert(`🎉 恭喜抽中 ${winPrize}`);
    }, 4000);
  } catch (err) {
     showToast(t(errorMessages[err.code]));
  }
};

const closeLucky = () =>{
    showLucky.value = false;
}

defineExpose({
  open,
  close, // 新增关闭方法
});
</script>
<style scoped>
.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.wheel {
  width: 100%;
  height: 100%;
  /* transition: transform 4s cubic-bezier(0.33, 1, 0.68, 1); */
}

.wheel-img {
  width: 100%;
  height: 100%;
  display: block;
}

.pointer {
  position: absolute;
  top: 43%;
  left: 51.5%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.pointer-img {
  width: 58px;
  height: 81px;
  user-select: none;
  transform-origin: 50% 63%; /* ✅ 调整旋转中心到下方圆心 */
  transition: transform 4s cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
