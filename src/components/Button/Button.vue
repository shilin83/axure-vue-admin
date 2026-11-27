<script setup lang="ts">
import type { ButtonProps, ButtonEmits } from "./types";

const { icon, label } = defineProps<ButtonProps>();
const emit = defineEmits<ButtonEmits>();
</script>

<template>
	<ElButton
		:type="type"
		:loading="loading"
		:size="size"
		:disabled="disabled"
		:color="color"
		:text="text"
		@click="emit('click')"
	>
		<template v-if="icon !== undefined" #icon>
			<Icon :icon="icon" />
		</template>

		{{ label }}
	</ElButton>
</template>
