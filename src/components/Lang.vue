<template>
  <van-popup
    v-model:show="dialogVisible"
    round
    position="bottom"
    :style="{ height: '30%' }"
  >
    <!-- <template #header> -->
      <!-- <div>
        <div
          class="popup-header"
          @click="close"
        >
          <el-icon size="30px" style="margin-left: auto;">
            <Close />
          </el-icon>
        </div>
        <p class="text-[25px] mt-5 text-black">{{ $t("选择语言") }}</p>
      </div> -->
    <!-- </template> -->
     <!-- <div class="popup-body">
      <div class="flex flex-col gap-4 mt-[5px]">
      <div
        v-for="item in LANGS"
        :key="item.code"
        class="flex items-center gap-4"
        @click="handleChangeLang(item)"
      >
        <div class="w-full h-full flex flex-col  box-border">
          <div class="w-full h-16 flex items-center justify-center text-[#000] text-lg uppercase">{{item.name}}</div>
        </div>
      </div>
    </div>

     </div> -->

     <van-picker
      title=""
      :columns="LANGS_OBJ"
      :default-index="langIndex"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
    
  </van-popup>
</template>

<script setup>
import { ref,computed  } from "vue";
import { LANGS } from "@/config/lang";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "../store/modules/common";
import { useI18n } from "vue-i18n";
import { getStaticImageUrl } from "../util/utils";
import { useLocale } from "../util/useLocale";
const { locale } = useI18n();
const dialogVisible = ref(false);
const router = useRouter();
const commonStore = useCommonStore();
const { setLocale } = useLocale();

// 更符合Vue3习惯的暴露方式
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);
const LANGS_OBJ = Object.values(LANGS).map(item => ({
  text: item.name,   // picker 显示的内容
  value: item.code,  // 实际值
}))
const langIndex = computed(() => {
  console.log(LANGS_OBJ.findIndex(item => item.value === locale.value))
  return LANGS_OBJ.findIndex(item => item.value === locale.value)
})
// const columns = [
//       { text: '杭州', value: 'Hangzhou' },
//       { text: '宁波', value: 'Ningbo' },
//       { text: '温州', value: 'Wenzhou' },
//       { text: '绍兴', value: 'Shaoxing' },
//       { text: '湖州', value: 'Huzhou' },
//     ];
    const onConfirm = ({ selectedValues }) => {
      dialogVisible.value = false
      handleChangeLang(selectedValues)

      // showToast(`当前值: ${selectedValues.join(',')}`);
    };
    const onChange = ({ selectedValues }) => {
      handleChangeLang(selectedValues)
      // showToast(`当前值: ${selectedValues.join(',')}`);
    };
    const onCancel = () =>{
      dialogVisible.value = false
    }

defineExpose({
  open,
  close, // 新增关闭方法
});

function handleChangeLang(item) {
  if (commonStore.clientLang === item[0]) return;
  commonStore.updateLang(item[0]);
  dialogVisible.value = false
  locale.value = item[0];
  setLocale(locale.value);
  close();
}
</script>

<style scoped>
:deep(.el-drawer.btt) {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}
.popup-header {
  position: sticky; /* 关键 */
  top: 0;
  right:10px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
}
.popup-body {
  height: calc(100% - 48px); /* 减去 header 高度 */
  overflow-y: auto;
}
</style>
<style>
.header {
  margin: 0 !important;
  padding: 20px 20px 0 !important;
}
</style>
