<script setup lang="ts">
import type { TagProps } from "./types";

const props = defineProps<TagProps>();
</script>

<template>
	<ElTag :type="props.type" :size="props.size" :effect="props.effect" :round="props.round">
		{{ props.text }}
	</ElTag>
</template>
