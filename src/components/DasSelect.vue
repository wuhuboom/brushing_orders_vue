<template>
  <div ref="root" class="das-select" :class="{ 'is-open': open }">
    <button
      class="das-select__trigger"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="ariaLabel"
      @click.stop="open = !open"
      @keydown.esc="open = false"
    >
      <span
        class="das-select__label"
        :class="{ 'is-placeholder': !selectedOption }"
      >
        {{ selectedLabel }}
      </span>
      <svg
        class="das-select__chevron"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
      </svg>
    </button>

    <div
      v-if="open"
      class="das-select__menu"
      role="listbox"
      :aria-label="ariaLabel"
    >
      <button
        v-for="(option, index) in options"
        :key="String(optionValue(option)) || index"
        type="button"
        role="option"
        :aria-selected="isSelected(option)"
        :class="{ 'is-selected': isSelected(option) }"
        @click="select(option)"
      >
        <span>{{ optionLabel(option) }}</span>
        <svg v-if="isSelected(option)" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m5 12 4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: "" },
  options: { type: Array, default: () => [] },
  labelKey: { type: String, default: "label" },
  valueKey: { type: String, default: "value" },
  getLabel: { type: Function, default: null },
  placeholder: { type: String, default: "—" },
  ariaLabel: { type: String, default: "" },
  stringValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "change"]);
const root = ref(null);
const open = ref(false);

const optionValue = (option) => option?.[props.valueKey];
const optionLabel = (option) =>
  props.getLabel ? props.getLabel(option) : option?.[props.labelKey] ?? "—";
const isSelected = (option) =>
  String(optionValue(option)) === String(props.modelValue);
const selectedOption = computed(() => props.options.find(isSelected));
const selectedLabel = computed(() =>
  selectedOption.value ? optionLabel(selectedOption.value) : props.placeholder,
);

const select = (option) => {
  const rawValue = optionValue(option);
  const value = props.stringValue ? String(rawValue ?? "") : rawValue;
  emit("update:modelValue", value);
  emit("change", option);
  open.value = false;
};
const closeOnOutside = (event) => {
  if (root.value && !root.value.contains(event.target)) open.value = false;
};

onMounted(() => document.addEventListener("pointerdown", closeOnOutside));
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOnOutside));
</script>

<style scoped>
.das-select {
  position: relative;
  width: 100%;
}
.das-select.is-open {
  z-index: 70;
}
.das-select__trigger {
  width: 100%;
  height: 58px;
  padding: 0 17px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #d7dbd2;
  border-radius: 999px;
  color: #17382d;
  background: #fff;
  font-size: 15px;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.das-select.is-open .das-select__trigger,
.das-select__trigger:focus-visible {
  border-color: #4d806d;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(77, 128, 109, 0.12);
}
.das-select__trigger .is-placeholder {
  color: #9ca49f;
}
.das-select__label {
  min-width: 0;
  height: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.das-select__chevron {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  color: #607269;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: rotate(0deg);
  transform-origin: 50% 50%;
  transition: transform 180ms ease;
}
.das-select.is-open .das-select__chevron {
  transform: rotate(180deg);
}
.das-select__menu {
  position: absolute;
  z-index: 1;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 230px;
  overflow-y: auto;
  padding: 7px;
  border: 1px solid rgba(247, 245, 236, 0.24);
  border-radius: 18px;
  background: #17382d;
  box-shadow: 0 18px 38px rgba(10, 38, 28, 0.25);
}
.das-select__menu button {
  width: 100%;
  min-height: 44px;
  padding: 9px 12px;
  display: grid;
  grid-template-columns: 1fr 20px;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 12px;
  color: rgba(247, 245, 236, 0.82);
  background: transparent;
  font-size: 14px;
  text-align: left;
}
.das-select__menu button:hover,
.das-select__menu button.is-selected {
  color: #fff;
  background: rgba(247, 245, 236, 0.1);
}
.das-select__menu svg {
  width: 18px;
  height: 18px;
  stroke: #ed9b87;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
