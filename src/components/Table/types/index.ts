import type { TableProps as ElTableProps } from "element-plus";

interface TableProps extends Partial<ElTableProps> {
	/** 数据 */
	data: any[];
	/** 列配置 */
	schema: TableSchema[];
	/** 操作按钮配置：配置后默认渲染对应按钮，并校验点击权限 */
	operation?: TableOperation;
	/** 搜索配置 */
	search?: SearchOptions;
	/** 行是否可勾选（selection 列）：返回 false 的行禁用复选框 */
	selectable?: (row: any, index?: number) => boolean;
	/** 是否分页 */
	pagination?: boolean;
}

interface TableSchema {
	/** 字段 */
	field: string;
	/** 标题 */
	label: string;
	/** 类型 */
	type?: "selection" | "index" | "expand";
	/** 是否可排序 */
	sortable?: boolean;
	/** 最小宽度 */
	minWidth?: string | number;
	/** 格式化函数 */
	formatter?: (row: any, column: any, cellValue: any, index: number) => VNode | string;
	/** 筛选方法 */
	filterMethod?: (value: any, row: any) => boolean;
	/** 筛选配置 */
	filters?: {
		text: string;
		value: any;
	}[];
}

type TableEmits = {
	add: [];
	edit: [row: any];
	delete: [id: Arrayable<number>];
};

type TableOperation = {
	/** 新增按钮权限 */
	add?: PermissionCode;
	/** 编辑按钮权限 */
	edit?: PermissionCode;
	/** 删除按钮权限 */
	delete?: PermissionCode;
	/** 批量删除按钮权限 */
	batchDestroy?: PermissionCode;
};

type SortProps = {
	/** 排序字段 */
	prop: Nullable<string>;
	/** 排序顺序 */
	order: Nullable<"ascending" | "descending">;
};

type SearchOptions = {
	/** 搜索关键词（外部经防抖处理后传入，空字符串表示不过滤） */
	keyword: string;
	/** 参与搜索的字段列表 */
	fields: Recordable<string>[];
};

export type { TableProps, TableOperation, TableEmits, TableSchema, SortProps, SearchOptions };
