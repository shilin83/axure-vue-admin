/** 新增操作键 */
const ADD_KEY = "add";
/** 编辑操作键 */
const EDIT_KEY = "edit";
/** 删除操作键 */
const DELETE_KEY = "delete";
/** 审核操作键 */
const REVIEW_KEY = "review";
/** 防抖时长（毫秒） */
const DEBOUNCE_TIME = 200;
/** 延迟时长（毫秒） */
const DELAY_TIME = 2000;
/** 超管用户名 */
const ADMIN_USERNAME = "admin";
/** 默认密码 */
const DEFAULT_PASSWORD = "123456";
/** 邮箱后缀 */
const EMAIL_SUFFIX = "@axure.com";
/** 提示标题 */
const REMINDER_TITLE = "温馨提示";
/** 彻底删除提示文本 */
const DELETE_CONFIRM = "此操作不可恢复，确定删除吗？";
/** 供应商营业执照图片 */
const BUSINESS_LICENSE = "https://shilin83.oss-cn-beijing.aliyuncs.com/axure/images/businessLicense.jpg";
/** 商品图片 */
const PRODUCT_IMAGE = "https://shilin83.oss-cn-beijing.aliyuncs.com/axure/images/productImage.webp";

/** HTTP 状态码 */
const HTTP_CODE = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
} as const;

/** 响应提示信息 */
const RESPONSE_MESSAGE = {
	SERVER: "服务器错误，请稍后重试！",
	CREATE: "创建成功！",
	UPDATE: "更新成功！",
	DELETE: "删除成功！",
	RESTORE: "恢复成功！",
	CLEAR: "回收站已清空！",
	NOT_FOUND: "资源不存在！",
	BATCH_DESTROY: "批量删除完成！",
} as const;

/** 字典数据 */
const DICT_DATA = {
	BANK_NAME: {
		ABC: "农业银行",
		BOC: "中国银行",
		CCB: "建设银行",
		ICBC: "工商银行",
	},
	CAGETORY: {
		FRUIT: "水果",
		VEGETABLE: "蔬菜",
		MEAT: "肉类",
		SEAFOOD: "海鲜",
	},
	UNIT: {
		KG: "千克",
		BOX: "箱",
	},
	LEVEL: {
		DEFAULT: "",
		NORMAL: "正常",
		GOOD: "良好",
		EXCELLENT: "优秀",
		POOR: "较差",
		WORST: "劣质",
	},
} as const;

/** 状态文本映射 */
const STATUS_TEXT = {
	ENABLED: "启用",
	DISABLED: "禁用",
} as const;

/** 标签页 */
const ACTIVE_TAB = {
	LABEL: {
		DEFAULT: "数据列表",
		RECYCLE: "回收站",
	},
	KEY: {
		DEFAULT: "active",
		RECYCLE: "recycle",
	},
} as const;

/** 按钮属性 */
const BUTTON_MAP = {
	ADD: {
		KEY: ADD_KEY,
		LABEL: "新增",
		ICON: "mdi:plus",
	},
	EDIT: {
		KEY: EDIT_KEY,
		LABEL: "编辑",
		ICON: "mdi:square-edit-outline",
	},
	DELETE: {
		KEY: DELETE_KEY,
		LABEL: "删除",
		ICON: "mdi:delete-outline",
	},
	DETAIL: {
		KEY: "detail",
		LABEL: "详情",
		ICON: "mdi:eye-outline",
	},
	REVIEW: {
		KEY: REVIEW_KEY,
		LABEL: "审核",
		ICON: "mdi:account-edit-outline",
	},
	RESTORE: {
		KEY: "restore",
		LABEL: "恢复",
		ICON: "mdi:restore",
	},
	CLEAR: {
		KEY: "clear",
		LABEL: "清空",
		ICON: "mdi:delete-empty-outline",
	},
	CONFIRM: {
		KEY: "confirm",
		LABEL: "确认",
		ICON: "mdi:check",
	},
	CANCEL: {
		KEY: "cancel",
		LABEL: "取消",
		ICON: "mdi:close",
	},
	CLOSE: {
		KEY: "close",
		LABEL: "关闭",
		ICON: "mdi:close-circle-outline",
	},
	PASS: {
		KEY: "pass",
		LABEL: "通过",
		ICON: "mdi:check",
	},
	REJECT: {
		KEY: "reject",
		LABEL: "驳回",
		ICON: "mdi:close",
	},
	BATCH: {
		KEY: "batch",
		LABEL: "批量删除",
		ICON: "mdi:delete-forever-outline",
	},
} as const;

