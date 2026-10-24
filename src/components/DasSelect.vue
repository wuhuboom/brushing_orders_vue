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
      <slot name="selected" :option="selectedOption" :label="selectedLabel">
        <span
          class="das-select__label"
          :class="{ 'is-placeholder': !selectedOption }"
        >
          {{ selectedLabel }}
        </span>
      </slot>
      <img class="das-select__chevron" src="/psybir/chevron-down.png" alt="" />
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
        <slot name="option" :option="option" :label="optionLabel(option)">
          <span>{{ optionLabel(option) }}</span>
        </slot>
        <img
          v-if="isSelected(option)"
          class="das-select__check"
          src="/psybir/checkbox-checked.png"
          alt=""
        />
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
