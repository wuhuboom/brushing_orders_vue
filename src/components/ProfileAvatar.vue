<script setup>
import avatarEditBadge from "@/static/psybir/online.png";

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
});

defineEmits(["error"]);
</script>

<template>
  <span class="profile-avatar-display">
    <span class="profile-avatar-display__portrait">
      <img :src="src" :alt="alt" @error="$emit('error', $event)" />
    </span>
    <img
      class="profile-avatar-display__online"
      :src="avatarEditBadge"
      alt=""
      aria-hidden="true"
    />
  </span>
</template>
