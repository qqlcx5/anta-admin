<script setup lang="ts">
import { toRaw } from "vue";

defineProps({
  extraIcon: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <div v-if="extraIcon" class="flex-c text-amber-500">
    <AtIcon :icon="toRaw(extraIcon)" class="size-3.5" />
  </div>
</template>
