<script setup lang="ts">
import type { TreeNode, TreeNodeData, TreeSelectProps } from "./types";
import type { CheckedInfo } from "element-plus";

const selectedKeys = defineModel<number[]>();
const props = defineProps<TreeSelectProps>();

const treeData = computed<TreeNode[]>(() => {
	/**
	 * 将 TreeNodeData 转换为 TreeNode，并递归为每个节点补充 parent 引用，便于向上回溯父级
	 *
	 * @param nodes 原始树节点数据列表
	 * @param parent 父级节点
	 *
	 * @returns 转换后的树节点列表
	 */
	function toTreeNode(nodes: TreeNodeData[], parent?: TreeNode): TreeNode[] {
		return nodes.map((node) => {
			const item: TreeNode = {
				id: node[TABLE_COLUMN.KEY.ID],
				label: node[TABLE_COLUMN.KEY.NAME],
				parent,
			};

			if (node["children"] !== undefined) {
				item.children = toTreeNode(node["children"], item);
			}

			return item;
		});
	}

	return toTreeNode(props.data);
});

/**
 * 获取节点下所有子孙节点 id
 *
 * @param node 树节点
 *
 * @returns 子孙节点 id 列表
 */
function getDescendantIds(node: TreeNode): number[] {
	return (node.children ?? []).flatMap((child) => [child.id, ...getDescendantIds(child)]);
}

/**
 * 专用check事件处理
 *
 * @param data 当前点击的节点
 * @param params 勾选状态信息（含当前勾选的 key 列表）
 *
 * @returns 无内容
 */
function handleCheckChange(data: TreeNode, params: CheckedInfo): void {
	const checkedKeys = params.checkedKeys as number[];
	/** 当前节点是否处于勾选状态 */
	const checked = checkedKeys.includes(data.id);

	if ((data.children?.length ?? 0) > 0) {
		/** 获取父级下所有子孙节点 id */
		const descendantIds = getDescendantIds(data);

		if (checked) {
			/** 选中父级，追加全部子孙节点 */
			selectedKeys.value = [...new Set([...checkedKeys, ...descendantIds])];
		} else {
			/** 取消选中父级，移除全部子孙节点 */
			selectedKeys.value = checkedKeys.filter((key) => !descendantIds.includes(key));
		}
	} else {
		const parentNode = data.parent as TreeNode;
		if (parentNode === undefined) return;

		const sibingIds = parentNode.children?.map((item) => item.id);

		if (checked) {
			/** 选中子节点把父级id添加到选中列表 */
			selectedKeys.value = [...new Set([...checkedKeys, parentNode.id])];
		} else {
			/** 取消子节点判断兄弟节点是否全部取消选中 */
			const remainCheckedSibing = sibingIds?.some((id) => checkedKeys.includes(id) && id !== data.id);
			let newKeys = [...checkedKeys];
			if (!remainCheckedSibing) {
				/** 没有任何兄弟节点选中，移除父级id */
				newKeys = newKeys.filter((key) => key !== parentNode.id);
			}
			selectedKeys.value = newKeys;
		}
	}
}
</script>

<template>
	<ElTreeSelect
		ref="treeSelectRef"
		v-model="selectedKeys"
		:data="treeData"
		:node-key="TABLE_COLUMN.KEY.ID"
		@check="handleCheckChange"
		check-strictly
		show-checkbox
		clearable
		multiple
		accordion
	/>
</template>
