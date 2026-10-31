import type { TreeNodeData } from "element-plus";

/** 树选择框属性 */
interface TreeSelectProps {
	/** 树节点配置 */
	data: TreeNodeData[];
}

/** 树节点 */
interface TreeNode {
	id: number;
	label: string;
	parent?: TreeNode;
	children?: TreeNode[];
}

export type { TreeSelectProps, TreeNode, TreeNodeData };
