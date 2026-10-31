<script setup lang="ts">
import type { DatePickerProps } from "./types";

const props = defineProps<DatePickerProps>();
const model = defineModel<string | number | Date>();
</script>

<template>
	<ElDatePicker
		v-model="model"
		:type="props.type"
		:format="props.format"
		:clearable="props.clearable"
		:placeholder="props.placeholder ?? '请选择'"
		:value-format="props.valueFormat ?? 'YYYY-MM-DD'"
		:disabled-date="props.disabledDate"
	/>
</template>
