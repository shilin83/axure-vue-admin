<script setup lang="ts">
import type { TreeProps } from "./types";
import type { TreeOptionProps } from "element-plus";

const { readonly = false } = defineProps<TreeProps>();

const treeOptionProps = computed<TreeOptionProps>(() => ({
	label: "name",
	children: "children",
	disabled: () => readonly,
}));
</script>

<template>
	<ElTree
		:data="data"
		:props="treeOptionProps"
		:node-key="TABLE_COLUMN.KEY.ID"
		accordion
		show-checkbox
		check-strictly
		check-on-click-node
	/>
</template>
