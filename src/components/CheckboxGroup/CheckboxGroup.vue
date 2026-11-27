<script setup lang="ts">
import type { CheckboxGroupProps } from "./types";

const { options } = defineProps<CheckboxGroupProps>();
const model = defineModel<number[]>();
</script>

<template>
	<ElCheckboxGroup v-model="model" :max="max">
		<ElCheckbox v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
	</ElCheckboxGroup>
</template>
