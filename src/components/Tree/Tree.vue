<script setup lang="ts">
import type { TreeProps } from "./types";
import type { TreeOptionProps } from "element-plus";

const props = defineProps<TreeProps>();

const treeOptionProps = computed<TreeOptionProps>(() => ({
	...{
		label: "name",
		children: "children",
	},
	...(props.readonly
		? {
				disabled: () => true,
			}
		: undefined),
}));
</script>

<template>
	<ElTree
		:data="props.data"
		:props="treeOptionProps"
		:node-key="TABLE_COLUMN.KEY.ID"
		:default-checked-keys="props.defaultCheckedKeys"
		accordion
		show-checkbox
		check-strictly
		check-on-click-node
	/>
</template>
