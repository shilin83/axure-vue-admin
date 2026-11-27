<script setup lang="ts">
import type { IconProps, IconEmits } from "./types";

import { Icon } from "@iconify/vue";

const { icon } = defineProps<IconProps>();
const emit = defineEmits<IconEmits>();
</script>

<template>
	<Icon :icon="icon" :width="width" :height="height" @click="emit('click')" />
</template>
