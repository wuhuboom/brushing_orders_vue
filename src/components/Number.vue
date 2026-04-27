<template>
  <div class="w-full">
    <div class="flex items-center">
      <span v-if="prefix" class="text-base">{{ prefix }}<span class="text-sm opacity-50 ml-2.5" v-if="lastPrefix">{{
        lastPrefix
          }}</span></span>
      <div class="ml-auto" v-if="showSet">
        <img src="@/static/images/selected-check.png" alt="" class="w-5 h-5 ml-atuo" v-if="props.isSet" @click="handleChangeIsSet">
        <img src="@/static/images/selected-uncheck.png" alt=""class="w-5 h-5 ml-atuo" v-else @click="handleChangeIsSet">
      </div>

    </div>

    <div class="flex items-center gap-2 mt-4">
      <div class="bg-gray w-[50px] h-[50px] flex items-center justify-center rounded-2.5" @click="decrement"><el-icon
          size="24">
          <Minus />
        </el-icon></div>
      <input type="text" v-model="value" @input="updateValue($event.target.value)"
        class="flex-1 bg-gray h-[50px] rounded-2.5 text-center text-base" :placeholder="placeholder" :disabled="!props.isSet" />
      <div class="bg-gray w-[50px] h-[50px] flex items-center justify-center rounded-2.5" @click="increment"><el-icon
          size="24">
          <Plus />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import BigNumber from 'bignumber.js';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true,
  },
  prefix: {
    type: String,
    default: '',
  },
  lastPrefix: {
    type: String,
    default: '',
  },
  showSet: {
    type: Boolean,
    default: false,
  },
  isSet: {
    type: Boolean,
    default: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'changeIsSet']);

const value = ref(props.modelValue);
const isSet = ref(true);

watch(() => props.modelValue, (newValue) => {
  value.value = newValue;
});

const updateValue = (newValue) => {
  // 更完善的正则表达式处理
  const data = newValue.replace(/[^\d.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^\./g, '0.')
    .replace(/^(\d*\.?\d*).*$/, '$1');

  value.value = data;
  emit('update:modelValue', data);
};

const increment = () => {
  if(props.isSet === false){
    return;
  }
  const newValue = new BigNumber(value.value).plus(props.step).toFixed();
  value.value = newValue;
  emit('update:modelValue', newValue);
};

const decrement = () => {
  if(props.isSet === false){
    return;
  }
  const current = new BigNumber(value.value);
  if(current.minus(props.step).isLessThanOrEqualTo(0)) {
    value.value = '0';
    emit('update:modelValue', '0');
    return;
  }
  const newValue = current.minus(props.step).toFixed();
  value.value = newValue;
  emit('update:modelValue', newValue);
};

const handleChangeIsSet = () => {
  emit('changeIsSet', !props.isSet);
}
</script>

<style scoped>
.number-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.prefix {
  margin-right: 8px;
}

.input {
  flex: 1 1 0;
  text-align: left;
}

.buttons {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
}
</style>