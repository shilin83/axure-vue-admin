<script setup lang="ts">
import type { PopoverProps } from "./types";

const props = defineProps<PopoverProps>();
const visible = defineModel<boolean>();
</script>

<template>
	<ElPopover v-model:visible="visible" :trigger="props.trigger ?? 'click'" :width="props.width ?? 400">
		<template #reference>
			<slot name="reference" />
		</template>
		<slot />
	</ElPopover>
</template>
