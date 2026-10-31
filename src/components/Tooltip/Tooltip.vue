<script setup lang="ts">
import type { TooltipProps } from "./types";

const props = defineProps<TooltipProps>();
</script>

<template>
	<ElTooltip :content="props.content" :placement="props.placement">
		<slot />
	</ElTooltip>
</template>
