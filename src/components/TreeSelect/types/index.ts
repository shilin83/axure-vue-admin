import type { TreeNodeData } from "element-plus";

interface TreeNode {
	id: number;
	label: string;
	parent?: TreeNode;
	children?: TreeNode[];
}

interface TreeSelectProps {
	data: TreeNodeData[];
}

export type { TreeSelectProps, TreeNode, TreeNodeData };
