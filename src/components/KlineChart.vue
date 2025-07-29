<template>
  <div class="">

    <div class="mx-4">
      <div :id="`chart-${tradeStore.symbol}-main`" style="width: 100%; height: 300px"></div>
    </div>
    <div class="flex items-center gap-2 py-4 text-xs ">
      <div v-for="item in times" class="flex-1 bg-gray flex items-center justify-center h-8 rounded-[5px] text-[15px]" :class="item.value === periodValue ? 'text-[#FFF] bg-blue' : ''"
        @click="changePeriod(item)">{{ item.value }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { init, dispose } from 'klinecharts';
import { reqGetMarketHistoryData } from '../api/apis';
import { useMarketStore } from '../store/modules/market';
import { useTradeStore } from '../store/modules/trade';
const history = ref([]);
let styles = {
  grid: {
    show: false
  },
  candle: {
    // 'candle_solid' | 'candle_stroke' | 'candle_up_stroke' | 'candle_down_stroke' | 'ohlc' | 'area'
    type: 'candle_solid',
    bar: {
      // 'current_open' | 'previous_close'
      compareRule: 'current_open',
      upColor: '#0065ff',
      downColor: '#F92855',
      noChangeColor: '#888888',
      upBorderColor: '#0065ff',
      downBorderColor: '#F92855',
      noChangeBorderColor: '#888888',
      upWickColor: '#0065ff',
      downWickColor: '#F92855',
      noChangeWickColor: '#888888'
    },
    priceMark: {
      show: true,
      high: {
        show: true,
        color: '#666',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      low: {
        show: true,
        color: '#666',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
      last: {
        show: true,
        // 'current_open' | 'previous_close'
        compareRule: 'current_open',
        upColor: '#0065ff',
        downColor: '#F92855',
        noChangeColor: '#888888',
        line: {
          show: true,
          // 'solid' | 'dashed'
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1
        },
        text: {
          show: true,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          size: 12,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderSize: 0,
          borderColor: 'transparent',
          borderDashedValue: [2, 2],
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'none'
    }
  },
  indicator: {
    ohlc: {
      // 'current_open' | 'previous_close'
      compareRule: 'current_open',
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    },
    bars: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    }],
    lines: [
      {
        // 'solid' | 'dashed'
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#FF9600'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#935EBD'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#2196F3'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#E11D74'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#01C5C4'
      }
    ],
    circles: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    }],
    lastValueMark: {
      show: false,
      text: {
        show: false,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderSize: 1,
        borderDashedValue: [2, 2],
        paddingLeft: 4,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        borderRadius: 2
      }
    },
    tooltip: {
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      showName: true,
      showParams: true,
      defaultValue: 'n/a',
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4,
        marginLeft: 8
      },
      // e.g.
      // [{
      //    id: 'icon_id',
      //    position: 'left', // 'left', 'middle', 'right'
      //    marginLeft: 8,
      //    marginTop: 6,
      //    marginRight: 0,
      //    marginBottom: 0,
      //    paddingLeft: 1,
      //    paddingTop: 1,
      //    paddingRight: 1,
      //    paddingBottom: 1,
      //    size: 12,
      //    color: '#76808F',
      //    activeColor: '#76808F',
      //    backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //    activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
      //    type: 'path', // 'path', 'iconFont'
      //    path: {
      //      style: 'stroke', // 'stroke', 'fill'
      //      path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
      //      lineWidth: 1,
      //    },
      //    iconFont: {
      //      content: '\ue900',
      //      family: 'iconfont'
      //    }
      // }]
      features: []
    }
  },
  xAxis: {
    show: false,
  },
  yAxis: {
    show: true,
    size: 'auto',
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage' | 'log'
    type: 'normal',
    inside: false,
    reverse: false,
    axisLine: {
      show: true,
      color: '#ffffff',
      size: 1
    },
    tickText: {
      show: true,
      color: '#666666',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      marginStart: 4,
      marginEnd: 4
    },
    tickLine: {
      show: false,
    }
  },
  separator: {
    size: 1,
    color: '#888888',
    fill: true,
    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
  },
  crosshair: {
    show: true,
    horizontal: {
      show: true,
      line: {
        show: true,
        // 'solid' | 'dashed'
        style: 'dashed',
        dashedValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: '#686D76',
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    },
    vertical: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dashed'
        style: 'dashed',
        dashedValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: '#686D76',
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    }
  },
  overlay: {
    point: {
      color: '#1677FF',
      borderColor: 'rgba(22, 119, 255, 0.35)',
      borderSize: 1,
      radius: 5,
      activeColor: '#1677FF',
      activeBorderColor: 'rgba(22, 119, 255, 0.35)',
      activeBorderSize: 3,
      activeRadius: 5
    },
    line: {
      // 'solid' | 'dashed'
      style: 'solid',
      smooth: false,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderRadius: 0,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    polygon: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#1677FF',
      borderColor: '#1677FF',
      borderSize: 1,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    circle: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    arc: {
      // 'solid' | 'dashed'
      style: 'solid',
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    text: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2],
      borderSize: 0,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: '#1677FF'
    }
  }
}
const lastTime = ref(0);
const todayVolume = ref(0) // 今日交易量
const times = ref([
  {
    value: "Time",
    period: "1",
    chartType: 3,
  },
  {
    value: "1M",
    period: "1",
    chartType: 1,
  },
  {
    value: "5M",
    period: "5",
    chartType: 1,
  },
  {
    value: "30M",
    period: "30",
    chartType: 1,
  },
  {
    value: "1H",
    period: "60",
    chartType: 1,
  },
  {
    value: "1D",
    period: "1D",
    chartType: 1,
  }
]);
const period = ref('1');
const periodValue = ref('Time');
const tradeStore = useTradeStore();
const marketStore = useMarketStore();
const nowMarketDetail = computed(() => marketStore.allMarketObjects[tradeStore.symbol]);
let chart = null;
onMounted(() => {
  getKlineHistory();
});

