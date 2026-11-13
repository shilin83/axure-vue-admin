<script setup lang="ts">
import type { TreeProps } from "./types";
import type { TreeOptionProps } from "element-plus";

const { data, readonly = false } = defineProps<TreeProps>();

const treeOptionProps = computed<TreeOptionProps>(() => ({
	label: "name",
	children: "children",
	disabled: () => readonly,
}));
</script>

<template>
	<ElTree
		v-if="data.length > 0"
		:data="data"
		:props="treeOptionProps"
		:node-key="TABLE_COLUMN.KEY.ID"
		accordion
		show-checkbox
		check-strictly
		check-on-click-node
	/>

	<ElEmpty v-else description="暂无数据" />
</template>
