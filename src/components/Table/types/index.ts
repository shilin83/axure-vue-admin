import type { TableProps as ElTableProps } from "element-plus";

interface TableProps extends Partial<ElTableProps> {
	/** 列配置 */
	schema: TableSchema[];
	/** 数据 */
	data: any[];
	/** 是否分页 */
	pagination?: boolean;
	/** 搜索配置（关键词 + 搜索字段），传入后表格按关键词过滤数据并联动分页 */
	search?: TableSearchOptions;
	/** 行是否可勾选（selection 列）：返回 false 的行禁用复选框 */
	selectable?: (row: any, index?: number) => boolean;
	/** 状态切换前置校验：返回 false 或 reject 时阻止切换（不传则允许直接切换） */
	beforeStatusChange?: (id: number, status: boolean) => Promise<void>;
}

interface TableSchema {
	/** 字段 */
	field: string;
	/** 标题 */
	label: string;
	/** 最小宽度 */
	minWidth?: string | number;
	/** 类型 */
	type?: "selection" | "index" | "expand";
	/** 是否可排序 */
	sortable?: boolean;
	/** 格式化函数 */
	formatter?: (row: any, column: any, cellValue: any, index: number) => VNode | string;
	/** 是否支持多选 */
	filterMultiple?: boolean;
	/** 筛选方法 */
	filterMethod?: (value: any, row: any) => boolean;
	/** 筛选配置 */
	filters?: {
		text: string;
		value: any;
	}[];
}

interface TableSearchOptions {
	/** 搜索关键词（外部经防抖处理后传入，空字符串表示不过滤） */
	keyword: string;
	/** 参与搜索的字段列表 */
	fields: string[];
}

interface SortProps {
	/** 排序字段 */
	prop: string;
	/** 排序顺序 */
	order: "ascending" | "descending" | null;
}

/** 筛选配置 */
interface TableFilter {
	text: string;
	value: string | number | boolean;
}

/** 表格插槽配置 */
type TableSlots = {
	expand?: (row: any) => VNode;
	operation?: (row: any) => VNode;
};

export type { TableProps, TableSchema, TableSearchOptions, SortProps, TableSlots, TableFilter };