onUnmounted(() => {
  dispose(`chart-${tradeStore.symbol}-main`);
});

watch(() => nowMarketDetail, (newVal, oldVal) => {
  if (newVal) {
    if (chart) updateKlineLast(newVal.value);
  }
}, { deep: true });

function setLineStyle() {
  chart.setStyles(styles);
}

function initKlineChart() {
  if (!chart) chart = init(`chart-${tradeStore.symbol}-main`);
  // chart.setPriceVolumePrecision(tradeStore.detail.scale);
  chart.setPrecision(tradeStore.detail.scale);
  chart.applyNewData(history.value);
  setLineStyle();

  // chart.setOffsetRightDistance(0);
}

function getKlineHistory() {
  let data = {
    type: 'kline',
    period: period.value,
    symbol: tradeStore.symbol,
    init: 1,
    end: 0,
  };
  reqGetMarketHistoryData(data).then(res => {
    for (let i = 0; i < res.length; i++) {
      let values = {};
      values.close = Number(res[i][4]);
      values.high = Number(res[i][2]);
      values.low = Number(res[i][3]);
      values.open = Number(res[i][1]);
      values.volume = Number(res[i][5]);
      values.timestamp = Number(res[i][0]) * 1000;
      history.value.push(values);
    }
    initKlineChart();
  })
}


function changePeriod(item) {
  if (item.value === periodValue.value) return;
  period.value = item.period;
  periodValue.value = item.value;
  history.value = [];
  getKlineHistory();
}

function updateKlineLast(rawData) {
  let lastData = history.value[history.value.length - 1];
  if (lastTime.value == 0) lastTime.value = rawData.time;
  if (rawData.time <= lastTime.value) return;
  lastTime.value = rawData.time;
  if (!lastData) return;
  if (todayVolume.value == 0) todayVolume.value = rawData.volume;
  let newPrice = Number(rawData.price);
  let newVol = Number(rawData.volume - todayVolume.value);
  // 先判断是否是同一分钟
  let isSame = isSameMinute(lastData.timestamp, rawData.time, period.value);
  if (isSame) {
    // 最新价高于当前最高价
    if (newPrice > lastData.high) {
      lastData.high = newPrice;
    }
    // 最新价低于当前最低价
    if (newPrice < lastData.low) {


      lastData.low = newPrice;
    }
    lastData.close = newPrice;
    const newData = { ...lastData };
    newData.volume += newVol;
    newData.close = newPrice;
    // console.log('同一分钟', JSON.stringify(newData));
    chart.updateData(newData);
  } else {
    let newData = {};
    newData.close = newPrice;
    newData.high = newPrice;
    newData.low = newPrice;
    newData.open = lastData.close;
    newData.volume = newVol;
    newData.timestamp = Number(rawData.time);
    todayVolume.value = rawData.volume;
    chart.updateData(newData);
  }

  function isSameMinute(oldTime, newTime, period) {
    const date1 = new Date(Number(oldTime));
    const date2 = new Date(Number(newTime));
    // period  0-1min, 1-5min, 2-15min, 3-30min, 4-60min, 5-4hour, 6-1day,7-1week, 8-1mon
    if (period == 1) {
      if (date1.getMinutes() == date2.getMinutes()) {
        return true;
      }
    } else if (period == 5) {
      if (date2.getMinutes() >= date1.getMinutes() && date2.getMinutes() <= (date1.getMinutes() + 5)) {
        return true;
      }
    }
    else if (period == 30) {
      if (date2.getMinutes() >= date1.getMinutes() && date2.getMinutes() <= (date1.getMinutes() + 30)) {
        return true;
      }
    } else if (period == 60) {
      if (date2.getHours() >= date1.getHours() && date2.getHours() <= (date1.getHours() + 1)) {
        return true;
      }
    }
    else if (period == '1D') {
      if (date1.getDay() == date2.getDay()) {
        return true;
      }
    }
    return false;
  }
}
</script>