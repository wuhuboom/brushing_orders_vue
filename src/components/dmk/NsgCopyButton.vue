<template>
  <button ref="button" class="nsg-copy-button" type="button" :disabled="value === '' || value === null || value === '—'" :aria-label="$t('das.nsg.copy')" :title="$t('das.nsg.copy')" @click.stop="copy($t)"><NsgUiIcon name="copy" /></button>
</template>
<script setup>
import { showToast } from "vant";
import { ref } from "vue";
import NsgUiIcon from "./NsgUiIcon.vue";
const props = defineProps({ value: { type: [String, Number], default: "" } });
const button = ref(null);
const fallbackCopy = (value) => {
  const previousFocus = document.activeElement;
  const input = document.createElement("textarea");
  input.value = value;
  input.readOnly = true;
  input.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;font-size:16px";
  // Keep the selection inside the active popup so its focus trap cannot steal it.
  (button.value?.closest('.van-popup') || document.body).appendChild(input);
  let copied = false;
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, value.length);
    copied = document.execCommand("copy");
  } catch (_) {
    copied = false;
  } finally {
    input.remove();
    previousFocus?.focus({ preventScroll: true });
  }
  return copied;
};
const copy = async (translate) => {
  const value = String(props.value ?? "");
  if (!value || value === "—") return;
  let copied = false;
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); copied = true; } catch (_) {}
  }
  // On HTTP/LAN pages without Clipboard API this runs during the original click.
  if (!copied) copied = fallbackCopy(value);
  showToast({ message: translate(copied ? "das.profile.copySuccess" : "das.profile.copyFailed"), zIndex: 10000 });
};
</script>
<style>
html .nsg-copy-button { display: inline-grid; place-items: center; flex-shrink: 0; width: 28px; height: 28px; padding: 4px; border: 0; background: transparent; color: #8999b2; font-size: 19px; cursor: pointer; }
html .nsg-copy-button:hover { color: #68baff; }
html .nsg-copy-button:disabled { opacity: .35; cursor: default; }
</style>
