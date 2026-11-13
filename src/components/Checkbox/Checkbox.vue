<script setup lang="ts">
import type { CheckboxProps } from "./types";

const { options } = defineProps<CheckboxProps>();
const model = defineModel<number[]>();
</script>

<template>
	<ElCheckboxGroup v-model="model">
		<ElCheckbox v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
	</ElCheckboxGroup>
</template>
