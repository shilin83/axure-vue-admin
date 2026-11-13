/** 防抖时长（毫秒） */
const DEBOUNCE_TIME = 200;
/** 延迟时长（毫秒） */
const DELAY_TIME = 2000;

/** 状态文本 */
const STATUS_TEXT = {
	ENABLED: "启用",
	DISABLED: "禁用",
} as const;

/** 按钮映射 */
const BUTTON_MAP = {
	ADD: {
		LABEL: "新增",
		ICON: "mdi:plus",
	},
	EDIT: {
		LABEL: "编辑",
		ICON: "mdi:square-edit-outline",
	},
	DELETE: {
		LABEL: "删除",
		ICON: "mdi:delete-outline",
	},
	CONFIRM: {
		LABEL: "确认",
		ICON: "mdi:check",
	},
	CANCEL: {
		LABEL: "取消",
		ICON: "mdi:close",
	},
	PREV: {
		LABEL: "上一步",
		ICON: "mdi:arrow-left",
	},
	NEXT: {
		LABEL: "下一步",
		ICON: "mdi:arrow-right",
	},
	CLOSE: {
		LABEL: "关闭",
		ICON: "mdi:close",
	},
	DETAIL: {
		LABEL: "详情",
		ICON: "mdi:eye-outline",
	},
	SEARCH: {
		LABEL: "搜索",
		ICON: "mdi:magnify",
	},
	BATCH_DESTROY: {
		LABEL: "批量删除",
		ICON: "mdi:delete-forever-outline",
	},
} as const;

/** 表格列映射 */
const TABLE_COLUMN = {
	KEY: {
		ID: "id",
		SELECTION: "selection",
		CODE: "code",
		NAME: "name",
		STATUS: "status",
		CREATED_AT: "createdAt",
		UPDATED_AT: "updatedAt",
	},
	LABEL: {
		ID: "序号",
		SELECTION: "",
		CODE: "标识",
		NAME: "名称",
		STATUS: "状态",
		CREATED_AT: "创建时间",
		UPDATED_AT: "更新时间",
	},
	WIDTH: {
		ID: 80,
		OPERATION: 200,
		DEFAULT: 100,
	},
} as const;

export { BUTTON_MAP, DEBOUNCE_TIME, DELAY_TIME, STATUS_TEXT, TABLE_COLUMN };
