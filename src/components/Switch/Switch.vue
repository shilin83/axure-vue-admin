<script setup lang="ts">
import type { SwitchProps } from "./types";

const props = defineProps<SwitchProps>();
const status = defineModel<boolean>();
</script>

<template>
	<ElSwitch
		v-model="status"
		style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
		:disabled="props.disabled"
		:before-change="props.beforeChange"
		:active-text="STATUS_TEXT.ENABLED"
		:inactive-text="STATUS_TEXT.DISABLED"
		inline-prompt
	/>
</template>
