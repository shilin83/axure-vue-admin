<script setup lang="ts">
import type { CheckboxProps } from "./types";

import { isBoolean, isJSONArray } from "es-toolkit/predicate";

const props = defineProps<CheckboxProps>();
const model = defineModel<boolean | (string | number)[]>();
</script>

<template>
	<ElCheckbox v-if="props.label !== undefined && isBoolean(model)" v-model="model">
		{{ props.label }}
	</ElCheckbox>

	<ElCheckboxGroup v-if="props.options !== undefined && isJSONArray(model)" v-model="model" :max="props.max">
		<ElCheckbox v-for="option in props.options" :key="option.value" :value="option.value">
			{{ option.label }}
		</ElCheckbox>
	</ElCheckboxGroup>
</template>