/** 表格列 */
const TABLE_COLUMN = {
	KEY: {
		ID: "id",
		SELECTION: "selection",
		CODE: "code",
		NAME: "name",
		STATUS: "status",
		CREATED_AT: "createdAt",
		UPDATED_AT: "updatedAt",
		DELETED_AT: "deletedAt",
	},
	LABEL: {
		ID: "序号",
		SELECTION: "",
		CODE: "标识",
		NAME: "名称",
		STATUS: "状态",
		CREATED_AT: "创建时间",
		UPDATED_AT: "更新时间",
		DELETED_AT: "删除时间",
	},
	WIDTH: {
		ID: 80,
		SELECTION: 60,
		OPERATION: 200,
		DEFAULT: 100,
	},
} as const;

const RECYCLE_SCHEMA = [
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.DELETED_AT,
		label: TABLE_COLUMN.LABEL.DELETED_AT,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
	},
];

/** 路由键 */
const ROUTE_KEY = {
	LOGIN: "login",
	HOME: "home",
	SYSTEM: "system",
	USER: "user",
	ROLE: "role",
	MENU: "menu",
	DEPARTMENT: "department",
	PERMISSION: "permission",
} as const;

/** 路由路径文本 */
const ROUTE_PATH = {
	[ROUTE_KEY.LOGIN]: "登录",
	[ROUTE_KEY.HOME]: "首页",
	[ROUTE_KEY.SYSTEM]: "系统管理",
	[ROUTE_KEY.USER]: "用户管理",
	[ROUTE_KEY.ROLE]: "角色管理",
	[ROUTE_KEY.MENU]: "菜单管理",
	[ROUTE_KEY.DEPARTMENT]: "部门管理",
	[ROUTE_KEY.PERMISSION]: "权限管理",
} as const satisfies Recordable<string, RouteKey>;

/** 权限码集合 */
const PERMISSION_CODE = {
	USER: ROUTE_KEY.USER,
	USER_ADD: `${ROUTE_KEY.USER}:${ADD_KEY}`,
	USER_EDIT: `${ROUTE_KEY.USER}:${EDIT_KEY}`,
	USER_DELETE: `${ROUTE_KEY.USER}:${DELETE_KEY}`,
	ROLE: ROUTE_KEY.ROLE,
	ROLE_ADD: `${ROUTE_KEY.ROLE}:${ADD_KEY}`,
	ROLE_EDIT: `${ROUTE_KEY.ROLE}:${EDIT_KEY}`,
	ROLE_DELETE: `${ROUTE_KEY.ROLE}:${DELETE_KEY}`,
	MENU: ROUTE_KEY.MENU,
	MENU_ADD: `${ROUTE_KEY.MENU}:${ADD_KEY}`,
	MENU_EDIT: `${ROUTE_KEY.MENU}:${EDIT_KEY}`,
	MENU_DELETE: `${ROUTE_KEY.MENU}:${DELETE_KEY}`,
	PERMISSION: ROUTE_KEY.PERMISSION,
	PERMISSION_ADD: `${ROUTE_KEY.PERMISSION}:${ADD_KEY}`,
	PERMISSION_EDIT: `${ROUTE_KEY.PERMISSION}:${EDIT_KEY}`,
	PERMISSION_DELETE: `${ROUTE_KEY.PERMISSION}:${DELETE_KEY}`,
	DEPARTMENT: ROUTE_KEY.DEPARTMENT,
	DEPARTMENT_ADD: `${ROUTE_KEY.DEPARTMENT}:${ADD_KEY}`,
	DEPARTMENT_EDIT: `${ROUTE_KEY.DEPARTMENT}:${EDIT_KEY}`,
	DEPARTMENT_DELETE: `${ROUTE_KEY.DEPARTMENT}:${DELETE_KEY}`,
} as const;

export {
	ACTIVE_TAB,
	ADMIN_USERNAME,
	BUSINESS_LICENSE,
	BUTTON_MAP,
	DICT_DATA,
	DEBOUNCE_TIME,
	DEFAULT_PASSWORD,
	DELAY_TIME,
	DELETE_CONFIRM,
	EMAIL_SUFFIX,
	HTTP_CODE,
	PERMISSION_CODE,
	PRODUCT_IMAGE,
	REMINDER_TITLE,
	RESPONSE_MESSAGE,
	ROUTE_KEY,
	ROUTE_PATH,
	RECYCLE_SCHEMA,
	STATUS_TEXT,
	TABLE_COLUMN,
};
