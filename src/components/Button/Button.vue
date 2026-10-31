<script setup lang="ts">
import type { ButtonEmits, ButtonProps } from "./types";

const emit = defineEmits<ButtonEmits>();
const props = defineProps<ButtonProps>();
</script>

<template>
	<ElButton
		:type="props.type"
		:disabled="props.disabled"
		:loading="props.loading"
		:size="props.size"
		:text="props.text"
		@click="emit('handleClick', $event)"
	>
		<template v-if="props.icon !== undefined" #icon>
			<Icon :icon="props.icon" />
		</template>
		{{ props.label }}
	</ElButton>
</template>
