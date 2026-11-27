interface TreeProps {
	/** 树形数据 */
	data: Recordable<any>[];
	/** 是否只读：全部节点禁用，仅展示勾选状态 */
	readonly?: boolean;
}

export type { TreeProps };
