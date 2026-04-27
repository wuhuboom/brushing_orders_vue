<template>
  <div style="width: 100%; height: 60px;" class="relative">
    <div :id="`chart-${props.data.symbol}`" style="width: 100%; height: 60px;"  class="relative"></div>
    <div class="absolute top-0 left-0 right-0 bottom-0 z-10"></div>
  </div>

</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { init, dispose } from 'klinecharts';
import { reqGetMarketHistoryData } from '../api/apis';
import { useMarketStore } from '../store/modules/market';
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  history: {
    type: Array,
    required: false,
  },
});
let styles = {
  grid: {
    show: false,
    horizontal: {
      show: false,
    },
    vertical: {
      show: false,
    },
  },
  candle: {
    // 'candle_solid' | 'candle_stroke' | 'candle_up_stroke' | 'candle_down_stroke' | 'ohlc' | 'area'
    type: 'area',
    area: {
      point: {
        show: false,
      },
      // 修改面积图的填充颜色
      colors: {
        up: 'rgba(0, 101, 255, 0.1)',
        down: 'rgba(240, 81, 80, 0.1)',
      },
      lineSize: 2,
      backgroundColor: [{
        offset: 0,
      }, {
        offset: 1,
      }],
    },
    priceMark: {
      show: false,

    },
    tooltip: {
      showRule: 'none',
      offsetLeft: 0,
      offsetTop: 0,
      offsetRight: 0,
      offsetBottom: 0,
    }
  },
  xAxis: {
    show: false,
  },
  yAxis: {
    show: false,
  },
  separator: {
    size: 1,
    color: '#888888',
    fill: false,
    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
  },
  tooltip: {
    show: false,
    offsetLeft: 0,
    offsetTop: 0,
    offsetRight: 0,
    offsetBottom: 0,
  },
  crosshair: {
    show: false,
  },
}
const lastTime = ref(0);
// const marketStore = useMarketStore();
// const nowMarketDetail = computed(() => marketStore.allMarketObjects[props.data.symbol]);
let chart = null;
onMounted(() => {

  // if (props.history.length > 0) {
  //   initKlineChart(props.history);
  // }
});

onUnmounted(() => {
  dispose(`chart-${props.data.symbol}`);
});

watch(props.history, (newVal, oldVal) => {
  if (newVal.length > 0) {
    if (lastTime.value === newVal[newVal.length - 1].time) {
      return;
    }
    lastTime.value = newVal[newVal.length - 1].time;
    initKlineChart(newVal);
  }
});

function setLineStyle() {
  if (props.data && props.data.rate) {
    if (Number(props.data.rate) > 0) {
      styles.candle.area.backgroundColor[0].color = 'rgba(0, 101, 255, 0.1)';
      styles.candle.area.backgroundColor[1].color = 'rgba(0, 101, 255, 0.2)';
      styles.candle.area.lineColor = '#0065ff';
    } else {
      styles.candle.area.backgroundColor[0].color = 'rgba(0, 101, 255, 0.1)';
      styles.candle.area.backgroundColor[1].color = 'rgba(0, 101, 255, 0.2)';
      styles.candle.area.lineColor = '#0065ff';
    }
  } else {
    styles.candle.area.backgroundColor[0].color = 'rgba(0, 101, 255, 0.1)';
    styles.candle.area.backgroundColor[1].color = 'rgba(0, 101, 255, 0.2)';
    styles.candle.area.lineColor = '#0065ff';
  }
  if (chart !== null) chart.setStyles(styles);
}

function initKlineChart() {
  chart = init(`chart-${props.data.symbol}`);
  // chart.setPriceVolumePrecision(props.data.scale);
  chart.applyNewData(props.history);
  setLineStyle();
  chart.setOffsetRightDistance(0);
  chart.setZoomEnabled(false);
  chart.setScrollEnabled(false);
}
</script>