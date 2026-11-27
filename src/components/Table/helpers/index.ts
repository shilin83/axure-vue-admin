/** 表格列映射 */
const TABLE_COLUMN = {
	KEY: {
		ID: "id",
		CODE: "code",
		NAME: "name",
		STATUS: "status",
		SELECTION: "selection",
		CREATED_AT: "createdAt",
		UPDATED_AT: "updatedAt",
	},
	LABEL: {
		ID: "序号",
		CODE: "编码",
		NAME: "名称",
		STATUS: "状态",
		SELECTION: "",
		CREATED_AT: "创建时间",
		UPDATED_AT: "更新时间",
	},
	WIDTH: {
		SELECTION: 60,
		ID: 80,
		DEFAULT: 100,
		OPERATION: 200,
	},
} as const;

export { TABLE_COLUMN };
