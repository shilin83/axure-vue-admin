<script setup lang="ts">
import type { LinkProps } from "./types";

const props = defineProps<LinkProps>();
</script>

<template>
	<ElLink :type="props.type" :underline="props.underline">
		<template v-if="props.icon !== undefined" #icon>
			<Icon :icon="props.icon" />
		</template>
		{{ props.label }}
	</ElLink>
</template>
