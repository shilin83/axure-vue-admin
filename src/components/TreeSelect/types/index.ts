import type { TreeNodeData } from "element-plus";

interface TreeSelectProps {
	data: TreeNodeData[];
	placeholder?: string;
	disabled?: boolean;
}

interface TreeNode {
	id: number;
	label: string;
	parent?: TreeNode;
	children?: TreeNode[];
}

export type { TreeSelectProps, TreeNode };
