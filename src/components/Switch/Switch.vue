<script setup lang="ts">
import type { SwitchProps } from "./types";

const { activeText = STATUS_TEXT[0], inactiveText = STATUS_TEXT[1] } = defineProps<SwitchProps>();
const status = defineModel<boolean>();
</script>

<template>
	<ElSwitch
		v-model="status"
		style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
		:disabled="disabled"
		:active-text="activeText"
		:inactive-text="inactiveText"
		:before-change="beforeChange"
		inline-prompt
	/>
</template>
