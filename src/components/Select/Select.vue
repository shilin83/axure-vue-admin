<script setup lang="ts">
import type { SelectProps } from "./types";

const { options } = defineProps<SelectProps>();
const model = defineModel<string | number>();

const selectValue = computed<string | number | undefined>({
	get: () => (model.value === 0 ? undefined : model.value),
	set: (value) => (model.value = value === undefined ? 0 : value),
});
</script>

<template>
	<ElSelect v-model="selectValue" placeholder="请选择" :options="options" clearable />
</template>
