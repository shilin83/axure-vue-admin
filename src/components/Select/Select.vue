<script setup lang="ts">
import type { SelectProps } from "./types";

const props = defineProps<SelectProps>();
const model = defineModel<number | string>();

/** 展示值代理：0 归一为 undefined 以显示占位符，清空时回落为 0 保持既有语义 */
const selectValue = computed<number | string | undefined>({
	get: () => (model.value === 0 ? undefined : model.value),
	set: (value) => (model.value = value ?? 0),
});
</script>

<template>
	<ElSelect v-model="selectValue" placeholder="请选择" :options="props.options" :disabled="props.disabled" clearable />
</template>
