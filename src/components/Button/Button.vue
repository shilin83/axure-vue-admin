<script setup lang="ts">
import type { ButtonProps } from "./types";

const { icon, label } = defineProps<ButtonProps>();
</script>

<template>
	<ElButton>
		<template v-if="icon !== undefined" #icon>
			<Icon :icon="icon" />
		</template>

		{{ label }}
	</ElButton>
</template>
