<script setup lang="ts">
import type { InputProps } from "./types";

const { slots, placeholder = "请输入" } = defineProps<InputProps>();
const model = defineModel<string>();
</script>

<template>
	<ElInput v-model="model" :placeholder="placeholder" clearable>
		<template v-if="slots?.prefix !== undefined" #prefix>
			<component :is="slots.prefix" />
		</template>

		<template v-if="slots?.suffix !== undefined" #suffix>
			<component :is="slots.suffix" />
		</template>
	</ElInput>
</template>
