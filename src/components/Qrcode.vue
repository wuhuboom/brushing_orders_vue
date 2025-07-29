<template>
  <div class="flex flex-col gap-2">
    <div class="p-2 relative">
      <canvas ref="qrCodeCanvas"></canvas>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref,defineProps, watch } from 'vue';
import QRCode from 'qrcode';
const qrCodeCanvas = ref(null);
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 128
  }
});

watch(() => props.src, (newVal) => {
  if (newVal) {
    QRCode.toCanvas(qrCodeCanvas.value, newVal, {
      width: props.width || 128,
      margin: 2,
    }, function (error) {
      if (error) console.error(error);
      console.log('二维码生成成功！');
    });
  }
});

// onMounted(() => {
//   console.log('props.src:', props.src);
//   if (props.src) {
//     QRCode.toCanvas(qrCodeCanvas.value, props.src, {
//       width: props.width || 128,
//       margin: 2,
//     }, function (error) {
//       if (error) console.error(error);
//       console.log('二维码生成成功！');
//     });
//   }
// });
</script>