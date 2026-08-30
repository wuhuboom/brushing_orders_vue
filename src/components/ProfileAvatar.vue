<script setup>
import avatarEditBadge from "@/static/brain/edit-profile.png";

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
      class="profile-avatar-display__edit"
      :src="avatarEditBadge"
      alt=""
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
.profile-avatar-display {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.profile-avatar-display__portrait {
  position: absolute;
  inset: 4%;
  overflow: hidden;
  border-radius: 50%;
  background: #f4f5f8;
  border: 2px solid #1688ff;
  box-shadow: 0 0 14px rgba(0, 111, 255, 0.42);
}

.profile-avatar-display__portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-display__edit {
  position: absolute;
  right: 0;
  bottom: 1.5%;
  width: 29%;
  height: 29%;
  pointer-events: none;
}
</style>
